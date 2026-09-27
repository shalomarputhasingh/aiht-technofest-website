// Extracts the authoritative Stack and Level data straight from the source files
// (Source_Content/config.js + stack-and-level.js) so nothing is retyped by hand.
// Output: src/content/source.json
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../Source_Content");
const require = createRequire(import.meta.url);

const { CONFIG } = require(resolve(srcDir, "config.js"));
const { GENERAL_RULES, LEVELS, REGULATIONS, CODE_OF_CONDUCT, WINNING, PRIZES, PROGRESSION, FAQ } = require(
  resolve(srcDir, "stack-and-level.js"),
);

const out = { CONFIG, GENERAL_RULES, LEVELS, REGULATIONS, CODE_OF_CONDUCT, WINNING, PRIZES, PROGRESSION, FAQ };

if (LEVELS.length !== 3) throw new Error(`Expected 3 levels, got ${LEVELS.length}`);
const ids = LEVELS.map((l) => l.id);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate level ids");
if (!CONFIG.EVENT_DATE || !CONFIG.EVENT_NAME) throw new Error("config.js is missing EVENT_DATE/EVENT_NAME");

const dest = resolve(here, "../src/content/source.json");
writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(
  `Extracted ${LEVELS.length} levels, ${GENERAL_RULES.length + REGULATIONS.length + CODE_OF_CONDUCT.length} rules, ${FAQ.length} FAQs -> ${dest}`,
);
