import manifest from "@/content/frames.json";
import type { ClipId } from "./clips";

type Variant = "desktop" | "mobile";
type Entry = Record<Variant, { count: number; fps: number }>;

const FRAMES = manifest as Record<string, Entry>;

export const frameCount = (id: ClipId, variant: Variant) => FRAMES[id][variant].count;

export const frameSrc = (id: ClipId, variant: Variant, i: number) =>
  `/media/frames/${variant}/${id}/f${String(i + 1).padStart(3, "0")}.webp`;

/**
 * One clip's frames. Images are plain <img> elements so the browser owns the
 * decoded-bitmap cache (ImageBitmaps would pin hundreds of MB per clip).
 */
export class Sequence {
  readonly count: number;
  private imgs: (HTMLImageElement | null)[];
  private state: Uint8Array; // 0 = idle, 1 = loading, 2 = ready, 3 = failed
  private inflight = 0;

  constructor(
    readonly id: ClipId,
    readonly variant: Variant,
    private readonly maxParallel = parallelism(),
  ) {
    this.count = frameCount(id, variant);
    this.imgs = new Array(this.count).fill(null);
    this.state = new Uint8Array(this.count);
  }

  get ready() {
    return this.state.some((s) => s === 2);
  }

  loadedCount() {
    let n = 0;
    for (const s of this.state) if (s === 2) n++;
    return n;
  }

  /** Begin loading frame `i` (no-op if already loading/ready or the pipe is full). */
  request(i: number, force = false) {
    if (i < 0 || i >= this.count || this.state[i] !== 0) return;
    if (!force && this.inflight >= this.maxParallel) return;
    this.state[i] = 1;
    this.inflight++;
    const img = new Image();
    img.decoding = "async";
    // The frame under the playhead jumps the queue; prefetch stays out of the way.
    img.fetchPriority = force ? "high" : "low";
    img.src = frameSrc(this.id, this.variant, i);
    this.imgs[i] = img;
    const done = (ok: boolean) => {
      this.state[i] = ok ? 2 : 3;
      this.inflight--;
    };
    img
      .decode()
      .then(() => done(true))
      .catch(() => {
        // Safari can reject decode() for images that still paint fine.
        done(img.complete && img.naturalWidth > 0);
      });
  }

  /** The nearest decoded frame to `i`, so scrubbing never shows a gap. */
  nearest(i: number): HTMLImageElement | null {
    if (this.state[i] === 2) return this.imgs[i];
    for (let d = 1; d < this.count; d++) {
      if (this.state[i - d] === 2) return this.imgs[i - d];
      if (this.state[i + d] === 2) return this.imgs[i + d];
    }
    return null;
  }

  at(i: number): HTMLImageElement | null {
    return this.state[i] === 2 ? this.imgs[i] : null;
  }

  /** Keep the playhead fed: the exact frame first, then a window around it. */
  pump(center: number, dir: number) {
    this.request(center, true);
    const ahead = dir >= 0 ? 10 : 3;
    const behind = dir >= 0 ? 3 : 10;
    for (let d = 1; d <= Math.max(ahead, behind); d++) {
      if (d <= ahead) this.request(center + d);
      if (d <= behind) this.request(center - d);
    }
  }

  /** Load the rest in order — used to warm neighbouring chapters while idle. */
  pumpSequential(from: number) {
    for (let d = 0; d < this.count && this.inflight < this.maxParallel; d++) {
      this.request((from + d) % this.count);
    }
  }

  get complete() {
    return this.state.every((s) => s !== 0 && s !== 1);
  }

  dispose() {
    for (const img of this.imgs) if (img) img.src = "";
    this.imgs = new Array(this.count).fill(null);
    this.state = new Uint8Array(this.count);
    this.inflight = 0;
  }
}

/** More sockets on a fast link, fewer on a slow one. */
function parallelism() {
  if (typeof navigator === "undefined") return 6;
  const c = (navigator as Navigator & { connection?: { downlink?: number; effectiveType?: string } }).connection;
  if (!c) return 6;
  if (c.effectiveType === "2g" || c.effectiveType === "slow-2g") return 2;
  if (c.effectiveType === "3g") return 4;
  return (c.downlink ?? 0) >= 5 ? 10 : 6;
}

/**
 * One frame from every chapter, fetched while the browser is idle. A jump to any
 * section then has a correct frame to show immediately instead of holding the
 * previous chapter's image while its sequence downloads.
 */
export function preloadSeeds(ids: readonly ClipId[], variant: Variant) {
  const idle: (cb: () => void) => void =
    typeof requestIdleCallback === "function" ? (cb) => requestIdleCallback(() => cb(), { timeout: 4000 }) : (cb) => setTimeout(cb, 600);
  let i = 0;
  const next = () => {
    if (i >= ids.length) return;
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = "low";
    img.src = frameSrc(ids[i++], variant, 0);
    img.decode().catch(() => {}).finally(() => idle(next));
  };
  idle(next);
}
