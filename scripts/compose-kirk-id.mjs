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
  .modulate({ brightness: 0.72, saturation: 0.2 })
  .toBuffer();

const grade = await sharp(
  svg(
    W,
    H,
    `<defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d7e0e8" stop-opacity="0.28"/>
        <stop offset="0.38" stop-color="#8a97a4" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#3a4450" stop-opacity="0.42"/>
      </linearGradient>
      <radialGradient id="flash" cx="42%" cy="20%" r="68%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.04"/>
        <stop offset="1" stop-color="#1c242c" stop-opacity="0.28"/>
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
    <circle cx="210" cy="268" r="118" fill="url(#disc)"/>
    <circle cx="210" cy="268" r="118" fill="none" stroke="#7a1018" stroke-width="3"/>
    <text x="210" y="320" text-anchor="middle" fill="#ffffff" font-family="Georgia, Times New Roman, serif" font-size="148" font-style="italic" font-weight="600">K</text>
    <text x="210" y="528" text-anchor="middle" fill="#e8eef2" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="3.2">COSTCO · 09/19</text>`
  )
)
  .png()
  .toBuffer();

const badgeSoft = await sharp(badge).blur(0.45).png().toBuffer();

const grain = await sharp(paper)
  .resize(W, H, { fit: "cover" })
  .modulate({ brightness: 0.7, saturation: 0.16 })
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
          background: { r: 0, g: 0, b: 0, alpha: 0.7 },
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
