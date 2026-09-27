// Extracts the authoritative CSE event data straight from the source files
// (Source_Content/config.js + cse-events.js) so nothing is retyped by hand.
// Output: src/content/source.json
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../Source_Content");
const require = createRequire(import.meta.url);

const { CONFIG } = require(resolve(srcDir, "config.js"));
const { EVENTS, PRIZE_NOTE, FAQ } = require(resolve(srcDir, "cse-events.js"));

const out = { CONFIG, EVENTS, PRIZE_NOTE, FAQ };

if (!EVENTS.length) throw new Error("cse-events.js has no events");
const ids = EVENTS.map((e) => e.id);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate event ids");
for (const e of EVENTS) {
  if (!e.rounds.length) throw new Error(`${e.id} has no rounds`);
  if (!e.generalRules.length) throw new Error(`${e.id} has no general rules`);
}
if (!CONFIG.EVENT_DATE || !CONFIG.FEST_NAME) throw new Error("config.js is missing EVENT_DATE/FEST_NAME");

const games = EVENTS.reduce((n, e) => n + e.rounds.reduce((m, r) => m + r.games.length, 0), 0);
const dest = resolve(here, "../src/content/source.json");
writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(`Extracted ${EVENTS.length} events, ${EVENTS.reduce((n, e) => n + e.rounds.length, 0)} rounds, ${games} games, ${FAQ.length} FAQs -> ${dest}`);
