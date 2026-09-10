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

const marble = await download(
  "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/Seamless_Aegean_Marble_Texture.jpg"
);
const paper = await download(
  "https://raw.githubusercontent.com/prabhasp/ali-khasro/master/lokta/paper2.jpg"
);

const booth = await sharp(marble)
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 1.28, saturation: 0.18 })
  .toBuffer();

const grade = await sharp(
  svg(
    W,
    H,
    `<defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eef3f7" stop-opacity="0.42"/>
        <stop offset="0.4" stop-color="#c5d0da" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#5a6570" stop-opacity="0.34"/>
      </linearGradient>
      <radialGradient id="flash" cx="46%" cy="22%" r="70%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.06"/>
        <stop offset="1" stop-color="#2c343c" stop-opacity="0.18"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect width="${W}" height="${H}" fill="url(#flash)"/>`
  )
)
  .png()
  .toBuffer();

const badge = await sharp(
  svg(
    W,
    H,
    `<defs>
      <linearGradient id="disc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F04A5A"/>
        <stop offset="1" stop-color="#B01024"/>
      </linearGradient>
    </defs>
    <circle cx="210" cy="268" r="92" fill="url(#disc)"/>
    <circle cx="210" cy="268" r="92" fill="none" stroke="#8C1218" stroke-width="2"/>
    <text x="210" y="308" text-anchor="middle" fill="#ffffff" font-family="Georgia, Times New Roman, serif" font-size="118" font-style="italic" font-weight="600">K</text>`
  )
)
  .png()
  .toBuffer();

const badgeSoft = await sharp(badge).blur(0.55).png().toBuffer();

const grain = await sharp(paper)
  .resize(W, H, { fit: "cover" })
  .modulate({ brightness: 0.82, saturation: 0.18 })
  .toBuffer();
const grainLayer = await sharp(grain)
  .ensureAlpha()
  .composite([
    {
      input: await sharp({
        create: {
          width: W,
          height: H,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0.76 },
        },
      })
        .png()
        .toBuffer(),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();

const portrait = await sharp(booth)
  .composite([
    { input: grade, blend: "over" },
    { input: badgeSoft, blend: "over" },
    { input: grainLayer, blend: "overlay" },
  ])
  .jpeg({ quality: 90 })
  .toBuffer();

await sharp(portrait).toFile(join(dir, "id-backdrop.jpg"));
await sharp(portrait).toFile(join(dir, "id-portrait.jpg"));

process.stdout.write("wrote public/kirk/id-portrait.jpg\n");
