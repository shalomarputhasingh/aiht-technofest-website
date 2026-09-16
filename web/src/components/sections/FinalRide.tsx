"use client";

import { useEffect, useRef } from "react";
import { FINAL_CTA, HERO } from "@/content/site";
import { clamp01, director, frameFromProgress, range } from "@/lib/director";
import { useReducedMotion } from "@/lib/env";
import { ScrollTrigger } from "@/lib/gsap";
import RegisterLink, { ArrowIcon } from "@/components/ui/RegisterLink";
import { CalendarIcon } from "./Hero";

// Beat sheet across the pinned section's scroll progress (0..1).
const FILM_END = 0.8; // c09 → c10 → c11 → c12 play across [0, FILM_END]
const BLACK = [0.8, 0.86];
const TITLE = [0.87, 0.95];
const BEATS: [number, number][] = [
  [0.02, 0.22], // "Ready to Take the Challenge?"  — the return / remount
  [0.25, 0.42], // "Your idea. Your skill. Your moment." — dark highway
  [0.45, 0.6], //  body copy — the stop
];

const fade = (p: number, [a, b]: [number, number]) => {
  const inn = range(p, a, a + 0.035);
  const out = 1 - range(p, b - 0.035, b);
  return Math.min(inn, out);
};

export default function FinalRide() {
  const rootRef = useRef<HTMLElement>(null);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const cinematic = !useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!cinematic) {
      // Static telling: park the film on the skull close-up behind the title card.
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top center",
        end: "bottom bottom",
        onToggle: (s) => {
          if (!s.isActive) return;
          director.setChapter("final-cta");
          director.setFrame("c12_skull", 1);
          director.setMood({ scrim: 0.55, embers: 0.6, heat: 1, blackout: 0 });
        },
      });
      return () => st.kill();
    }

    const clips = ["c09_return", "c10_highway", "c11_highway_stop", "c12_skull"] as const;
    const title = titleRef.current;

    const apply = (p: number) => {
      const [clip, t] = frameFromProgress([...clips], p / FILM_END);
      director.setFrame(clip, t);
      const push = range(p, 0.6, FILM_END); // the skull push-in heats everything up
      director.setMood({
        scrim: 0.15 * (1 - push),
        embers: 1 + push * 0.5,
        heat: 0.7 + push * 0.3,
        blackout: range(p, BLACK[0], BLACK[1]) * (1 - range(p, TITLE[0], TITLE[1]) * 0.35),
      });
      BEATS.forEach((b, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const o = fade(p, b);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 18}px, 0)`;
        el.style.visibility = o > 0.001 ? "visible" : "hidden";
      });
      if (title) {
        const o = range(p, TITLE[0], TITLE[1]);
        title.style.opacity = String(o);
        title.style.transform = `scale(${1.06 - o * 0.06})`;
        title.style.visibility = o > 0.001 ? "visible" : "hidden";
        title.style.letterSpacing = "";
        title.style.setProperty("--reveal", String(clamp01(o)));
      }
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => apply(s.progress),
      onToggle: (s) => {
        if (s.isActive) {
          director.setChapter("final-cta");
          apply(s.progress);
        }
      },
    });
    if (st.isActive) {
      director.setChapter("final-cta");
      apply(st.progress);
    }

    // Keyboard users tabbing to the CTA jump straight to the title card.
    const onFocusIn = (e: FocusEvent) => {
      if (title && title.contains(e.target as Node) && st.progress < TITLE[1]) {
        window.scrollTo({ top: st.end - 2, behavior: "auto" });
      }
    };
    root.addEventListener("focusin", onFocusIn);

    return () => {
      st.kill();
      root.removeEventListener("focusin", onFocusIn);
    };
  }, [cinematic]);

  return (
    <section ref={rootRef} id="final-cta" className={`final ${cinematic ? "final--cinematic" : "final--static"}`} aria-labelledby="cta-heading">
      <div className="final__sticky">
        <div className="final__beats container">
          <h2
            className="final__heading"
            id="cta-heading"
            ref={(el) => {
              beatRefs.current[0] = el;
            }}
          >
            {FINAL_CTA.heading[0]}
            <br />
            {FINAL_CTA.heading[1]}
          </h2>
          <p
            className="final__sub"
            ref={(el) => {
              beatRefs.current[1] = el;
            }}
          >
            {FINAL_CTA.sub}
          </p>
          <p
            className="final__body"
            ref={(el) => {
              beatRefs.current[2] = el;
            }}
          >
            {FINAL_CTA.body}
          </p>
        </div>

        <div className="final__title" ref={titleRef}>
          <p className="final__title-name">
            <span className="final__title-techno">{HERO.titleA}</span>
            <span className="final__title-fest">{HERO.titleB}</span>{" "}
            <span className="final__title-year">{HERO.year}</span>
          </p>
          <span className="final__title-rule" aria-hidden="true" />
          <p className="final__title-tagline">{HERO.tagline}</p>
          <RegisterLink className="btn btn--fire btn--xl">
            {FINAL_CTA.cta} <ArrowIcon size={18} />
          </RegisterLink>
          <p className="final__date" aria-label="Event date">
            <CalendarIcon /> {FINAL_CTA.dateBadge}
          </p>
        </div>
      </div>
    </section>
  );
}
