"use client";

import { useEffect, useRef } from "react";
import type { Vector3 } from "three";
import { hasWebGL, isReducedMotion } from "@/lib/env";

type Variant = "frame" | "span";

type Props = {
  variant: Variant;
  className?: string;
  /** frame: inset from the host edge in px. span: vertical anchor (0..1 of host height). */
  inset?: number;
  /** 0..1 how hot the chain burns; can be driven from scroll via the `data-heat` attribute. */
  heat?: number;
};

/**
 * Heavy, worn steel chain rendered as a single InstancedMesh.
 * Even links face the camera, odd links are rotated 90° about the path tangent,
 * exactly like a real welded chain. A heat pulse travels along the links; a very
 * rare link carries a faint supernatural blue.
 */
export default function ChainCanvas({ variant, className = "", inset = 18, heat = 0.6 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef(heat);
  useEffect(() => {
    heatRef.current = heat;
  }, [heat]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!hasWebGL()) {
      host.classList.add("chain--fallback");
      return;
    }
    let disposed = false;
    let cleanup = () => {};

    Promise.all([import("three"), import("three/examples/jsm/environments/RoomEnvironment.js")]).then(
      ([THREE, { RoomEnvironment }]) => {
        if (disposed) return;
        const reduced = isReducedMotion();
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        } catch {
          host.classList.add("chain--fallback");
          return;
        }
        const small = window.innerWidth < 768;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;
        scene.environmentIntensity = 0.6;

        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
        camera.position.set(0, 0, 20);

        // Oval link: torus squashed along the tangent axis.
        const linkGeo = new THREE.TorusGeometry(0.5, 0.15, small ? 8 : 12, small ? 18 : 28);
        linkGeo.scale(1.45, 0.82, 1);

        const heatUniform = { value: 0.6 };
        const mat = new THREE.MeshStandardMaterial({
          color: 0x3d4149,
          metalness: 0.92,
          roughness: 0.42,
        });
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uHeat = heatUniform;
          shader.fragmentShader = shader.fragmentShader
            .replace("#include <color_fragment>", "")
            .replace(
              "#include <emissivemap_fragment>",
              "#include <emissivemap_fragment>\n#ifdef USE_INSTANCING_COLOR\n totalEmissiveRadiance += vColor * uHeat;\n#endif",
            )
            .replace("void main() {", "uniform float uHeat;\nvoid main() {");
        };

        const MAX = 220;
        const mesh = new THREE.InstancedMesh(linkGeo, mat, MAX);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3);
        mesh.frustumCulled = false;
        scene.add(mesh);

        const fire = new THREE.PointLight(0xff6a1a, 60, 40, 1.6);
        const fire2 = new THREE.PointLight(0xff8a2a, 30, 40, 1.6);
        const spirit = new THREE.PointLight(0x5aa8ff, 6, 30, 2);
        scene.add(fire, fire2, spirit, new THREE.AmbientLight(0x1a2233, 0.6));

        let W = 1;
        let H = 1;
        let worldPerPx = 0.01;
        let linkScale = 1;
        const resize = () => {
          W = Math.max(1, host.clientWidth);
          H = Math.max(1, host.clientHeight);
          renderer.setSize(W, H, false);
          camera.aspect = W / H;
          camera.updateProjectionMatrix();
          const visibleH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
          worldPerPx = visibleH / H;
          const linkPx = small ? 22 : 30;
          linkScale = (linkPx * worldPerPx) / 1.45;
          fire.position.set((-W / 2) * worldPerPx * 0.4, (-H / 2) * worldPerPx - 1, 4);
          fire2.position.set((W / 2) * worldPerPx * 0.6, (H / 2) * worldPerPx * 0.2, 5);
          spirit.position.set((W / 2) * worldPerPx, (H / 2) * worldPerPx + 1, 3);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        // ---- path sampling -------------------------------------------------
        const tmpM = new THREE.Matrix4();
        const q = new THREE.Quaternion();
        const qTwist = new THREE.Quaternion();
        const xAxis = new THREE.Vector3(1, 0, 0);
        const tan = new THREE.Vector3();
        const pos = new THREE.Vector3();
        const scl = new THREE.Vector3();
        const col = new THREE.Color();

        /** Point + tangent on a rounded rectangle perimeter at arc length s. */
        const rectPoint = (s: number, w: number, h: number, r: number, out: Vector3, t: Vector3) => {
          const straightW = w - 2 * r;
          const straightH = h - 2 * r;
          const arc = (Math.PI / 2) * r;
          const per = 2 * straightW + 2 * straightH + 4 * arc;
          s = ((s % per) + per) % per;
          const segs: [number, (u: number) => void][] = [
            [straightW, (u) => { out.set(-w / 2 + r + u, h / 2, 0); t.set(1, 0, 0); }],
            [arc, (u) => { const a = Math.PI / 2 - u / r; out.set(w / 2 - r + Math.cos(a) * r, h / 2 - r + Math.sin(a) * r, 0); t.set(Math.sin(a), -Math.cos(a), 0); }],
            [straightH, (u) => { out.set(w / 2, h / 2 - r - u, 0); t.set(0, -1, 0); }],
            [arc, (u) => { const a = -u / r; out.set(w / 2 - r + Math.cos(a) * r, -h / 2 + r + Math.sin(a) * r, 0); t.set(Math.sin(a), -Math.cos(a), 0); }],
            [straightW, (u) => { out.set(w / 2 - r - u, -h / 2, 0); t.set(-1, 0, 0); }],
            [arc, (u) => { const a = -Math.PI / 2 - u / r; out.set(-w / 2 + r + Math.cos(a) * r, -h / 2 + r + Math.sin(a) * r, 0); t.set(Math.sin(a), -Math.cos(a), 0); }],
            [straightH, (u) => { out.set(-w / 2, -h / 2 + r + u, 0); t.set(0, 1, 0); }],
            [arc, (u) => { const a = Math.PI - u / r; out.set(-w / 2 + r + Math.cos(a) * r, h / 2 - r + Math.sin(a) * r, 0); t.set(Math.sin(a), -Math.cos(a), 0); }],
          ];
          for (const [len, fn] of segs) {
            if (s <= len) return fn(s), per;
            s -= len;
          }
          return per;
        };

        let visible = true;
        const io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
        });
        io.observe(host);

        let pointerX = 0;
        const onPointer = (e: PointerEvent) => {
          pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        const clock = new THREE.Clock();
        let raf = 0;

        const render = () => {
          const time = reduced ? 1.5 : clock.getElapsedTime();
          heatUniform.value += (heatRef.current - heatUniform.value) * 0.06;
          const spacing = 1.02 * linkScale; // link pitch along the path
          let n = 0;

          if (variant === "frame") {
            const w = (W - inset * 2) * worldPerPx;
            const h = (H - inset * 2) * worldPerPx;
            const r = Math.min(w, h) * 0.08;
            const per = rectPoint(0, w, h, r, pos, tan);
            n = Math.min(MAX, Math.floor(per / spacing));
            const pitch = per / n; // exact closure, no gap at the seam
            const travel = time * 0.35; // slow conveyor pull
            for (let i = 0; i < n; i++) {
              rectPoint(i * pitch + travel * pitch, w, h, r, pos, tan);
              pos.z = Math.sin(time * 1.3 + i * 0.35) * 0.03; // settle/jitter depth
              place(i, pos, tan, i % 2 === 0 ? 0 : Math.PI / 2, per, i * pitch, time);
            }
          } else {
            const x0 = (-W / 2 + inset) * worldPerPx;
            const x1 = (W / 2 - inset) * worldPerPx;
            const y0 = 0;
            const len = x1 - x0;
            const sag = len * 0.035 * (1 + Math.sin(time * 0.9) * 0.18);
            const sway = Math.sin(time * 0.6) * len * 0.004;
            // integrate arc length along a parabola approximation of the catenary
            const pts: { x: number; y: number }[] = [];
            const steps = 240;
            for (let k = 0; k <= steps; k++) {
              const u = k / steps;
              pts.push({ x: x0 + u * len + Math.sin(u * Math.PI) * sway, y: y0 - sag * 4 * u * (1 - u) + Math.sin(u * Math.PI * 3 + time * 1.4) * sag * 0.04 });
            }
            const cum = [0];
            for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
            const total = cum[cum.length - 1];
            n = Math.min(MAX, Math.floor(total / spacing));
            let k = 1;
            for (let i = 0; i < n; i++) {
              const s = (i + 0.5) * (total / n);
              while (k < cum.length - 1 && cum[k] < s) k++;
              const a = pts[k - 1];
              const b = pts[k];
              const f = (s - cum[k - 1]) / (cum[k] - cum[k - 1] || 1);
              pos.set(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 0);
              tan.set(b.x - a.x, b.y - a.y, 0).normalize();
              place(i, pos, tan, i % 2 === 0 ? 0.25 : Math.PI / 2 + 0.25, total, s, time);
            }
          }

          mesh.count = n;
          mesh.instanceMatrix.needsUpdate = true;
          mesh.instanceColor!.needsUpdate = true;
          scene.rotation.y += (pointerX * 0.06 - scene.rotation.y) * 0.04;
          scene.rotation.x = 0.04;
          renderer.render(scene, camera);
        };

        function place(i: number, p: Vector3, t: Vector3, twist: number, total: number, s: number, time: number) {
          q.setFromUnitVectors(xAxis, t);
          qTwist.setFromAxisAngle(xAxis, twist);
          q.multiply(qTwist);
          scl.setScalar(linkScale);
          tmpM.compose(p, q, scl);
          mesh.setMatrixAt(i, tmpM);
          // heat: a slow ember wave running along the chain + ambient smoulder
          const wave = (s / total - time * 0.07) % 1;
          const d = Math.min(Math.abs(wave), Math.abs(wave + 1), Math.abs(wave - 1));
          const pulse = Math.exp(-(d * d) / 0.004);
          const smoulder = 0.09 + 0.05 * Math.sin(time * 2.1 + i * 1.7);
          const spiritLink = i % 37 === 11 ? 0.5 + 0.5 * Math.sin(time * 1.3 + i) : 0;
          col.setRGB(1.0, 0.36, 0.06).multiplyScalar(smoulder + pulse * 1.6);
          col.r += 0.05 * spiritLink;
          col.g += 0.16 * spiritLink;
          col.b += 0.38 * spiritLink;
          mesh.setColorAt(i, col);
        }

        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (visible && !document.hidden) render();
        };
        if (reduced) {
          render();
          const staticRedraw = () => render();
          ro.disconnect();
          const ro2 = new ResizeObserver(() => {
            resize();
            staticRedraw();
          });
          ro2.observe(host);
          cleanup = () => ro2.disconnect();
        } else {
          raf = requestAnimationFrame(loop);
        }

        const prevCleanup = cleanup;
        cleanup = () => {
          prevCleanup();
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          window.removeEventListener("pointermove", onPointer);
          linkGeo.dispose();
          mat.dispose();
          envTex.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };
      },
    );

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant, inset]);

  return (
    <div ref={hostRef} className={`chain chain--${variant} ${className}`} aria-hidden="true" />
  );
}
