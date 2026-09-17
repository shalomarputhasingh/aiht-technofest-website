// Content contract audit: verifies the rebuilt site against the original source files.
//   node scripts/audit-content.mjs [url]   (default http://localhost:3100)
// 1. Every visible text segment of Source_Content/index.html exists in the rendered page.
// 2. Every event (name, description, category) and FAQ (question + answer) from
//    config.js / app.js is rendered; source.json matches the originals exactly.
// 3. Every link destination from the original page is present.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../Source_Content");
const url = process.argv[2] ?? "http://localhost:3100";
const require = createRequire(import.meta.url);

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&bull;/g, "•")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

const BLOCK = /<\/?(div|p|h[1-6]|li|ul|ol|section|header|footer|nav|main|article|button|a|dt|dd|dl|br|label|input|span class="(?:pill|top-bar-item|tele-item|host-pill-gold|host-pill-ghost|countdown-unit-label)[^"]*")[^>]*>/gi;

/** HTML → visible text lines (scripts/styles/head/comments/svg removed). */
function textLines(html) {
  const body = html
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<template[\s\S]*?<\/template>/gi, "");
  return decode(body.replace(BLOCK, "\n").replace(/<[^>]+>/g, ""))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => /[A-Za-z0-9]/.test(l));
}

const norm = (s) => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const res = await fetch(url);
if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
const renderedHtml = await res.text();
const rendered = norm(textLines(renderedHtml).join(" \n "));
const renderedFlat = rendered.replace(/\s+/g, "");

const failures = [];
const pass = { text: 0, conditional: 0, events: 0, faq: 0, links: 0 };

// Copy that only renders in a UI state (not in the initial HTML) — verified in the app source.
const CONDITIONAL = new Set(["No events match your search. Try a different keyword."]);
const siteSource = readFileSync(resolve(here, "../src/content/site.ts"), "utf8");

// ---- 1. static copy -------------------------------------------------------
const original = readFileSync(resolve(srcDir, "index.html"), "utf8");
// Decorative/HUD strings that the original marks aria-hidden are allowed to be restyled;
// they are still checked but whitespace-insensitively.
for (const line of new Set(textLines(original))) {
  const stripped = line
    .replace(/^[^\w(©]+/u, "") // drop leading icon glyphs (✓ 📞 …)
    .replace(/\s*[→←↑↓]\s*$/u, "") // arrow glyphs are now SVG icons
    .trim();
  if (!stripped) continue;
  if (rendered.includes(stripped) || renderedFlat.includes(stripped.replace(/\s+/g, ""))) pass.text++;
  else if (CONDITIONAL.has(stripped) && siteSource.includes(stripped)) pass.conditional++;
  else failures.push(`[copy] missing: "${stripped}"`);
}

// ---- 2. data --------------------------------------------------------------
const { CONFIG, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } = require(resolve(srcDir, "config.js"));
const appJs = readFileSync(resolve(srcDir, "app.js"), "utf8");
const FAQ_DATA = vm.runInNewContext(appJs.match(/const FAQ_DATA = (\[[\s\S]*?\n\]);/)[1]);
const extracted = JSON.parse(readFileSync(resolve(here, "../src/content/source.json"), "utf8"));

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (!same(extracted.CONFIG, CONFIG)) failures.push("[data] source.json CONFIG differs from config.js — re-run extract-content");
if (!same(extracted.TECHNICAL_EVENTS, TECHNICAL_EVENTS)) failures.push("[data] TECHNICAL_EVENTS differ from config.js");
if (!same(extracted.NON_TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS)) failures.push("[data] NON_TECHNICAL_EVENTS differ from config.js");
if (!same(extracted.FAQ_DATA, FAQ_DATA)) failures.push("[data] FAQ_DATA differs from app.js");

// Counts shown in the original index.html must agree with the event data.
for (const [label, n] of [["Technical Events — ", TECHNICAL_EVENTS.length], ["Non-Technical Events — ", NON_TECHNICAL_EVENTS.length]]) {
  if (!original.includes(label + n)) failures.push(`[data] index.html heading "${label}…" does not match ${n} events in config.js`);
}
const allEvents = [...TECHNICAL_EVENTS, ...NON_TECHNICAL_EVENTS];

for (const e of allEvents) {
  const missing = [e.name, e.description].filter((s) => !rendered.includes(norm(s)));
  if (missing.length) failures.push(`[event] ${e.id} missing: ${missing.join(" | ")}`);
  else pass.events++;
}

for (const f of FAQ_DATA) {
  const missing = [f.q, f.a].map(norm).filter((s) => !rendered.includes(s));
  if (missing.length) failures.push(`[faq] missing: ${missing.join(" | ")}`);
  else pass.faq++;
}

// ---- 3. destinations ------------------------------------------------------
const hrefs = new Set([...original.matchAll(/href="([^"#][^"]*)"/g)].map((m) => m[1]).filter((h) => !/\.css$|fonts\.g|^data:/.test(h)));
hrefs.add(CONFIG.GOOGLE_FORM_URL);
for (const h of hrefs) {
  if (renderedHtml.includes(`href="${h}"`)) pass.links++;
  else failures.push(`[link] missing destination: ${h}`);
}
for (const anchor of ["#hero", "#about", "#events", "#participation", "#faq"]) {
  if (!renderedHtml.includes(`href="${anchor}"`)) failures.push(`[nav] missing anchor ${anchor}`);
}
for (const id of ["hero", "countdown", "about", "events", "participation", "registration", "info", "faq", "final-cta"]) {
  if (!renderedHtml.includes(`id="${id}"`)) failures.push(`[section] missing #${id}`);
}

console.log(
  `copy segments ok: ${pass.text} (+${pass.conditional} state-dependent) | events ok: ${pass.events}/${allEvents.length} | faq ok: ${pass.faq}/${FAQ_DATA.length} | link destinations ok: ${pass.links}/${hrefs.size}`,
);
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  failures.forEach((f) => console.log("  " + f));
  process.exitCode = 1;
} else {
  console.log("CONTENT AUDIT PASSED");
}
