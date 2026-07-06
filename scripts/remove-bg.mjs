import { removeBackground } from "@imgly/background-removal-node";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const input = path.resolve("public/images/hero.png");
const output = path.resolve("public/images/hero-cutout.png");

console.log("Reading", input);
const data = await readFile(input);
const inputBlob = new Blob([data], { type: "image/png" });

console.log("Removing background (downloads model on first run)...");
const resultBlob = await removeBackground(inputBlob, {
  output: { format: "image/png", quality: 1 },
});

const buffer = Buffer.from(await resultBlob.arrayBuffer());
await writeFile(output, buffer);
console.log("Saved cutout to", output, `(${buffer.length} bytes)`);
