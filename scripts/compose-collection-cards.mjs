import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1400;
const H = 640;
const WOOD =
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/hardwood2_diffuse.jpg";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const woodBytes = await download(WOOD);

async function punchedPack(id, maxW, maxH) {
  const trimmed = await sharp(join(dir, `${id}.png`))
    .trim({ threshold: 16 })
    .ensureAlpha()
    .resize(maxW, maxH, { fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = trimmed;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 246 && data[i + 1] > 246 && data[i + 2] > 246) data[i + 3] = 0;
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

async function packWithShadow(pack) {
  const { data, info } = await sharp(pack)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const shadowRaw = Buffer.from(data);
  for (let i = 0; i < shadowRaw.length; i += 4) {
    shadowRaw[i] = 22;
    shadowRaw[i + 1] = 14;
    shadowRaw[i + 2] = 8;
    shadowRaw[i + 3] = Math.round(shadowRaw[i + 3] * 0.58);
  }
  const pad = 64;
  const shadow = await sharp(shadowRaw, { raw: info }).blur(28).png().toBuffer();
  const composed = await sharp({
    create: {
      width: info.width + pad * 2,
      height: info.height + pad * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: pad + 10, top: pad + 28 },
      { input: pack, left: pad, top: pad },
    ])
    .png()
    .toBuffer();
  return { buf: composed, pad };
}

async function tableTop({ brightness, saturation }) {
  const surface = await sharp(woodBytes)
    .resize(Math.round(W * 2.1), Math.round(H * 2.1), {
      fit: "cover",
      position: "centre",
    })
    .modulate({ brightness, saturation })
    .blur(16)
    .resize(W, H)
    .jpeg({ quality: 92 })
    .toBuffer();
  const wash = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="vignette" cx="50%" cy="40%" r="74%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.34"/>
    </radialGradient>
    <linearGradient id="counter" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.1"/>
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.28"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="${H}" fill="url(#counter)"/>
</svg>`);
  return sharp(surface)
    .composite([{ input: wash, blend: "over" }])
    .jpeg({ quality: 90 })
    .toBuffer();
}

async function clipToCanvas(buf, left, top) {
  const meta = await sharp(buf).metadata();
  let extractLeft = 0;
  let extractTop = 0;
  let width = meta.width;
  let height = meta.height;
  let placeX = left;
  let placeY = top;
  if (placeX < 0) {
    extractLeft = -placeX;
    width -= extractLeft;
    placeX = 0;
  }
  if (placeY < 0) {
    extractTop = -placeY;
    height -= extractTop;
    placeY = 0;
  }
  if (placeX + width > W) width = W - placeX;
  if (placeY + height > H) height = H - placeY;
  if (width <= 0 || height <= 0) return null;
  const input = await sharp(buf)
    .extract({ left: extractLeft, top: extractTop, width, height })
    .png()
    .toBuffer();
  return { input, left: placeX, top: placeY };
}

async function composeStillLife(outName, grade, layout) {
  const bg = await tableTop(grade);
  const layers = [];
  for (const slot of layout) {
    const pack = await punchedPack(slot.id, slot.w, slot.h);
    const { buf, pad } = await packWithShadow(pack);
    const layer = await clipToCanvas(buf, slot.x - pad, slot.y - pad);
    if (layer) layers.push(layer);
  }
  await sharp(bg)
    .composite(layers)
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeStillLife(
  "hero-weekly.jpg",
  { brightness: 0.94, saturation: 1.06 },
  [
    { id: 4, w: 420, h: 520, x: 430, y: 56 },
    { id: 3, w: 400, h: 500, x: 560, y: 68 },
    { id: 5, w: 400, h: 480, x: 740, y: 78 },
  ]
);

await composeStillLife(
  "hero-kirkland.jpg",
  { brightness: 0.9, saturation: 0.92 },
  [
    { id: 10, w: 280, h: 560, x: 430, y: 24 },
    { id: 11, w: 460, h: 540, x: 520, y: 40 },
    { id: 2, w: 400, h: 500, x: 760, y: 70 },
  ]
);

await composeStillLife(
  "hero-new.jpg",
  { brightness: 1.08, saturation: 0.88 },
  [
    { id: 23, w: 460, h: 480, x: 400, y: 78 },
    { id: 1, w: 420, h: 540, x: 540, y: 32 },
    { id: 8, w: 360, h: 460, x: 780, y: 88 },
  ]
);

await composeStillLife(
  "hero-treasure.jpg",
  { brightness: 0.92, saturation: 0.84 },
  [
    { id: 18, w: 460, h: 500, x: 400, y: 58 },
    { id: 21, w: 400, h: 520, x: 560, y: 48 },
    { id: 22, w: 360, h: 400, x: 790, y: 120 },
  ]
);
