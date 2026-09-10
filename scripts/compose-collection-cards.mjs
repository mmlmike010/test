import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1400;
const H = 788;
const MARBLE =
  "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/marble.jpg";
const WOOD =
  "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/WoodFine0010_M.jpg";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const marbleBytes = await download(MARBLE);
const woodBytes = await download(WOOD);

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
}

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

async function kitchenScene({ cabinetBright, counterBright, counterSat }) {
  // Heavy blur wipes the plank grain so this reads as room bokeh, not a wood bar.
  const cabinets = await sharp(woodBytes)
    .resize(W, Math.round(H * 1.6), { fit: "cover", position: "centre" })
    .modulate({ brightness: cabinetBright, saturation: 0.85 })
    .tint({ r: 168, g: 118, b: 72 })
    .blur(36)
    .extract({ left: 0, top: 120, width: W, height: H })
    .toBuffer();

  const counter = await sharp(marbleBytes)
    .resize(Math.round(W * 1.6), Math.round(H * 1.8), {
      fit: "cover",
      position: "centre",
    })
    .modulate({ brightness: counterBright, saturation: counterSat })
    .blur(1.6)
    .resize(W, H)
    .toBuffer();

  const counterMask = svg(
    W,
    H,
    `
  <defs>
    <linearGradient id="plane" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.34" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#plane)"/>
`
  );

  const counterLayer = await sharp(counter)
    .composite([{ input: counterMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const light = svg(
    W,
    H,
    `
  <defs>
    <radialGradient id="window" cx="22%" cy="8%" r="78%">
      <stop offset="0" stop-color="#fff8ee" stop-opacity="0.5"/>
      <stop offset="0.4" stop-color="#fff4e4" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#3a2c22" stop-opacity="0.22"/>
    </radialGradient>
    <linearGradient id="depth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1c10" stop-opacity="0.18"/>
      <stop offset="0.4" stop-color="#2a1c10" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#4a3a2c" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="ledge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.47" stop-color="#fff6e8" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#fff6e8" stop-opacity="0.35"/>
      <stop offset="0.52" stop-color="#fff6e8" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#window)"/>
  <rect width="${W}" height="${H}" fill="url(#depth)"/>
  <rect width="${W}" height="${H}" fill="url(#ledge)"/>
`
  );

  return sharp(cabinets)
    .composite([
      { input: counterLayer, blend: "over" },
      { input: light, blend: "over" },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

async function packOnCounter(pack) {
  const meta = await sharp(pack).metadata();
  const w = meta.width;
  const h = meta.height;
  const shadow = await sharp(
    svg(
      w,
      48,
      `<ellipse cx="${w / 2}" cy="24" rx="${w * 0.4}" ry="11" fill="#000" fill-opacity="0.28"/>`
    )
  )
    .blur(14)
    .png()
    .toBuffer();

  const padX = 24;
  const padY = 8;
  const composed = await sharp({
    create: {
      width: w + padX * 2,
      height: h + padY + 32,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: padX, top: h + padY - 6 },
      { input: pack, left: padX, top: padY },
    ])
    .png()
    .toBuffer();
  return { buf: composed, padX, padY };
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
  const bg = await kitchenScene(grade);
  const layers = [];

  for (const slot of layout) {
    const pack = await punchedPack(slot.id, slot.w, slot.h);
    const { buf, padX, padY } = await packOnCounter(pack);
    const layer = await clipToCanvas(buf, slot.x - padX, slot.y - padY);
    if (layer) layers.push(layer);
  }

  const gradeWash = svg(
    W,
    H,
    `
    <defs>
      <radialGradient id="photo" cx="50%" cy="42%" r="74%">
        <stop offset="0" stop-color="#fffaf3" stop-opacity="0"/>
        <stop offset="1" stop-color="#2a1e14" stop-opacity="0.16"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#photo)"/>
  `
  );

  await sharp(bg)
    .composite([...layers, { input: gradeWash, blend: "over" }])
    .modulate({ brightness: 1.02, saturation: 0.96 })
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

// Packs sit on the counter plane (lower half) so the upper bokeh reads as a kitchen.
await composeStillLife(
  "hero-weekly.jpg",
  { cabinetBright: 0.7, counterBright: 1.08, counterSat: 0.86 },
  [
    { id: 4, w: 380, h: 540, x: 268, y: 188 },
    { id: 3, w: 370, h: 520, x: 508, y: 204 },
    { id: 5, w: 350, h: 490, x: 778, y: 228 },
  ]
);

await composeStillLife(
  "hero-kirkland.jpg",
  { cabinetBright: 0.64, counterBright: 1.04, counterSat: 0.78 },
  [
    { id: 10, w: 240, h: 580, x: 288, y: 148 },
    { id: 11, w: 410, h: 560, x: 458, y: 164 },
    { id: 2, w: 360, h: 500, x: 800, y: 218 },
  ]
);

await composeStillLife(
  "hero-new.jpg",
  { cabinetBright: 0.74, counterBright: 1.12, counterSat: 0.7 },
  [
    { id: 23, w: 410, h: 480, x: 238, y: 248 },
    { id: 1, w: 380, h: 560, x: 498, y: 168 },
    { id: 8, w: 330, h: 460, x: 820, y: 258 },
  ]
);

await composeStillLife(
  "hero-treasure.jpg",
  { cabinetBright: 0.6, counterBright: 1.02, counterSat: 0.68 },
  [
    { id: 19, w: 260, h: 560, x: 268, y: 168 },
    { id: 21, w: 400, h: 540, x: 478, y: 178 },
    { id: 14, w: 350, h: 440, x: 810, y: 288 },
  ]
);
