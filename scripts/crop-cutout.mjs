import sharp from "sharp";
import path from "node:path";

const src = path.resolve("public/images/hero-cutout.png");
const out = path.resolve("public/images/hero-cutout.png"); // overwrite

const img = sharp(src);
const { width, height } = await img.metadata();

// Pull raw RGBA so we can read the alpha channel.
const raw = await img.ensureAlpha().raw().toBuffer();
const A = 3; // alpha offset within each RGBA pixel
const TH = 40; // alpha threshold to count as "solid"

// Count solid pixels per column.
const colCount = new Array(width).fill(0);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = raw[(y * width + x) * 4 + A];
    if (a > TH) colCount[x]++;
  }
}

// Split columns into clusters separated by gaps of empty columns.
const GAP = Math.round(width * 0.03); // ~3% empty run breaks a cluster
const clusters = [];
let start = -1;
let emptyRun = 0;
for (let x = 0; x < width; x++) {
  if (colCount[x] > 0) {
    if (start === -1) start = x;
    emptyRun = 0;
  } else if (start !== -1) {
    emptyRun++;
    if (emptyRun > GAP) {
      clusters.push([start, x - emptyRun]);
      start = -1;
    }
  }
}
if (start !== -1) clusters.push([start, width - 1]);

// Pick the cluster with the most solid pixels (the person).
let best = clusters[0];
let bestMass = -1;
for (const [s, e] of clusters) {
  let mass = 0;
  for (let x = s; x <= e; x++) mass += colCount[x];
  if (mass > bestMass) {
    bestMass = mass;
    best = [s, e];
  }
}
console.log("clusters:", clusters, "-> chose", best);

const [x0, x1] = best;

// Within that x-range, find the vertical extent of the figure.
let top = height,
  bottom = 0;
for (let y = 0; y < height; y++) {
  for (let x = x0; x <= x1; x++) {
    if (raw[(y * width + x) * 4 + A] > TH) {
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      break;
    }
  }
}

// Add a little breathing room, clamped to the canvas.
const pad = Math.round(width * 0.02);
const left = Math.max(0, x0 - pad);
const right = Math.min(width - 1, x1 + pad);
const t = Math.max(0, top - pad);
const b = Math.min(height - 1, bottom + pad);

const cw = right - left + 1;
const ch = b - t + 1;
console.log(`cropping to ${cw}x${ch} at (${left},${t})`);

await sharp(src)
  .extract({ left, top: t, width: cw, height: ch })
  .png()
  .toFile(out + ".tmp");

// Replace original with cropped version.
const { rename } = await import("node:fs/promises");
await rename(out + ".tmp", out);
console.log("Saved tightly-cropped cutout:", out);
