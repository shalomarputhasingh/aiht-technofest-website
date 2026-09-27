# Department of CSE — AIHT Technofest-3.0 2026

A cinematic, scroll-driven website for the **Department of Computer Science and Engineering** events at **Technofest-3.0 2026**, Anand Institute of Higher Technology (AIHT), Chennai — 30 September 2026. Three events: Stack and Level, The Reckoning and Chill Flex.

```
web/             Next.js 16 app (the website): see web/README.md
Source_Content/  Event config + rules data (transcribed from the official .docx) the app is built and audited against
BRAND/           AIHT crest and banner
```

## Quick start

```bash
cd web
npm install
npm run build
npm start        # http://localhost:3000
```

**Deploying on Vercel:** set the project **Root Directory** to `web`, and set `NEXT_PUBLIC_SITE_URL` to the production URL.

## Updating event details

Edit `Source_Content/config.js` (dates, venue, contacts) or `Source_Content/cse-events.js` (events, rounds, games, rules, prizes, FAQ). Then run:

```bash
cd web
npm run content:extract   # regenerate src/content/source.json from the source files
npm run build
```

## Not in this repository

- Raw AI-generation masters (`assets/source/`) are too large for GitHub. The optimised videos and posters the site uses are committed under `web/public/media`.
- Third-party reference material (`GHOST_RIDER_REFERENCES/`, `PROMPT_PACK/`) is kept local only.
