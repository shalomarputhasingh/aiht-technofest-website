"use client";

import type { ReactNode } from "react";
import { CONFIG, REGISTER_PENDING } from "@/content/site";
import { emit } from "@/lib/bus";

const url = CONFIG.GOOGLE_FORM_URL;
const configured = !!url && url !== "PASTE_GOOGLE_FORM_URL_HERE";

/**
 * Every "Register" action on the site. Opens the configured Google Form in a
 * new tab (a real link: works without JS, middle-click, screen readers).
 * If the form URL is not configured it shows the original "coming soon" notice.
 */
export default function RegisterLink({
  children,
  className = "btn btn--fire",
  label = "Register for Technofest 2026",
  onNavigate,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={configured ? url : "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`${label} (opens Google Form in a new tab)`}
      onClick={(e) => {
        if (!configured) {
          e.preventDefault();
          emit("tf:toast", REGISTER_PENDING);
        }
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}

export function ArrowIcon({ size = 16, dir = "right" }: { size?: number; dir?: "right" | "down" | "up" }) {
  const d = dir === "right" ? "M5 12h14M13 5l7 7-7 7" : dir === "down" ? "M6 9l6 6 6-6" : "M18 15l-6-6-6 6";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
