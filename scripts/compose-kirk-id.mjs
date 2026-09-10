import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "kirk");
mkdirSync(dir, { recursive: true });

const W = 420;
const H = 560;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
}

const paper = await download(
  "https://raw.githubusercontent.com/prabhasp/ali-khasro/master/lokta/paper2.jpg"
);

// Costco membership photos are a gray booth, fluorescent cast, on-camera flash.
const booth = await sharp(paper)
  .resize(W, H, { fit: "cover", position: "centre" })
  .greyscale()
  .modulate({ brightness: 0.82, saturation: 0.15 })
  .toBuffer();

const wash = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 168, g: 176, b: 184 },
  },
})
  .jpeg()
  .toBuffer();

const lit = await sharp(booth)
  .composite([{ input: wash, blend: "multiply" }])
  .modulate({ brightness: 1.06 })
  .toBuffer();

const grade = await sharp(
  svg(
    W,
    H,
    `<defs>
      <radialGradient id="flash" cx="38%" cy="18%" r="72%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#2a3238" stop-opacity="0.38"/>
      </radialGradient>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d5dde4" stop-opacity="0.2"/>
        <stop offset="1" stop-color="#3a444c" stop-opacity="0.34"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect width="${W}" height="${H}" fill="url(#flash)"/>`
  )
)
  .png()
  .toBuffer();

const stamp = await sharp(
  svg(
    W,
    H,
    `<text x="210" y="300" text-anchor="middle" fill="#E31837" font-family="Georgia, Times New Roman, serif" font-size="132" font-style="italic" font-weight="600">K</text>
    <text x="210" y="528" text-anchor="middle" fill="#f2f5f7" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="3.4">COSTCO · 09/19</text>`
  )
)
  .png()
  .toBuffer();

const portrait = await sharp(lit)
  .composite([
    { input: grade, blend: "over" },
    { input: stamp, blend: "over" },
  ])
  .jpeg({ quality: 90 })
  .toBuffer();

await sharp(portrait).toFile(join(dir, "id-backdrop.jpg"));
await sharp(portrait).toFile(join(dir, "id-portrait.jpg"));
process.stdout.write("wrote public/kirk/id-portrait.jpg (booth print)\n");
