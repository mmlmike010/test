import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1400;
const H = 640;
const MARBLE =
  "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/marble.jpg";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const marbleBytes = await download(MARBLE);

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

async function marbleCounter({ brightness, saturation }) {
  const surface = await sharp(marbleBytes)
    .resize(Math.round(W * 1.8), Math.round(H * 2.2), {
      fit: "cover",
      position: "centre",
    })
    .modulate({ brightness, saturation })
    .blur(2.2)
    .resize(W, H)
    .toBuffer();

  const light = svg(
    W,
    H,
    `
  <defs>
    <radialGradient id="window" cx="32%" cy="12%" r="82%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="0.45" stop-color="#fff7ee" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#8a7a68" stop-opacity="0.18"/>
    </radialGradient>
    <linearGradient id="depth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#5a4a3a" stop-opacity="0.16"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#window)"/>
  <rect width="${W}" height="${H}" fill="url(#depth)"/>
`
  );
  return sharp(surface)
    .composite([{ input: light, blend: "over" }])
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
      40,
      `<ellipse cx="${w / 2}" cy="20" rx="${w * 0.38}" ry="10" fill="#000" fill-opacity="0.22"/>`
    )
  )
    .blur(11)
    .png()
    .toBuffer();

  const padX = 22;
  const padY = 8;
  const composed = await sharp({
    create: {
      width: w + padX * 2,
      height: h + padY + 28,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: padX, top: h + padY - 4 },
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
  const bg = await marbleCounter(grade);
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
      <radialGradient id="photo" cx="50%" cy="38%" r="76%">
        <stop offset="0" stop-color="#fffaf3" stop-opacity="0"/>
        <stop offset="1" stop-color="#3a2c20" stop-opacity="0.1"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#photo)"/>
  `
  );

  await sharp(bg)
    .composite([...layers, { input: gradeWash, blend: "over" }])
    .modulate({ brightness: 1.03, saturation: 0.97 })
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeStillLife(
  "hero-weekly.jpg",
  { brightness: 1.06, saturation: 0.88 },
  [
    { id: 4, w: 400, h: 500, x: 438, y: 72 },
    { id: 3, w: 380, h: 480, x: 568, y: 84 },
    { id: 5, w: 380, h: 460, x: 738, y: 96 },
  ]
);

await composeStillLife(
  "hero-kirkland.jpg",
  { brightness: 1.02, saturation: 0.8 },
  [
    { id: 10, w: 260, h: 540, x: 438, y: 36 },
    { id: 11, w: 440, h: 520, x: 528, y: 52 },
    { id: 2, w: 380, h: 480, x: 758, y: 86 },
  ]
);

await composeStillLife(
  "hero-new.jpg",
  { brightness: 1.1, saturation: 0.72 },
  [
    { id: 23, w: 440, h: 460, x: 410, y: 96 },
    { id: 1, w: 400, h: 520, x: 548, y: 44 },
    { id: 8, w: 340, h: 440, x: 778, y: 108 },
  ]
);

await composeStillLife(
  "hero-treasure.jpg",
  { brightness: 1.0, saturation: 0.7 },
  [
    { id: 19, w: 280, h: 500, x: 428, y: 68 },
    { id: 21, w: 400, h: 500, x: 548, y: 62 },
    { id: 14, w: 360, h: 400, x: 778, y: 148 },
  ]
);
