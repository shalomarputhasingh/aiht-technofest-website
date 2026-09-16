# AIHT Technofest 2026 — Website

A cinematic, scroll-driven website for **Technofest 2026** at Anand Institute of Higher Technology (AIHT), Chennai. The fest is on 30 September 2026.

```
web/             Next.js 16 app (the website): see web/README.md
Source_Content/  Original site files: the content + data contract the app is built and audited against
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

Edit `Source_Content/config.js` (events, registration form URL, dates) or the FAQ in `Source_Content/app.js`. Then run:

```bash
cd web
npm run content:extract   # regenerate src/content/source.json from the source files
npm run build
```

## Not in this repository

- Raw AI-generation masters (`assets/source/`) are too large for GitHub. The optimised videos and posters the site uses are committed under `web/public/media`.
- Third-party reference material (`GHOST_RIDER_REFERENCES/`, `PROMPT_PACK/`) is kept local only.
