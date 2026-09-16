"use client";

import { useSyncExternalStore } from "react";

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const reduced = typeof window !== "undefined" ? mediaStore("(prefers-reduced-motion: reduce)") : null;
const mobile = typeof window !== "undefined" ? mediaStore("(max-width: 767px)") : null;

export function useReducedMotion() {
  return useSyncExternalStore(reduced?.subscribe ?? (() => () => {}), reduced?.get ?? (() => false), () => false);
}

export function useIsMobile() {
  return useSyncExternalStore(mobile?.subscribe ?? (() => () => {}), mobile?.get ?? (() => false), () => false);
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** True when the visitor asked for less data or is on a very slow link. */
export function prefersLowData() {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !!c && (c.saveData === true || c.effectiveType === "2g" || c.effectiveType === "slow-2g");
}

export function isReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let webglSupport: boolean | null = null;
export function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}
