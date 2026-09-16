// Extracts the authoritative Technofest data straight from the original source
// files (Source_Content/config.js + app.js) so nothing is retyped by hand.
// Output: src/content/source.json
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../Source_Content");
const require = createRequire(import.meta.url);

const { CONFIG, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } = require(resolve(srcDir, "config.js"));

// FAQ_DATA lives inside app.js as a top-level const; evaluate just that literal.
const appJs = readFileSync(resolve(srcDir, "app.js"), "utf8");
const match = appJs.match(/const FAQ_DATA = (\[[\s\S]*?\n\]);/);
if (!match) throw new Error("FAQ_DATA not found in app.js");
const FAQ_DATA = vm.runInNewContext(match[1]);

const out = { CONFIG, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS, FAQ_DATA };

if (TECHNICAL_EVENTS.length !== 9) throw new Error(`Expected 9 technical events, got ${TECHNICAL_EVENTS.length}`);
if (NON_TECHNICAL_EVENTS.length !== 11) throw new Error(`Expected 11 non-technical events, got ${NON_TECHNICAL_EVENTS.length}`);

const dest = resolve(here, "../src/content/source.json");
writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(
  `Extracted ${TECHNICAL_EVENTS.length} technical + ${NON_TECHNICAL_EVENTS.length} non-technical events, ${FAQ_DATA.length} FAQs -> ${dest}`,
);
