"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/env";
import RegisterLink, { ArrowIcon } from "./RegisterLink";

/** Scroll progress bar, back-to-top, mobile sticky CTA and cursor spotlight. */
export default function Chrome() {
  const barRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      const bar = barRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${pct / 100})`;
        bar.setAttribute("aria-valuenow", String(Math.round(pct)));
      }
      setShowTop(window.scrollY > 400);
      // hide the sticky CTA during the hero (it has its own) and at the final title card
      const final = document.getElementById("final-cta");
      const finalEnd = final ? final.offsetTop + final.offsetHeight - window.innerHeight * 1.6 : Infinity;
      setShowMobileCta(window.scrollY > window.innerHeight * 0.9 && window.scrollY < finalEnd);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot || window.matchMedia("(pointer: coarse)").matches || isReducedMotion()) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let raf = 0;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      spot.style.opacity = "1";
    };
    const leave = () => (spot.style.opacity = "0");
    const loop = () => {
      x += (mx - x) * 0.12;
      y += (my - y) * 0.12;
      spot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="scroll-progress"
        role="progressbar"
        aria-label="Page reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      />
      <div ref={spotRef} className="spotlight" aria-hidden="true" />

      <div className={`mobile-cta ${showMobileCta ? "is-visible" : ""}`} aria-label="Mobile registration CTA" inert={!showMobileCta}>
        <RegisterLink className="btn btn--fire btn--block">
          Register Now <ArrowIcon />
        </RegisterLink>
      </div>

      <button
        type="button"
        className={`back-to-top ${showTop ? "is-visible" : ""}`}
        aria-label="Back to top of page"
        title="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: isReducedMotion() ? "auto" : "smooth" });
          document.getElementById("hero")?.focus({ preventScroll: true });
        }}
      >
        <ArrowIcon dir="up" />
      </button>
    </>
  );
}
