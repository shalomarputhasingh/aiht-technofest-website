// Transcodes raw Higgsfield/Kling source clips (assets/source/video) into
// web-optimised, scrub-friendly renditions in public/media.
//  - H.264 High, keyframe every 6 frames (cheap random-access seeks while scrubbing)
//  - desktop 1280x720, mobile 854x480, no audio, faststart
//  - first/last-frame WebP posters for loading + no-video fallbacks
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(here, "../../assets/source/video");
const outDir = resolve(here, "../public/media");
const only = process.argv.slice(2);

const renditions = [
  { name: "desktop", scale: "1280:720", crf: 24, maxrate: "3200k" },
  { name: "mobile", scale: "854:480", crf: 26, maxrate: "1400k" },
];

for (const d of ["desktop", "mobile", "posters"]) mkdirSync(resolve(outDir, d), { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

const clips = readdirSync(srcDir).filter((f) => f.endsWith(".mp4")).sort();
for (const file of clips) {
  const id = basename(file, ".mp4");
  if (only.length && !only.includes(id)) continue;
  const input = resolve(srcDir, file);

  for (const r of renditions) {
    const out = resolve(outDir, r.name, `${id}.mp4`);
    run([
      "-i", input, "-an",
      "-vf", `scale=${r.scale}:flags=lanczos,format=yuv420p`,
      "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
      "-crf", String(r.crf), "-maxrate", r.maxrate, "-bufsize", r.maxrate.replace("k", "") * 2 + "k",
      "-g", "6", "-keyint_min", "6", "-sc_threshold", "0", "-bf", "0",
      "-r", "24", "-movflags", "+faststart",
      out,
    ]);
    console.log(`${r.name.padEnd(8)} ${id}  ${(statSync(out).size / 1024).toFixed(0)} KB`);
  }

  // Posters: first + last frame. Clips are keyframe-chained, so these double
  // as the section stills used for reduced-motion / no-video fallback.
  run(["-i", input, "-vf", "scale=1280:-2", "-frames:v", "1", "-c:v", "libwebp", "-quality", "74", resolve(outDir, "posters", `${id}_start.webp`)]);
  run(["-sseof", "-0.08", "-i", input, "-vf", "scale=1280:-2", "-frames:v", "1", "-update", "1", "-c:v", "libwebp", "-quality", "74", resolve(outDir, "posters", `${id}_end.webp`)]);
}

const og = resolve(here, "../../assets/source/keyframes/k12.png");
if (existsSync(og)) {
  run(["-i", og, "-vf", "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630", "-q:v", "4", resolve(here, "../public/og-image.jpg")]);
}
console.log("done");
