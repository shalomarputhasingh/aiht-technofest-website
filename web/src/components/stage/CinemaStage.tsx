"use client";

import { useEffect, useRef, useState } from "react";
import { CLIPS, CLIP_INDEX, clipSrc, posterSrc, type ClipId } from "@/lib/clips";
import { director, INTRO_SHARE } from "@/lib/director";
import { isReducedMotion, prefersLowData } from "@/lib/env";
import Embers from "./Embers";

/**
 * Fixed, full-viewport film layer. Scroll choreography writes (clip, t) into the
 * director store; this component scrubs the matching <video> toward it.
 *
 * - Only the active clip and its neighbours hold a src (max 3 decoders).
 * - Seeks are rate-limited to one in-flight seek; the displayed time eases
 *   toward the target so trackpad jitter reads as camera inertia.
 * - Reduced motion, Save-Data or a video error fall back to the poster stills,
 *   which are the chained keyframes, so the story still reads.
 */
export default function CinemaStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const posterRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  // null until detected on the client, so no rendition is fetched before we know
  // whether this is a phone (mobile/480p) or a reduced-motion / Save-Data visitor (stills).
  const [env, setEnv] = useState<{ mobile: boolean; stillsOnly: boolean } | null>(null);
  const mobile = env?.mobile ?? false;
  const stillsOnly = env?.stillsOnly ?? false;

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
    const videos = videoRefs.current;
    const failed = new Set<number>();
    let raf = 0;
    let active = -1;
    let shown = 0; // eased time in seconds for the active clip
    let lastPoster = "";

    /**
     * Park an inactive neighbour on the frame it will be entered from (previous
     * clip → last frame, next clip → first frame). Seeking forces the decoder to
     * present that frame, so the hand-off at a clip boundary is instant instead
     * of flashing black while the new element produces its first frame.
     */
    const park = (i: number) => {
      const v = videos[i];
      if (!v || i === active || !v.duration) return;
      v.currentTime = i < active ? Math.max(0, v.duration - 0.05) : 0.001;
    };

    const attach = (i: number, on: boolean) => {
      const v = videos[i];
      if (!v) return;
      const src = clipSrc(CLIPS[i].id, mobile);
      if (on && !failed.has(i)) {
        if (!v.getAttribute("src")) {
          v.src = src;
          v.preload = "auto";
          v.addEventListener("loadedmetadata", () => park(i), { once: true });
          v.load();
        } else {
          park(i);
        }
      } else if (v.getAttribute("src")) {
        v.removeAttribute("src");
        v.load(); // releases the decoder + buffered data
      }
    };

    const onError = (i: number) => () => failed.add(i);
    const errorHandlers = videos.map((v, i) => {
      const h = onError(i);
      v?.addEventListener("error", h);
      return h;
    });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { clip, mood, intro } = director.get();
      // The opening plays the first INTRO_SHARE of the awakening by itself; scroll owns the rest.
      const t = clip === "c01_awakening" ? INTRO_SHARE * intro + (1 - INTRO_SHARE) * director.get().t : director.get().t;
      const idx = CLIP_INDEX[clip as ClipId];

      if (shadeRef.current) shadeRef.current.style.opacity = String(mood.blackout);
      if (scrimRef.current) scrimRef.current.style.opacity = String(mood.scrim);

      const poster = posterRef.current;
      const edge = t < 0.5 ? "start" : "end";
      const posterUrl = posterSrc(clip, edge);

      if (idx !== active) {
        active = idx;
        for (let i = 0; i < CLIPS.length; i++) attach(i, !stillsOnly && Math.abs(i - idx) <= 1);
        videos.forEach((v, i) => v?.classList.toggle("is-active", i === idx));
        const v = videos[idx];
        if (v && v.duration) {
          shown = t * (v.duration - 0.05);
          v.currentTime = shown; // always present a frame on activation
        } else {
          shown = 0;
        }
      }

      const v = videos[idx];
      const playable = !stillsOnly && v && !failed.has(idx) && v.readyState >= 2 && v.duration > 0;

      if (playable) {
        const target = t * (v.duration - 0.05);
        shown += (target - shown) * 0.2;
        if (Math.abs(target - shown) < 0.004) shown = target;
        if (!v.seeking && Math.abs(v.currentTime - shown) > 1 / 60) v.currentTime = shown;
        if (poster && poster.style.opacity !== "0") poster.style.opacity = "0";
      } else if (poster) {
        if (lastPoster !== posterUrl) {
          poster.src = posterUrl;
          lastPoster = posterUrl;
        }
        poster.style.opacity = "1";
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
      videos.forEach((v, i) => {
        v?.removeEventListener("error", errorHandlers[i]);
        if (v?.getAttribute("src")) {
          v.removeAttribute("src");
          v.load();
        }
      });
    };
  }, [env, mobile, stillsOnly]);

  return (
    <div ref={rootRef} className="stage" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- dynamic poster swapped every frame */}
      <img ref={posterRef} className="stage__poster" src={posterSrc("c01_awakening", "start")} alt="" decoding="async" />
      {CLIPS.map((c, i) => (
        <video
          key={c.id}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          className="stage__video"
          style={{ ["--focus" as string]: c.mobileFocus }}
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="none"
          tabIndex={-1}
        />
      ))}
      <div ref={scrimRef} className="stage__scrim" />
      <div className="stage__grade" />
      <Embers reduced={!env || (stillsOnly && isReducedMotion())} />
      <div className="stage__vignette" />
      <div className="stage__grain" />
      <div ref={shadeRef} className="stage__shade" />
    </div>
  );
}
