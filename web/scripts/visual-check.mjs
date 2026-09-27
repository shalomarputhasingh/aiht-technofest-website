// Scripted visual + interaction QA using the locally installed Chrome.
//   node scripts/visual-check.mjs <outDir> [url] [--mobile] [--reduced]
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const [outDir = "./qa", url = "http://localhost:3100"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const mobile = process.argv.includes("--mobile");
const reduced = process.argv.includes("--reduced");
const tag = `${mobile ? "mobile" : "desktop"}${reduced ? "-reduced" : ""}`;
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  // Set CHROME_PATH to your local Chrome/Edge binary (defaults to the Windows install location).
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900 });
if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
page.on("requestfailed", (r) => !r.url().includes("/media/") && errors.push(`request failed: ${r.url()}`));

await page.goto(url, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 6000)); // opening sequence

const settle = () =>
  page.evaluate(async () => {
    // wait until the active clip stops seeking toward its target
    for (let i = 0; i < 60; i++) {
      const c = document.querySelector(".stage__canvas");
      const before = c?.dataset.frame;
      await new Promise((r) => setTimeout(r, 120));
      if (!c || (c.dataset.frame !== undefined && c.dataset.frame === before)) break;
    }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });

const shots = [
  ["hero", 0],
  ["hero", 0.7],
  ["countdown", 0.55],
  ["about", 0.4],
  ["levels", 0.06],
  ["levels", 0.4],
  ["levels", 0.75],
  ["progression", 0.45],
  ["progression", 0.8],
  ["rules", 0.55],
  ["registration", 0.6],
  ["info", 0.6],
  ["faq", 0.5],
  ["final-cta", 0.12],
  ["final-cta", 0.52],
  ["final-cta", 0.97],
];

const report = [];
for (const [id, f] of shots) {
  const info = await page.evaluate(
    (id, f) => {
      const el = document.getElementById(id);
      const y = id === "hero" && f === 0 ? 0 : el.offsetTop + (el.offsetHeight - innerHeight) * f;
      window.scrollTo(0, Math.max(0, y));
      return { y: Math.round(y) };
    },
    id,
    f,
  );
  await new Promise((r) => setTimeout(r, 700));
  await settle();
  const state = await page.evaluate(() => {
    const c = document.querySelector(".stage__canvas");
    return {
      clip: c?.dataset.clip ?? "poster",
      frame: c?.dataset.frame ?? null,
      chapter: document.querySelector(".nav__chapter")?.textContent,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  const file = resolve(outDir, `${tag}-${id}-${String(Math.round(f * 100)).padStart(2, "0")}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 70 });
  report.push({ id, f, ...info, ...state });
}

// ---- interaction checks ------------------------------------------------------
const checks = {};
await page.evaluate(() => document.getElementById("levels").scrollIntoView());
await new Promise((r) => setTimeout(r, 800));
// keyboard: focus a card, Enter opens, Escape closes, focus restored
await page.focus(".level__more");
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 700));
checks.modalOpensOnEnter = await page.evaluate(() => document.querySelector("dialog.modal").open);
checks.modalFocus = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
await page.screenshot({ path: resolve(outDir, `${tag}-modal.jpg`), type: "jpeg", quality: 75 });
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
checks.focusStaysInModal = await page.evaluate(() => !!document.activeElement?.closest("dialog.modal"));
await page.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 500));
checks.modalClosesOnEscape = await page.evaluate(() => !document.querySelector("dialog.modal").open);
checks.focusRestored = await page.evaluate(() => document.activeElement?.classList.contains("level__more"));
checks.scrollUnlocked = await page.evaluate(() => !document.body.classList.contains("scroll-locked"));

// FAQ accordion (single open)
checks.faq = await page.evaluate(async () => {
  const btns = [...document.querySelectorAll(".faq__q button")];
  btns[0].click();
  await new Promise((r) => setTimeout(r, 300));
  btns[3].click();
  await new Promise((r) => setTimeout(r, 300));
  await new Promise((r) => setTimeout(r, 800));
  const items = [...document.querySelectorAll(".faq__item")];
  return {
    expanded: btns.map((b) => b.getAttribute("aria-expanded")).join(","),
    // every item must stay visible after toggling (regression: re-render wiped reveal state)
    allVisible: items.every((li) => getComputedStyle(li).opacity === "1"),
    openAnswerVisible: getComputedStyle(items[3].querySelector(".faq__a-inner p")).opacity === "1",
  };
});

if (mobile) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.tap(".burger");
  await new Promise((r) => setTimeout(r, 700));
  checks.burgerInViewport = await page.evaluate(() => document.querySelector(".burger").getBoundingClientRect().right <= document.documentElement.clientWidth);
  checks.layoutViewportWidth = await page.evaluate(() => window.innerWidth);
  checks.mobileNavOpen = await page.evaluate(() => !document.getElementById("mobile-nav").hidden);
  checks.mobileNavFocus = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40));
  await page.screenshot({ path: resolve(outDir, `${tag}-menu.jpg`), type: "jpeg", quality: 75 });
  await page.tap(".burger");
  await new Promise((r) => setTimeout(r, 500));
  checks.mobileNavClosesOnBurgerTap = await page.evaluate(() => document.getElementById("mobile-nav").hidden);
  await page.tap(".burger");
  await new Promise((r) => setTimeout(r, 500));
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 400));
  checks.mobileNavClosesOnEscape = await page.evaluate(() => document.getElementById("mobile-nav").hidden);
}

// ---- scroll performance: sweep the whole page and sample frame times --------
checks.scrollPerf = await page.evaluate(async () => {
  const total = document.documentElement.scrollHeight - innerHeight;
  const times = [];
  let last = performance.now();
  const steps = 360;
  for (let i = 0; i <= steps; i++) {
    window.scrollTo(0, (total * i) / steps);
    await new Promise((r) => requestAnimationFrame(r));
    const now = performance.now();
    times.push(now - last);
    last = now;
  }
  times.sort((a, b) => a - b);
  const p = (q) => +times[Math.floor(times.length * q)].toFixed(1);
  return { medianMs: p(0.5), p95Ms: p(0.95), maxMs: +times[times.length - 1].toFixed(1) };
});

checks.resources = await page.evaluate(() => {
  const r = performance.getEntriesByType("resource");
  const kb = (list) => Math.round(list.reduce((s, e) => s + (e.transferSize || 0), 0) / 1024);
  return {
    jsKB: kb(r.filter((e) => e.name.endsWith(".js"))),
    frameKB: kb(r.filter((e) => e.name.includes("/media/frames/"))),
    framesRequested: r.filter((e) => e.name.includes("/media/frames/")).length,
    clipsFetched: [...new Set(r.filter((e) => e.name.includes("/media/frames/")).map((e) => e.name.split("/").slice(-2)[0]))],
    webglCanvases: document.querySelectorAll("canvas").length,
  };
});

console.log(JSON.stringify({ tag, report, checks, errors: [...new Set(errors)].slice(0, 20) }, null, 2));
await browser.close();
