// Minimal cross-island event bus (sections are server components with small client islands).
import type { FilterKey } from "@/content/site";

type Events = {
  "tf:filter": FilterKey;
  "tf:toast": { title: string; body: string };
};

export function emit<K extends keyof Events>(name: K, detail: Events[K]) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on<K extends keyof Events>(name: K, fn: (detail: Events[K]) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Events[K]>).detail);
  window.addEventListener(name, h);
  return () => window.removeEventListener(name, h);
}
