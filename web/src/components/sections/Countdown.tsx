"use client";

import { useEffect, useState } from "react";
import { CONFIG, COUNTDOWN } from "@/content/site";
import ChainCanvas from "@/components/chain/ChainCanvas";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

const target = new Date(CONFIG.EVENT_DATE).getTime();

function compute(now: number): Parts | "live" {
  const diff = target - now;
  if (diff <= 0) return "live";
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Real-time countdown to CONFIG.EVENT_DATE (local time), framed by the burning chain.
 * Digits tick every second visually; the screen-reader live region only
 * announces once per minute so it never floods assistive tech.
 */
export default function Countdown() {
  const [parts, setParts] = useState<Parts | "live" | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const p = compute(Date.now());
      setParts(p);
      if (p === "live") return; // original stops updating once live
      timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  const values = parts && parts !== "live" ? [parts.days, parts.hours, parts.minutes, parts.seconds] : null;
  const spoken =
    parts === "live"
      ? COUNTDOWN.live
      : parts
        ? `${parts.days} days, ${parts.hours} hours and ${parts.minutes} minutes until Technofest 2026`
        : "";

  return (
    <div className="countdown" data-reveal>
      <ChainCanvas variant="frame" inset={14} heat={0.75} className="countdown__chain" />
      <div className="countdown__inner">
        <p className="countdown__label" id="countdown-heading">
          {COUNTDOWN.label}
        </p>
        {parts === "live" ? (
          <p className="countdown__live">{COUNTDOWN.live}</p>
        ) : (
          <div className="countdown__grid" aria-hidden="true">
            {COUNTDOWN.units.map((u, i) => (
              <div className="countdown__unit" key={u}>
                <span className="countdown__value" data-unit={u}>
                  {values ? pad(values[i]) : "--"}
                </span>
                <span className="countdown__unit-label">{u}</span>
              </div>
            ))}
          </div>
        )}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {spoken}
        </p>
      </div>
    </div>
  );
}
