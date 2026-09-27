"use client";

import { useEffect, useRef, useState } from "react";
import { BOOT, CONFIG, TOTALS } from "@/content/site";
import { isReducedMotion } from "@/lib/env";

const MIN_MS = 1500; // let the sequence read
const MAX_MS = 5000; // never hold the page hostage

/**
 * CSE boot screen: an ssh + make sequence for the department, a progress bar
 * tied to real loading, then the wordmark.
 *
 * - Server-rendered but hidden unless `html.js`, so no-JS visitors never see it.
 * - A pure-CSS auto-hide animation clears it even if the bundle fails to load.
 * - Shown once per tab (sessionStorage); reduced motion gets a short static hold.
 * - Skippable by button, Escape, click or scroll.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    // Already booted in this tab, or the visitor asked for less motion.
    let seen = false;
    try {
      seen = sessionStorage.getItem("tf:booted") === "1";
    } catch {
      /* private mode */
    }
    const reduced = isReducedMotion();
    if (seen) {
      // Dismiss without a state round-trip so this never re-renders the page.
      rootRef.current?.classList.add("is-done");
      rootRef.current?.setAttribute("inert", "");
      return;
    }

    document.body.classList.add("is-booting");
    const start = performance.now();
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("tf:booted", "1");
      } catch {
        /* ignore */
      }
      document.body.classList.remove("is-booting");
      setDone(true);
    };

    // Progress: real signals (fonts, first frames) blended with elapsed time so
    // the bar always advances even when everything is cached.
    let ready = false;
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true }))),
    ]).then(() => {
      ready = true;
    });

    const tick = () => {
      const elapsed = performance.now() - start;
      const timed = Math.min(1, elapsed / MIN_MS);
      const pct = Math.min(1, ready ? Math.max(timed, 0.75 + timed * 0.25) : timed * 0.85);
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`;
      setStep(Math.min(BOOT.lines.length, Math.floor(pct * (BOOT.lines.length + 1))));
      if ((ready && elapsed > MIN_MS) || elapsed > MAX_MS || reduced) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", finish, { once: true, passive: true });
    window.addEventListener("touchmove", finish, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-booting");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`preloader ${done ? "is-done" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      inert={done}
      onClick={() => setDone(true)}
    >
      <div className="preloader__grid" aria-hidden="true" />
      <div className="preloader__inner">
        <p className="preloader__dept">
          {CONFIG.COLLEGE_SHORT} <span aria-hidden="true">{"//"}</span> {CONFIG.DEPARTMENT_FULL}
        </p>

        <div className="preloader__term" aria-hidden="true">
          {BOOT.lines.map((l, i) => (
            <div key={l.cmd} className={`preloader__line ${step >= i ? "is-shown" : ""}`}>
              <code className="preloader__cmd">
                <span className="preloader__prompt">
                  {BOOT.user}@{BOOT.host}:~$
                </span>{" "}
                {l.cmd}
              </code>
              <code className="preloader__out">{l.out}</code>
            </div>
          ))}
        </div>

        <p className="preloader__mark" aria-hidden="true">
          <span>CSE</span>
          <b>3.0</b>
        </p>

        <div className="preloader__barwrap" aria-hidden="true">
          <span ref={barRef} className="preloader__bar" />
        </div>
        <p className="preloader__status" aria-hidden="true">
          <span className="preloader__compiling">
            {BOOT.compiling} — {TOTALS.events} events · {TOTALS.games} games
          </span>
          <span className="preloader__ready">{BOOT.ready}</span>
        </p>

        <span className="sr-only">Loading {CONFIG.FEST_NAME}</span>
      </div>

      <button type="button" className="preloader__skip" onClick={() => setDone(true)}>
        {BOOT.skip} <span aria-hidden="true">esc</span>
      </button>
    </div>
  );
}
