// Tiny external store shared by the scroll choreography (writers) and the
// cinema stage / WebGL layers (readers). Readers poll it inside their own rAF
// loops, so scroll updates never trigger React re-renders.
import type { ClipId } from "./clips";

export type Mood = {
  /** 0 = clear, 1 = full black over the film */
  blackout: number;
  /** extra darkening behind dense UI (0..1) */
  scrim: number;
  /** ember particle intensity (0..1.5) */
  embers: number;
  /** 0 = cool/quiet, 1 = hot/intense — tints grading + light */
  heat: number;
};

type State = {
  /** 0..1 progress of the auto-played opening (embers → ignition) before scroll takes over */
  intro: number;
  clip: ClipId;
  /** normalised time inside the clip, 0..1 */
  t: number;
  mood: Mood;
  chapter: string;
};

/** Share of the awakening clip that plays by itself on load. */
export const INTRO_SHARE = 0.45;

const state: State = {
  intro: 0,
  clip: "c01_awakening",
  t: 0,
  mood: { blackout: 1, scrim: 0, embers: 1, heat: 0.4 },
  chapter: "hero",
};

const chapterListeners = new Set<(chapter: string) => void>();

export const director = {
  get: () => state,
  setFrame(clip: ClipId, t: number) {
    state.clip = clip;
    state.t = Math.min(1, Math.max(0, t));
  },
  setMood(m: Partial<Mood>) {
    Object.assign(state.mood, m);
  },
  setChapter(chapter: string) {
    if (state.chapter === chapter) return;
    state.chapter = chapter;
    chapterListeners.forEach((l) => l(chapter));
  },
  onChapter(fn: (chapter: string) => void) {
    chapterListeners.add(fn);
    return () => chapterListeners.delete(fn);
  },
};

/** Map a progress value across an ordered list of clips. */
export function frameFromProgress(clips: ClipId[], p: number): [ClipId, number] {
  const n = clips.length;
  const x = Math.min(0.99999, Math.max(0, p)) * n;
  const i = Math.floor(x);
  return [clips[i], x - i];
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Remap v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
