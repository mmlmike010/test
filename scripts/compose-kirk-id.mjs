import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "kirk");
mkdirSync(dir, { recursive: true });

const W = 420;
const H = 560;
const PAD = 18;

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

const innerW = W - PAD * 2;
const innerH = H - PAD * 2;

// Photographic booth: paper grain, fluorescent cyc, floor sweep. No face.
const booth = await sharp(paper)
  .resize(innerW, innerH, { fit: "cover", position: "centre" })
  .greyscale()
  .modulate({ brightness: 0.88, saturation: 0.12 })
  .sharpen(0.8)
  .toBuffer();

const wash = await sharp({
  create: {
    width: innerW,
    height: innerH,
    channels: 3,
    background: { r: 176, g: 186, b: 194 },
  },
})
  .jpeg()
  .toBuffer();

const floor = await sharp(
  svg(
    innerW,
    innerH,
    `<defs>
      <linearGradient id="cyc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d8e0e6" stop-opacity="0.08"/>
        <stop offset="0.58" stop-color="#9aa6b0" stop-opacity="0.05"/>
        <stop offset="0.72" stop-color="#6d7880" stop-opacity="0.28"/>
        <stop offset="1" stop-color="#3f474d" stop-opacity="0.5"/>
      </linearGradient>
      <radialGradient id="flash" cx="34%" cy="16%" r="70%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
        <stop offset="0.38" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#2a3238" stop-opacity="0.28"/>
      </radialGradient>
    </defs>
    <rect width="${innerW}" height="${innerH}" fill="url(#cyc)"/>
    <rect width="${innerW}" height="${innerH}" fill="url(#flash)"/>
    <ellipse cx="${innerW / 2}" cy="${innerH - 36}" rx="${innerW * 0.28}" ry="10" fill="#1a1a1a" fill-opacity="0.12"/>`
  )
)
  .png()
  .toBuffer();

const lit = await sharp(booth)
  .composite([
    { input: wash, blend: "multiply" },
    { input: floor, blend: "over" },
  ])
  .modulate({ brightness: 1.04 })
  .toBuffer();

// Stamp the K after the flash so it stays Costco red on the print.
const stamp = await sharp(
  svg(
    innerW,
    innerH,
    `<text x="${innerW / 2}" y="${Math.round(innerH * 0.58)}" text-anchor="middle" fill="#C41230" font-family="Georgia, Times New Roman, serif" font-size="196" font-style="italic" font-weight="600">K</text>
    <text x="${innerW / 2}" y="${innerH - 22}" text-anchor="middle" fill="#eef2f4" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" letter-spacing="2.8">COSTCO · 09/19</text>`
  )
)
  .png()
  .toBuffer();

const stamped = await sharp(stamp)
  .blur(0.45)
  .png()
  .toBuffer();

const photo = await sharp(lit)
  .composite([{ input: stamped, blend: "over" }])
  .jpeg({ quality: 88 })
  .toBuffer();

const print = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 246, g: 246, b: 244 },
  },
})
  .composite([{ input: photo, left: PAD, top: PAD }])
  .jpeg({ quality: 86 })
  .toBuffer();

await sharp(print).toFile(join(dir, "id-backdrop.jpg"));
await sharp(print).toFile(join(dir, "id-portrait.jpg"));
process.stdout.write("wrote public/kirk/id-portrait.jpg (printed booth photo)\n");
