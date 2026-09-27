// Content contract audit for the CSE events at Technofest-3.0.
//   node scripts/audit-content.mjs [url]   (default http://localhost:3100)
//
// 1. Every rule sentence in the official .docx appears on the rendered page.
// 2. Every event, round, game, scoring line, prize and FAQ from Source_Content
//    is rendered; source.json matches the source files.
// 3. Config values and link destinations are present.
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
const DOCX = process.env.RULES_DOCX ?? resolve(srcDir, "Technofest_3.0_CSE_Rules.docx");

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
const key = (s) =>
  norm(s)
    .toLowerCase()
    .replace(/[‘’']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9₹]/g, "");

const res = await fetch(url);
if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
const html = await res.text();
const renderedKey = key(html);

const failures = [];
const pass = { doc: 0, events: 0, rounds: 0, games: 0, rules: 0, scoring: 0, prizes: 0, faq: 0, config: 0, links: 0 };
const has = (s) => renderedKey.includes(key(s));

// ---- 1. the official document ---------------------------------------------
if (existsSync(DOCX)) {
  for (const raw of docxParagraphs(DOCX)) {
    // Skip headings ("i. General Rules:", "Level 1: Bug Bounty (Debugging Round)")
    // and document furniture; rule sentences must survive verbatim.
    if (!/[.:]$/.test(raw) || raw.length < 25) continue;
    if (/^(i|ii|iii|iv|v|vi)\.\s/i.test(raw)) continue;
    if (/^(Level|Round|ROUND|Game)\s*\d+\s*[:–-]/.test(raw) && raw.length < 60) continue;
    // "Level 2: Each category is scored…" — the prefix is document structure.
    const line = raw.replace(/^Level\s*\d+\s*:\s*/i, "");
    if (has(line)) pass.doc++;
    else failures.push(`[docx] sentence missing from site: "${raw}"`);
  }
} else {
  console.log(`(note: ${DOCX} not found — skipped verbatim .docx check)`);
}

// ---- 2. structured source --------------------------------------------------
const { CONFIG } = require(resolve(srcDir, "config.js"));
const SRC = require(resolve(srcDir, "cse-events.js"));
const extracted = JSON.parse(readFileSync(resolve(here, "../src/content/source.json"), "utf8"));

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (!same(extracted.CONFIG, CONFIG)) failures.push("[data] source.json CONFIG differs from config.js — re-run content:extract");
for (const k of ["EVENTS", "FAQ", "PRIZE_NOTE"]) {
  if (!same(extracted[k], SRC[k])) failures.push(`[data] ${k} differs from cse-events.js — re-run content:extract`);
}

for (const e of SRC.EVENTS) {
  const missing = [e.name, e.tagline, e.summary, ...e.generalRules, ...e.regulations, ...e.conduct, ...e.winning].filter((s) => !has(s));
  if (missing.length) failures.push(`[event] ${e.id} missing: ${missing.slice(0, 2).map((m) => m.slice(0, 60)).join(" | ")}`);
  else pass.events++;
  pass.rules += e.generalRules.length + e.regulations.length + e.conduct.length + e.winning.length;

  for (const r of e.rounds) {
    if (has(r.name)) pass.rounds++;
    else failures.push(`[round] ${e.id}: "${r.name}" not rendered`);
    for (const rule of r.rules) if (!has(rule)) failures.push(`[round] ${e.id}/${r.name} rule missing: "${rule.slice(0, 60)}…"`);
    for (const g of r.games) {
      const gm = [g.name, ...(g.note ? [g.note] : []), ...g.rules].filter((s) => !has(s));
      if (gm.length) failures.push(`[game] ${e.id}/${g.name} missing ${gm.length} line(s): "${gm[0].slice(0, 60)}…"`);
      else pass.games++;
    }
  }
  for (const group of e.scoring) {
    for (const item of group.items) {
      if (has(item.text)) pass.scoring++;
      else failures.push(`[scoring] ${e.id}/${group.level}: "${item.text.slice(0, 50)}…" missing`);
    }
  }
  if (e.prizes) {
    for (const p of e.prizes) {
      if (has(p.amount) && has(p.position)) pass.prizes++;
      else failures.push(`[prize] ${e.id}: ${p.position} ${p.amount} missing`);
    }
  }
}
if (!has(SRC.PRIZE_NOTE)) failures.push("[prize] non-technical prize note not rendered");

for (const f of SRC.FAQ) {
  const missing = [f.q, f.a].filter((s) => !has(s));
  if (missing.length) failures.push(`[faq] missing: ${norm(missing[0]).slice(0, 60)}…`);
  else pass.faq++;
}

// ---- 3. config + destinations ----------------------------------------------
for (const k of ["FEST_NAME", "DEPARTMENT", "DEPARTMENT_FULL", "EVENT_DATE_DISPLAY", "COLLEGE_NAME", "REGISTRATION_MODE", "VENUE_ROOMS"]) {
  if (has(CONFIG[k])) pass.config++;
  else failures.push(`[config] ${k} ("${CONFIG[k]}") not rendered`);
}
for (const href of [CONFIG.GOOGLE_FORM_URL, CONFIG.COLLEGE_WEBSITE, "tel:+914427471330", "mailto:principal@aiht.ac.in"]) {
  if (html.includes(`href="${href}"`)) pass.links++;
  else failures.push(`[link] missing destination: ${href}`);
}
for (const id of ["hero", "countdown", "about", "events", ...SRC.EVENTS.map((e) => e.id), "rules", "registration", "info", "faq", "final-cta"]) {
  if (!html.includes(`id="${id}"`)) failures.push(`[section] missing #${id}`);
}

console.log(
  `docx sentences ok: ${pass.doc} | events ok: ${pass.events}/${SRC.EVENTS.length} | rounds: ${pass.rounds} | games: ${pass.games} | rules: ${pass.rules} | scoring: ${pass.scoring} | prizes: ${pass.prizes} | faq: ${pass.faq}/${SRC.FAQ.length} | config: ${pass.config} | links: ${pass.links}`,
);
if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  failures.slice(0, 25).forEach((f) => console.log("  " + f));
  if (failures.length > 25) console.log(`  … and ${failures.length - 25} more`);
  process.exitCode = 1;
} else {
  console.log("CONTENT AUDIT PASSED");
}
