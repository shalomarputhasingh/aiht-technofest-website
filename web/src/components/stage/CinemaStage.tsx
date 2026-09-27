"use client";

import { useEffect, useRef, useState } from "react";
import { CLIPS, CLIP_INDEX, posterSrc, type ClipId } from "@/lib/clips";
import { director, INTRO_SHARE } from "@/lib/director";
import { isReducedMotion, prefersLowData } from "@/lib/env";
import { preloadSeeds, Sequence } from "@/lib/frames";
import Embers from "./Embers";

/**
 * Fixed, full-viewport film layer.
 *
 * The film is a WebP frame sequence drawn to a canvas, not a <video>: scrolling
 * picks an already-decoded frame instead of asking a decoder to seek, which is
 * what made scrubbing stutter. Adjacent frames are cross-faded by the sub-frame
 * remainder so motion stays smooth between discrete frames.
 *
 * Only the active clip and its neighbours keep frames in memory; the rest are
 * released. Reduced-motion / Save-Data visitors get poster stills instead.
 */
export default function CinemaStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  // null until detected on the client, so no frames are fetched before we know
  // whether this is a phone (smaller frames) or a reduced-motion / Save-Data visitor.
  const [env, setEnv] = useState<{ mobile: boolean; stillsOnly: boolean } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnv({ mobile: mq.matches, stillsOnly: mqReduce.matches || prefersLowData() });
    update();
    mq.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!env) return;
    const canvas = canvasRef.current;
    const poster = posterRef.current;
    if (!canvas) return;
    const variant = env.mobile ? "mobile" : "desktop";
    const ctx = canvas.getContext("2d", { alpha: false });

    if (env.stillsOnly || !ctx) {
      // Stills mode: the chained keyframe posters still tell the whole story.
      let raf = 0;
      let last = "";
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const { clip, t, mood } = director.get();
        if (shadeRef.current) shadeRef.current.style.opacity = String(mood.blackout);
        if (scrimRef.current) scrimRef.current.style.opacity = String(mood.scrim);
        const url = posterSrc(clip, t < 0.5 ? "start" : "end");
        if (poster && last !== url) {
          poster.src = url;
          last = url;
        }
      };
      raf = requestAnimationFrame(tick);
      canvas.style.opacity = "0";
      return () => cancelAnimationFrame(raf);
    }

    const seqs = new Map<number, Sequence>();
    // One frame from every chapter, fetched at idle, so jumping to any section
    // (nav link, deep link, fast fling) always has a correct frame to show.
    preloadSeeds(CLIPS.map((c) => c.id), variant);

    // The canvas is sized to the frame itself and blitted 1:1; CSS object-fit
    // does the scale-to-viewport on the compositor, so per-frame cost is a small
    // fixed copy instead of a full-screen rescale.
    const fitCanvas = (img: HTMLImageElement) => {
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
    };

    let raf = 0;
    let active = -1;
    let shown = 0; // eased frame position (fractional) within the active clip
    let lastDir = 1;
    let posterHidden = false;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { clip, mood, intro } = director.get();
      const raw = director.get().t;
      // The opening plays the first INTRO_SHARE of the awakening by itself.
      const t = clip === "c01_awakening" ? INTRO_SHARE * intro + (1 - INTRO_SHARE) * raw : raw;
      const idx = CLIP_INDEX[clip as ClipId];

      if (shadeRef.current) shadeRef.current.style.opacity = String(mood.blackout);
      if (scrimRef.current) scrimRef.current.style.opacity = String(mood.scrim);

      if (idx !== active) {
        active = idx;
        for (const [i, seq] of seqs) {
          if (Math.abs(i - idx) > 1) {
            seq.dispose();
            seqs.delete(i);
          }
        }
        if (!seqs.has(idx)) seqs.set(idx, new Sequence(CLIPS[idx].id, variant));
        shown = t * (seqs.get(idx)!.count - 1);
      }

      const seq = seqs.get(idx)!;
      const target = t * (seq.count - 1);
      const delta = target - shown;
      if (Math.abs(delta) > 0.001) lastDir = Math.sign(delta);
      // Ease toward the target so wheel/trackpad jitter reads as camera inertia.
      shown += delta * 0.22;
      if (Math.abs(target - shown) < 0.01) shown = target;

      const base = Math.floor(shown);
      const frac = shown - base;
      seq.pump(Math.round(shown), lastDir);

      const a = seq.at(base) ?? seq.nearest(base);
      if (a) {
        fitCanvas(a);
        // Portrait screens crop a 16:9 frame hard, so keep the rider in view.
        canvas.style.objectPosition = env.mobile ? CLIPS[idx].mobileFocus : "50% 50%";
        ctx.drawImage(a, 0, 0);
        // Blend the next frame in by the sub-frame remainder: smooths the step
        // between discrete frames. Skipped while scrubbing fast (invisible then)
        // and while the film is effectively paused.
        const blending = frac > 0.03 && Math.abs(delta) < 1.5;
        const b = blending ? seq.at(Math.min(seq.count - 1, base + 1)) : null;
        if (b && b.naturalWidth === canvas.width) {
          ctx.globalAlpha = frac;
          ctx.drawImage(b, 0, 0);
          ctx.globalAlpha = 1;
        }
        // Expose playhead state for QA tooling.
        canvas.dataset.clip = CLIPS[idx].id;
        canvas.dataset.frame = String(base);
        if (!posterHidden && poster) {
          poster.style.opacity = "0";
          canvas.style.opacity = "1";
          posterHidden = true;
        }
      }

      // Warm the neighbouring chapter well before this one finishes.
      if (seq.loadedCount() > seq.count * 0.3) {
        const next = seqs.get(idx + 1);
        const prev = seqs.get(idx - 1);
        if (idx + 1 < CLIPS.length && !next) seqs.set(idx + 1, new Sequence(CLIPS[idx + 1].id, variant));
        else if (next && !next.complete) next.pumpSequential(0);
        else if (idx - 1 >= 0 && !prev) seqs.set(idx - 1, new Sequence(CLIPS[idx - 1].id, variant));
        else if (prev && !prev.complete) prev.pumpSequential(prev.count - 1);
      }
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const seq of seqs.values()) seq.dispose();
      seqs.clear();
    };
  }, [env]);

  return (
    <div className="stage" aria-hidden="true">
      {/* Poster is server-rendered, so the film has something to show before the
          first frames decode — and it is the whole film without JS. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- swapped imperatively */}
      <img ref={posterRef} className="stage__poster" src={posterSrc("c01_awakening", "start")} alt="" fetchPriority="high" />
      <canvas ref={canvasRef} className="stage__canvas" />
      <div ref={scrimRef} className="stage__scrim" />
      <div className="stage__grade" />
      <Embers reduced={!env || (env.stillsOnly && isReducedMotion())} />
      <div className="stage__vignette" />
      <div className="stage__grain" />
      <div ref={shadeRef} className="stage__shade" />
    </div>
  );
}
