// Degradation QA: the site must stay usable with no JS, no WebGL, or failing video.
//   node scripts/fallback-check.mjs <outDir> [url]
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const [outDir = "./qa", url = "http://localhost:3100"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
// Set CHROME_PATH to your local Chrome/Edge binary (defaults to the Windows install location).
const chrome = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const results = {};

async function run(name, { args = [], js = true, blockVideo = false }, probe) {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setJavaScriptEnabled(js);
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  if (blockVideo) {
    await page.setRequestInterception(true);
    page.on("request", (r) => (r.url().includes("/media/frames/") ? r.abort() : r.continue()));
  }
  await page.goto(url, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 5000));
  results[name] = { ...(await probe(page)), errors };
  await browser.close();
}

const shot = async (page, name, id, f = 0.4) => {
  await page.evaluate(
    (id, f) => {
      const el = document.getElementById(id);
      window.scrollTo(0, el.offsetTop + Math.max(0, el.offsetHeight - innerHeight) * f);
    },
    id,
    f,
  );
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: resolve(outDir, `${name}-${id}.jpg`), type: "jpeg", quality: 65 });
};

await run("no-js", { js: false }, async (page) => {
  await shot(page, "no-js", "hero", 0);
  await shot(page, "no-js", "final-cta", 0.9);
  return page.evaluate(() => ({
    shadeOpacity: getComputedStyle(document.querySelector(".stage__shade")).opacity,
    heroTitleVisible: getComputedStyle(document.querySelector(".hero__title")).opacity !== "0",
    finalTitleVisible: getComputedStyle(document.querySelector(".final__title")).visibility !== "hidden" && getComputedStyle(document.querySelector(".final__title")).opacity !== "0",
    eventSections: document.querySelectorAll(".chapter--event").length,
    rounds: document.querySelectorAll(".round").length,
    games: document.querySelectorAll(".game").length,
    ruleItems: document.querySelectorAll(".ruleslist li, .rulebook__list li").length,
    prizes: document.querySelectorAll(".prize").length,
    preloaderHidden: getComputedStyle(document.querySelector(".preloader") ?? document.body).display === "none",
    faqAnswersInDom: document.querySelectorAll(".faq__a").length,
    registerHref: document.querySelector(".hero__actions a")?.getAttribute("href"),
    posterShown: document.querySelector(".stage__poster").complete,
  }));
});

await run("no-webgl", { args: ["--disable-webgl", "--disable-3d-apis"] }, async (page) => {
  await shot(page, "no-webgl", "countdown", 0.55);
  return page.evaluate(() => ({
    canvases: document.querySelectorAll("canvas").length,
    chainFallbacks: document.querySelectorAll(".chain--fallback").length,
    countdownText: document.querySelector(".countdown__grid")?.innerText.replace(/\s+/g, " "),
  }));
});

await run("frames-blocked", { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"], blockVideo: true }, async (page) => {
  await shot(page, "frames-blocked", "about", 0.6);
  return page.evaluate(() => ({
    posterOpacity: getComputedStyle(document.querySelector(".stage__poster")).opacity,
    posterSrc: document.querySelector(".stage__poster").getAttribute("src"),
    canvasDrew: document.querySelector(".stage__canvas")?.dataset.frame ?? null,
  }));
});

console.log(JSON.stringify(results, null, 2));
