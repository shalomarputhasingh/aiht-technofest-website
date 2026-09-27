"use client";

import { useEffect, useRef } from "react";
import { director } from "@/lib/director";
import { hasWebGL } from "@/lib/env";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uHeight;
  uniform float uPixelRatio;
  uniform float uIntensity;
  attribute vec3 aSeed;   // x: phase, y: speed, z: size
  varying float vAlpha;
  varying float vBlue;
  void main() {
    vec3 p = position;
    float life = fract(aSeed.x + uTime * aSeed.y * 0.06);
    p.y = mix(-uHeight * 0.6, uHeight * 0.7, life);
    // turbulent sideways drift like heat-lifted cinders
    p.x += sin(uTime * 0.7 * aSeed.y + aSeed.x * 40.0) * 0.35 + sin(life * 9.0 + aSeed.x * 12.0) * 0.18;
    p.z += cos(uTime * 0.5 + aSeed.x * 20.0) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float flicker = 0.65 + 0.35 * sin(uTime * 9.0 * aSeed.y + aSeed.x * 60.0);
    vAlpha = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.55, 1.0, life)) * flicker * uIntensity;
    vBlue = step(0.965, fract(aSeed.x * 97.0)); // ~3.5% of sparks carry the blue accent
    gl_PointSize = aSeed.z * uPixelRatio * (6.0 / -mv.z) * (0.6 + 0.4 * flicker);
  }
`;

const FRAG = /* glsl */ `
  uniform float uHeat;
  varying float vAlpha;
  varying float vBlue;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    vec3 ember = mix(vec3(1.0, 0.38, 0.06), vec3(1.0, 0.72, 0.32), core * (0.4 + 0.6 * uHeat));
    vec3 spirit = vec3(0.45, 0.72, 1.0);
    vec3 col = mix(ember, spirit, vBlue * 0.85);
    gl_FragColor = vec4(col, core * core * vAlpha);
  }
`;

/** Additive ember particle field layered over the film. */
export default function Embers({ reduced }: { reduced: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced || !hasWebGL()) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const small = window.innerWidth < 768;
      const count = small ? 110 : 260;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      } catch {
        return; // WebGL context refused — the film + CSS still carry the scene
      }
      const dpr = Math.min(window.devicePixelRatio, small ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
      camera.position.z = 6;

      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const seed = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 14;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
        seed[i * 3] = Math.random();
        seed[i * 3 + 1] = 0.4 + Math.random() * 1.2;
        seed[i * 3 + 2] = 2 + Math.random() * 5;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));

      const uniforms = {
        uTime: { value: 0 },
        uHeight: { value: 8 },
        uPixelRatio: { value: dpr },
        uIntensity: { value: 1 },
        uHeat: { value: 0.5 },
      };
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      scene.add(points);

      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const timer = new THREE.Timer();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        timer.update();
        const { mood } = director.get();
        uniforms.uTime.value = timer.getElapsed();
        uniforms.uIntensity.value += (mood.embers - uniforms.uIntensity.value) * 0.05;
        uniforms.uHeat.value += (mood.heat - uniforms.uHeat.value) * 0.05;
        if (uniforms.uIntensity.value > 0.01) renderer.render(scene, camera);
      };
      const onVisibility = () => {
        cancelAnimationFrame(raf);
        if (!document.hidden) raf = requestAnimationFrame(loop);
      };
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduced]);

  return <div ref={hostRef} className="stage__embers" />;
}
