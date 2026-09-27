// Content contract audit for Stack and Level.
//   node scripts/audit-content.mjs [url]   (default http://localhost:3100)
//
// 1. Every rule sentence in the official .docx appears on the rendered page.
// 2. Every level, scoring line, regulation, code-of-conduct line, prize and FAQ
//    from Source_Content is rendered; source.json matches the source files.
// 3. Config values (date, venue, contacts) and link destinations are present.
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { docxParagraphs } from "./lib/docx.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../Source_Content");
const url = process.argv[2] ?? "http://localhost:3100";
const require = createRequire(import.meta.url);

// The official rules document, kept in the repo so this check runs anywhere.
const DOCX = process.env.RULES_DOCX ?? resolve(srcDir, "Stack_and_Level_Rules_and_Instruction.docx");

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

const stripTags = (html) =>
  html
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ");

const norm = (s) => decode(stripTags(String(s))).replace(/\s+/g, " ").trim();
/** Whitespace/punctuation-insensitive comparison key. */
const key = (s) => norm(s).toLowerCase().replace(/[\u2018\u2019']/g, "'").replace(/[\u2013\u2014]/g, "-").replace(/[^a-z0-9₹]/g, "");

const res = await fetch(url);
if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
const html = await res.text();
const rendered = norm(html);
const renderedKey = key(html);

const failures = [];
const pass = { doc: 0, levels: 0, rules: 0, scoring: 0, prizes: 0, faq: 0, config: 0, links: 0 };
const has = (s) => renderedKey.includes(key(s));

// ---- 1. the official document ---------------------------------------------
if (existsSync(DOCX)) {
  // Headings/labels from the document are re-worded for the web; the rule
  // sentences themselves must survive verbatim.
  const SENTENCE = /[.:]$/;
  for (const raw of docxParagraphs(DOCX)) {
    if (!SENTENCE.test(raw) || raw.length < 25) continue; // skip headings like "i. General Rules:"
    if (/^\d+\.\s*Stack and Level/i.test(raw)) continue;
    // "Level 2: Each category is scored…" — the prefix is document structure,
    // shown on the site as the level the scoring belongs to.
    const line = raw.replace(/^Level\s*\d+\s*:\s*/i, "");
    if (has(line)) pass.doc++;
    else failures.push(`[docx] sentence missing from site: "${raw}"`);
  }
} else {
  console.log(`(note: ${DOCX} not reachable — skipped verbatim .docx check)`);
}

// ---- 2. structured source --------------------------------------------------
const { CONFIG } = require(resolve(srcDir, "config.js"));
const SRC = require(resolve(srcDir, "stack-and-level.js"));
const extracted = JSON.parse(readFileSync(resolve(here, "../src/content/source.json"), "utf8"));

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (!same(extracted.CONFIG, CONFIG)) failures.push("[data] source.json CONFIG differs from config.js — re-run content:extract");
for (const k of ["GENERAL_RULES", "LEVELS", "REGULATIONS", "CODE_OF_CONDUCT", "WINNING", "PRIZES", "PROGRESSION", "FAQ"]) {
  if (!same(extracted[k], SRC[k])) failures.push(`[data] ${k} differs from stack-and-level.js — re-run content:extract`);
}

for (const l of SRC.LEVELS) {
  const missing = [l.name, l.kind, l.number, l.tagline, ...l.rules, ...l.scoring.map((s) => s.text)].filter((s) => !has(s));
  if (missing.length) failures.push(`[level] ${l.id} missing: ${missing.slice(0, 3).join(" | ")}`);
  else pass.levels++;
  pass.scoring += l.scoring.length;
}
for (const r of [...SRC.GENERAL_RULES, ...SRC.REGULATIONS, ...SRC.CODE_OF_CONDUCT, ...SRC.WINNING]) {
  if (has(r)) pass.rules++;
  else failures.push(`[rule] missing: "${r}"`);
}
for (const p of SRC.PRIZES) {
  if (has(p.amount) && has(p.position)) pass.prizes++;
  else failures.push(`[prize] missing: ${p.position} ${p.amount}`);
}
for (const f of SRC.FAQ) {
  const missing = [f.q, f.a].filter((s) => !has(s));
  if (missing.length) failures.push(`[faq] missing: ${norm(missing[0]).slice(0, 60)}…`);
  else pass.faq++;
}

// ---- 3. config + destinations ----------------------------------------------
for (const k of ["EVENT_NAME", "EVENT_DISPLAY_TITLE", "FEST_NAME", "DEPARTMENT", "EVENT_DATE_DISPLAY", "COLLEGE_NAME", "TEAM_SIZE", "VENUE_ROOMS"]) {
  if (has(CONFIG[k])) pass.config++;
  else failures.push(`[config] ${k} ("${CONFIG[k]}") not rendered`);
}
for (const href of [CONFIG.GOOGLE_FORM_URL, CONFIG.COLLEGE_WEBSITE, "tel:+914427471330", "mailto:principal@aiht.ac.in"]) {
  if (html.includes(`href="${href}"`)) pass.links++;
  else failures.push(`[link] missing destination: ${href}`);
}
for (const id of ["hero", "countdown", "about", "levels", "progression", "rules", "registration", "info", "faq", "final-cta"]) {
  if (!html.includes(`id="${id}"`)) failures.push(`[section] missing #${id}`);
}

console.log(
  `docx sentences ok: ${pass.doc} | levels ok: ${pass.levels}/3 | rules ok: ${pass.rules} | scoring lines: ${pass.scoring} | prizes ok: ${pass.prizes}/3 | faq ok: ${pass.faq}/${SRC.FAQ.length} | config ok: ${pass.config} | links ok: ${pass.links}`,
);
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  failures.forEach((f) => console.log("  " + f));
  process.exitCode = 1;
} else {
  console.log("CONTENT AUDIT PASSED");
}
