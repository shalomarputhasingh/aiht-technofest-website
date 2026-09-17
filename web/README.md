# Technofest 2026 — cinematic site

A scroll-driven cinematic rebuild of the Technofest 2026 (AIHT) website. A flaming-skull rider's story plays as you scroll, and every piece of real Technofest content stays as accessible HTML on top of it.

```bash
npm install
npm run build && npm start      # http://localhost:3000
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so Open Graph/Twitter images resolve to absolute URLs.

## Editing content

The original files in `../Source_Content/` are still the source of truth.

1. Edit `Source_Content/config.js` (form URL, event date, events) or the FAQ in `Source_Content/app.js`.
2. `npm run content:extract` regenerates `src/content/source.json` from those files. Event and FAQ data is never retyped by hand.
3. Static page copy transcribed from `index.html` lives in `src/content/site.ts`.
4. `npm start`, then `npm run content:audit`, checks that every visible text segment of the original `index.html`, all events, all FAQs and all link destinations exist in the rendered page.

If `GOOGLE_FORM_URL` is empty, every Register button shows the original "Registration coming soon!" notice instead of navigating.

## How it works

| Layer | Where | What |
|---|---|---|
| Film | `components/stage/CinemaStage.tsx` | Fixed full-screen `<video>` stack. Scroll position scrubs the active clip. Only the active clip and its two neighbours hold a `src`, and neighbours are pre-parked on their boundary frame so hand-offs never flash. |
| Choreography | `components/stage/ChapterTrigger.tsx`, `sections/FinalRide.tsx` | GSAP ScrollTrigger maps each section's progress to `(clip, t)` plus a mood (scrim, embers, heat, blackout) in the `lib/director.ts` store. Nothing re-renders React during scroll. |
| WebGL | `stage/Embers.tsx`, `chain/ChainCanvas.tsx` | Additive ember particles (one draw call, shader-animated) and the instanced 3D steel chain (countdown frame and participation span). `three` is lazy-loaded, the chain renders only while on screen, and both dispose on unmount. |
| Content | `components/sections/*`, `components/events/*` | Server-rendered sections with small client islands: countdown, search/filter, `<dialog>` modal, FAQ accordion, nav. |

### Shot list (keyframe-chained: each clip's last frame is the next clip's first)

| Clip | Chapter / section | Action |
|---|---|---|
| c01_awakening | Hero | darkness → embers → fire climbs boots to skull → walk (first 45% auto-plays on load) |
| c02_approach | Countdown | walks to the parked chopper, grips it |
| c03_mount → c04_ignition | About | mounts, starts engine; exhaust, wheels, chain ignite |
| c05_ride_city | Events | launches through the abandoned city |
| c06_ride_future | Participation | abandoned city becomes futuristic city |
| c07_stop | Registration | slows, stops, dismounts, stands beside bike |
| c08_watch | Important Info → FAQ (held) | camera orbits to look down the dark highway |
| c09 → c12 | Final CTA (pinned 720vh) | remount → dark highway → stop and dismount → skull push-in → black → title card |

## Media pipeline

- **Sources** (`../assets/source/`, kept local, not in git): the master reference (`keyframes/master_b.png`), 13 keyframes `k00–k12` and the raw 1080p clips. Keyframes were generated with GPT Image 2.5, conditioned on the master. Clips are Kling 3.0 pro, animated between consecutive keyframes.
- `npm run media:encode` → `public/media/{desktop,mobile}` (H.264, 720p/480p, keyframe every 6 frames for cheap scrub seeks, no audio, faststart) plus WebP first/last-frame posters.
- Phones get the 480p renditions with a per-clip focal point (`lib/clips.ts`). Reduced-motion and Save-Data visitors get posters only.

## Fallbacks

- **No JavaScript:** all content and links render, and the film shows the first poster.
- **No WebGL:** the chains fall back to CSS frames and embers are skipped.
- **Video fails or is blocked:** the matching keyframe poster is shown.
- **`prefers-reduced-motion`:** no scrubbing, embers or pinning. The poster stills tell the story and the finale becomes a static layout.

## QA scripts (run against `npx next start -p 3100`; set `CHROME_PATH` if Chrome is not at the Windows default)

- `npm run qa:visual | qa:mobile | qa:reduced` drive local Chrome headless. They screenshot every chapter, test keyboard modal/focus trap/Escape, FAQ and mobile menu, and measure scroll frame times and video/network usage.
- `npm run qa:fallback` runs the no-JS, no-WebGL and blocked-video checks.

## Notes

- The rider is an original flaming-skull biker design. It deliberately does not use Marvel's "Ghost Rider" name or its film-specific motorcycle, and the watermarked film clip in `GHOST_RIDER_REFERENCES/video.mp4` is not used in any asset.
- Source-content quirk preserved verbatim: the FAQ says the venue "will be announced soon", while the Important Information section lists AIHT, OMR as the venue.
