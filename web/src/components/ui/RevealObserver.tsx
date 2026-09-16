"use client";

import { useEffect } from "react";
import { director } from "@/lib/director";
import { isReducedMotion } from "@/lib/env";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * One observer for every [data-reveal] element. Hidden state only applies under
 * `html.js`, so content is always visible if scripts fail. Also runs the opening
 * fade from black.
 *
 * Revealed state is a `data-revealed` attribute, not a class: React owns `className`
 * on components like the FAQ items and would wipe an imperatively added class on
 * re-render, hiding the element again.
 */
export default function RevealObserver() {
  useEffect(() => {
    const reduced = isReducedMotion();
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    let io: IntersectionObserver | null = null;
    if (reduced) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.setAttribute("data-revealed", "");
              io?.unobserve(e.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      els.forEach((el) => io!.observe(el));
    }

    // Opening shot: darkness → embers → fire climbs from the boots to the skull.
    const state = director.get();
    const tween = gsap.to(state.mood, {
      blackout: 0,
      duration: reduced ? 0 : 2.4,
      delay: reduced ? 0 : 0.4,
      ease: "power2.inOut",
    });
    const introTween = gsap.to(state, {
      intro: 1,
      duration: reduced ? 0 : 4.5,
      delay: reduced ? 0 : 1,
      ease: "power1.inOut",
    });
    document.documentElement.classList.add("is-ready");
    // Web fonts change section heights; re-measure every trigger once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      io?.disconnect();
      tween.kill();
      introTween.kill();
    };
  }, []);

  return null;
}
