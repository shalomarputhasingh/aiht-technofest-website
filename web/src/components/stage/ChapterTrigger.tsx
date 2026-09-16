"use client";

import { useEffect, useRef } from "react";
import type { ClipId } from "@/lib/clips";
import { director, frameFromProgress, type Mood } from "@/lib/director";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type MoodSpec = { [K in keyof Mood]?: [number, number] };

/**
 * Binds the enclosing <section> to the film: while the section crosses the
 * viewport centre, its scroll progress scrubs `clips` in order and eases the
 * mood values from their [start, end] pair.
 */
export default function ChapterTrigger({
  clips,
  mood = {},
  start = "top center",
  end = "bottom center",
  hold,
}: {
  clips: ClipId[];
  mood?: MoodSpec;
  start?: string;
  end?: string;
  /** Freeze the film at this normalised time instead of scrubbing. */
  hold?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const clipsKey = clips.join(",");

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const list = clipsKey.split(",") as ClipId[];

    const apply = (p: number) => {
      const [clip, t]: [ClipId, number] = hold === undefined ? frameFromProgress(list, p) : [list[0], hold];
      director.setFrame(clip, t);
      const next: Partial<Mood> = {};
      for (const k of Object.keys(mood) as (keyof Mood)[]) {
        const [a, b] = mood[k]!;
        next[k] = a + (b - a) * p;
      }
      director.setMood(next);
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start,
      end,
      onUpdate: (self) => apply(self.progress),
      onToggle: (self) => {
        if (self.isActive) {
          director.setChapter(section.id);
          apply(self.progress);
        }
      },
    });
    if (st.isActive) {
      director.setChapter(section.id);
      apply(st.progress);
    }
    return () => st.kill();
    // mood is a static literal per section
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipsKey, start, end, hold]);

  return <span ref={ref} hidden />;
}

export { gsap };
