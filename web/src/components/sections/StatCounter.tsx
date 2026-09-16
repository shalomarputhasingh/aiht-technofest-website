"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/env";

/** Renders the real value in SSR HTML; animates up from 0 once when scrolled into view. */
export default function StatCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion() || value < 2) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / 1400);
          const eased = 1 - Math.pow(1 - k, 4);
          el.textContent = String(Math.round(eased * value));
          if (k < 1) raf = requestAnimationFrame(step);
        };
        el.textContent = "0";
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
