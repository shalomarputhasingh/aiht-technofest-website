// Turns the raw source clips into WebP frame sequences for canvas scrubbing.
// Frame sequences scrub perfectly smoothly: scrolling picks an already-decoded
// frame instead of asking a video decoder to seek.
//   node scripts/encode-frames.mjs [clipId ...]
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../assets/source/video");
const outDir = resolve(here, "../public/media/frames");
const posterDir = resolve(here, "../public/media/posters");
const manifestPath = resolve(here, "../src/content/frames.json");
const only = process.argv.slice(2);

const VARIANTS = [
  { name: "desktop", width: 1152, fps: 12, quality: 52 },
  { name: "mobile", width: 704, fps: 10, quality: 55 },
];

const run = (args) => execFileSync(ffmpeg, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

const manifest = {};
try {
  Object.assign(manifest, JSON.parse(readFileSync(manifestPath, "utf8")));
} catch {
  /* first run */
}

for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".mp4")).sort()) {
  const id = basename(file, ".mp4");
  if (only.length && !only.includes(id)) continue;
  const input = resolve(srcDir, file);
  manifest[id] ??= {};

  for (const v of VARIANTS) {
    const dir = resolve(outDir, v.name, id);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    run([
      "-i", input,
      "-vf", `fps=${v.fps},scale=${v.width}:-2:flags=lanczos`,
      "-c:v", "libwebp", "-quality", String(v.quality), "-compression_level", "6",
      resolve(dir, "f%03d.webp"),
    ]);
    const files = readdirSync(dir);
    const bytes = files.reduce((s, f) => s + statSync(resolve(dir, f)).size, 0);
    manifest[id][v.name] = { count: files.length, fps: v.fps };
    // First/last frame double as the poster stills shown to no-JS, reduced-motion
    // and Save-Data visitors.
    if (v.name === "desktop") {
      mkdirSync(posterDir, { recursive: true });
      copyFileSync(resolve(dir, files[0]), resolve(posterDir, `${id}_start.webp`));
      copyFileSync(resolve(dir, files[files.length - 1]), resolve(posterDir, `${id}_end.webp`));
    }
    console.log(`${v.name.padEnd(8)} ${id}  ${files.length} frames  ${(bytes / 1048576).toFixed(1)} MB`);
  }
}

const og = resolve(here, "../../assets/source/keyframes/k12.png");
if (existsSync(og)) {
  run(["-i", og, "-vf", "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630", "-q:v", "4", resolve(here, "../public/og-image.jpg")]);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest -> ${manifestPath}`);
