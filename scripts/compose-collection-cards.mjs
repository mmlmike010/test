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

async function creamTable() {
  const surface = await sharp(woodBytes)
    .resize(Math.round(W * 2.4), Math.round(H * 2.6), {
      fit: "cover",
      position: "centre",
    })
    .modulate({ brightness: 1.46, saturation: 0.38 })
    .blur(13)
    .resize(W, H)
    .toBuffer();

  const light = svg(
    W,
    H,
    `
  <defs>
    <radialGradient id="window" cx="36%" cy="16%" r="80%">
      <stop offset="0" stop-color="#fff8ee" stop-opacity="0.58"/>
      <stop offset="0.42" stop-color="#fff3e4" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#b7a48a" stop-opacity="0.3"/>
    </radialGradient>
    <linearGradient id="depth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.24"/>
      <stop offset="0.52" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#6a5438" stop-opacity="0.2"/>
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

async function servingBoard({ brightness, saturation }) {
  const bw = 780;
  const bh = 430;
  const rx = 28;
  const grain = await sharp(woodBytes)
    .resize(bw * 2, bh * 2, { fit: "cover", position: "centre" })
    .modulate({ brightness, saturation })
    .blur(1.5)
    .resize(bw, bh)
    .png()
    .toBuffer();

  const mask = svg(
    bw,
    bh,
    `<rect width="${bw}" height="${bh}" rx="${rx}" ry="${rx}" fill="#fff"/>`
  );
  const board = await sharp(grain)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const rim = svg(
    bw,
    bh,
    `
    <rect x="1" y="1" width="${bw - 2}" height="${bh - 2}" rx="${rx}" ry="${rx}" fill="none" stroke="#000" stroke-opacity="0.2" stroke-width="2"/>
    <rect x="12" y="9" width="${bw - 24}" height="${Math.round(bh * 0.16)}" rx="12" fill="#fff" fill-opacity="0.1"/>
  `
  );

  const shadow = await sharp(
    svg(
      bw,
      52,
      `<ellipse cx="${bw / 2}" cy="26" rx="${bw * 0.46}" ry="15" fill="#000" fill-opacity="0.26"/>`
    )
  )
    .blur(18)
    .png()
    .toBuffer();

  const shadowed = await sharp({
    create: {
      width: bw + 80,
      height: bh + 72,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: 40, top: bh + 10 },
      { input: board, left: 40, top: 12 },
      { input: rim, left: 40, top: 12 },
    ])
    .png()
    .toBuffer();

  return { buf: shadowed, w: bw + 80, h: bh + 72 };
}

async function packOnBoard(pack) {
  const meta = await sharp(pack).metadata();
  const w = meta.width;
  const h = meta.height;
  const shadow = await sharp(
    svg(
      w,
      36,
      `<ellipse cx="${w / 2}" cy="18" rx="${w * 0.36}" ry="9" fill="#000" fill-opacity="0.3"/>`
    )
  )
    .blur(9)
    .png()
    .toBuffer();

  const padX = 20;
  const padY = 10;
  const composed = await sharp({
    create: {
      width: w + padX * 2,
      height: h + padY + 26,
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

async function composeStillLife(outName, boardGrade, layout) {
  const bg = await creamTable();
  const board = await servingBoard(boardGrade);
  const layers = [];
  const boardX = Math.round((W - board.w) / 2);
  const boardLayer = await clipToCanvas(board.buf, boardX, 148);
  if (boardLayer) layers.push(boardLayer);

  for (const slot of layout) {
    const pack = await punchedPack(slot.id, slot.w, slot.h);
    const { buf, padX, padY } = await packOnBoard(pack);
    const layer = await clipToCanvas(buf, slot.x - padX, slot.y - padY);
    if (layer) layers.push(layer);
  }

  const grade = svg(
    W,
    H,
    `
    <defs>
      <radialGradient id="photo" cx="50%" cy="40%" r="74%">
        <stop offset="0" stop-color="#fff6ea" stop-opacity="0"/>
        <stop offset="1" stop-color="#3d2a16" stop-opacity="0.14"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#photo)"/>
  `
  );

  await sharp(bg)
    .composite([...layers, { input: grade, blend: "over" }])
    .modulate({ brightness: 1.05, saturation: 0.95 })
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeStillLife(
  "hero-weekly.jpg",
  { brightness: 0.9, saturation: 0.86 },
  [
    { id: 4, w: 400, h: 500, x: 438, y: 72 },
    { id: 3, w: 380, h: 480, x: 568, y: 84 },
    { id: 5, w: 380, h: 460, x: 738, y: 96 },
  ]
);

await composeStillLife(
  "hero-kirkland.jpg",
  { brightness: 0.86, saturation: 0.78 },
  [
    { id: 10, w: 260, h: 540, x: 438, y: 36 },
    { id: 11, w: 440, h: 520, x: 528, y: 52 },
    { id: 2, w: 380, h: 480, x: 758, y: 86 },
  ]
);

await composeStillLife(
  "hero-new.jpg",
  { brightness: 1.02, saturation: 0.7 },
  [
    { id: 23, w: 440, h: 460, x: 410, y: 96 },
    { id: 1, w: 400, h: 520, x: 548, y: 44 },
    { id: 8, w: 340, h: 440, x: 778, y: 108 },
  ]
);

await composeStillLife(
  "hero-treasure.jpg",
  { brightness: 0.94, saturation: 0.68 },
  [
    { id: 18, w: 440, h: 480, x: 410, y: 72 },
    { id: 21, w: 380, h: 500, x: 568, y: 58 },
    { id: 22, w: 340, h: 380, x: 788, y: 132 },
  ]
);
