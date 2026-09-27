# Stack and Level — cinematic event site

A scroll-driven cinematic site for **Stack and Level** (hero wordmark: *Stackernaut*), the Department of CSE technical event at Technofest 2026, AIHT. A flaming-skull rider's story plays as you scroll, and the full rulebook sits on top of it as accessible HTML.

```bash
npm install
npm run build && npm start      # http://localhost:3000
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so Open Graph/Twitter images resolve to absolute URLs.

## Editing content

`../Source_Content/` is the source of truth.

1. `config.js` — dates, venue, contacts, team size, registration mode, prize pool, form URL.
2. `stack-and-level.js` — the three levels (rules + scoring), general rules, regulations, code of conduct, winning, prizes, progression and FAQ. Rule sentences are transcribed verbatim from `Stack_and_Level_TECHNOFEST_2026_Rules and Instruction.docx`.
3. `npm run content:extract` regenerates `src/content/source.json`.
4. `npm start`, then `npm run content:audit` — **re-reads the .docx** and fails if any rule sentence is missing from the rendered page, plus checks levels, scoring, prizes, FAQ, config values and link destinations.

Page copy (headings, intros, hero) lives in `src/content/site.ts`. Counts and names are derived from the data, so they cannot drift.

If `GOOGLE_FORM_URL` is empty, Pre-register buttons show a "pre-registration opening soon" notice; spot registration at the venue is stated regardless.

## Sections

`hero · countdown · about · levels · progression (+ prizes) · rules · registration · info · faq · final-cta`

## How it works

| Layer | Where | What |
|---|---|---|
| Film | `components/stage/CinemaStage.tsx`, `lib/frames.ts` | Fixed full-screen canvas playing WebP **frame sequences**. Scrolling picks an already-decoded frame instead of seeking a video, so scrubbing never stutters; adjacent frames cross-fade by the sub-frame remainder. Frames blit 1:1 and CSS `object-fit` scales them, so cost is independent of screen size. The playhead frame is fetched at high priority, a window around it is prefetched in the scroll direction, one frame of every chapter is seeded at idle, and non-adjacent chapters are released. |
| Choreography | `components/stage/ChapterTrigger.tsx`, `sections/FinalRide.tsx` | GSAP ScrollTrigger maps each section's progress to `(clip, t)` plus a mood (scrim, embers, heat, blackout) in the `lib/director.ts` store. Nothing re-renders React during scroll. |
| WebGL | `stage/Embers.tsx`, `chain/ChainCanvas.tsx` | Ember particles (one draw call) and the instanced 3D steel chain (countdown frame, qualification funnel). `three` is lazy-loaded and disposed on unmount. |
| Content | `components/sections/*`, `components/levels/*` | Server-rendered sections with small client islands: countdown, level dialog, FAQ accordion, nav. Every rule, scoring line and prize is in the HTML, so the rulebook survives without JS. |

## Media pipeline

- **Sources** (`../assets/source/`, kept local, not in git): master reference, 13 keyframes and the raw 1080p clips.
- `npm run media:frames` → `public/media/frames/{desktop,mobile}/<clip>/f###.webp` (desktop 1152px @ 12 fps, mobile 704px @ 10 fps), plus `public/media/posters` and the OG image. Frame counts land in `src/content/frames.json`.
- Roughly 4.5 MB per chapter on desktop, 2 MB on mobile; only the current chapter and its neighbour are fetched.

## Fallbacks

- **No JavaScript:** every level, rule, prize and FAQ renders; the film shows the first poster.
- **No WebGL:** chains fall back to CSS frames, embers are skipped.
- **Frames blocked:** the keyframe poster stays on screen.
- **`prefers-reduced-motion`:** posters only, no scrubbing/embers/pinning, and the finale becomes a static layout.

## QA scripts (run against `npx next start -p 3100`; set `CHROME_PATH` if Chrome is elsewhere)

- `npm run qa:visual | qa:mobile | qa:reduced` — screenshot every chapter, test the level dialog (Enter/Escape/focus trap/restore), FAQ, mobile menu, and measure scroll frame times and network usage.
- `npm run qa:fallback` — no-JS, no-WebGL and blocked-frames checks.

## Notes

- The rider is an original flaming-skull biker design; it deliberately avoids Marvel's "Ghost Rider" name and its film-specific motorcycle, and no frame of the reference film clip is used.
- Prizes (₹1,500 / ₹1,000 / ₹750 with certificates) come from the organisers, not the rules document.
