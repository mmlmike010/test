import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "kirk");
mkdirSync(dir, { recursive: true });

const W = 420;
const H = 560;
const PAD = 22;

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

// Warehouse booth print: fiber, fluorescent cyc, flash. No face.
const grain = await sharp(paper)
  .resize(innerW, innerH, { fit: "cover", position: "centre" })
  .modulate({ brightness: 1.12, saturation: 0.35 })
  .sharpen(1.2)
  .toBuffer();

const boothGrey = await sharp(grain)
  .greyscale()
  .modulate({ brightness: 0.92 })
  .toBuffer();

const wash = await sharp({
  create: {
    width: innerW,
    height: innerH,
    channels: 3,
    background: { r: 168, g: 178, b: 186 },
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
        <stop offset="0" stop-color="#e4ebf0" stop-opacity="0.2"/>
        <stop offset="0.55" stop-color="#9aa6b0" stop-opacity="0.08"/>
        <stop offset="0.74" stop-color="#6d7880" stop-opacity="0.34"/>
        <stop offset="1" stop-color="#3f474d" stop-opacity="0.58"/>
      </linearGradient>
      <radialGradient id="flash" cx="32%" cy="14%" r="68%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>
        <stop offset="0.36" stop-color="#ffffff" stop-opacity="0.1"/>
        <stop offset="1" stop-color="#2a3238" stop-opacity="0.32"/>
      </radialGradient>
    </defs>
    <rect width="${innerW}" height="${innerH}" fill="url(#cyc)"/>
    <rect width="${innerW}" height="${innerH}" fill="url(#flash)"/>
    <ellipse cx="${innerW / 2}" cy="${innerH - 28}" rx="${innerW * 0.3}" ry="11" fill="#1a1a1a" fill-opacity="0.16"/>`
  )
)
  .png()
  .toBuffer();

const lit = await sharp(boothGrey)
  .composite([
    { input: wash, blend: "multiply" },
    { input: grain, blend: "soft-light" },
    { input: floor, blend: "over" },
  ])
  .modulate({ brightness: 1.05 })
  .toBuffer();

const stamp = await sharp(
  svg(
    innerW,
    innerH,
    `<text x="${innerW / 2}" y="${Math.round(innerH * 0.56)}" text-anchor="middle" fill="#C41230" font-family="Georgia, Times New Roman, serif" font-size="228" font-style="italic" font-weight="600">K</text>
    <text x="${innerW / 2}" y="${innerH - 18}" text-anchor="middle" fill="#f4f6f8" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="800" letter-spacing="2.6">COSTCO · 09/19</text>`
  )
)
  .png()
  .toBuffer();

const stamped = await sharp(stamp).blur(0.35).png().toBuffer();

const photo = await sharp(lit)
  .composite([{ input: stamped, blend: "over" }])
  .sharpen(0.7)
  .jpeg({ quality: 90 })
  .toBuffer();

const print = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 248, g: 246, b: 240 },
  },
})
  .composite([{ input: photo, left: PAD, top: PAD }])
  .jpeg({ quality: 88 })
  .toBuffer();

await sharp(print).toFile(join(dir, "id-backdrop.jpg"));
await sharp(print).toFile(join(dir, "id-portrait.jpg"));
process.stdout.write("wrote public/kirk/id-portrait.jpg (printed booth photo)\n");
