import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");

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

async function blurField(id, brightness = 0.78) {
  const trimmed = await sharp(join(dir, `${id}.png`))
    .trim({ threshold: 16 })
    .toBuffer();
  return sharp(trimmed)
    .resize(1400, 640, { fit: "cover", position: "centre" })
    .blur(42)
    .modulate({ brightness, saturation: 0.72 })
    .toBuffer();
}

/** Overlapping packs on a darkened crop — closer to Instacart collection still-lifes. */
async function composeStillLife(outName, ids, layout, brightness) {
  const bg = await blurField(ids[0], brightness);
  const layers = [];
  for (const slot of layout) {
    const pack = await punchedPack(slot.id, slot.w, slot.h);
    layers.push({ input: pack, left: slot.x, top: slot.y });
  }
  await sharp(bg)
    .composite(layers)
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeStillLife("hero-weekly.jpg", [3, 4, 5], [
  { id: 4, w: 620, h: 580, x: -20, y: -10 },
  { id: 3, w: 560, h: 540, x: 420, y: 20 },
  { id: 5, w: 560, h: 520, x: 880, y: 10 },
]);

await composeStillLife("hero-kirkland.jpg", [11, 10, 2], [
  { id: 10, w: 420, h: 600, x: 10, y: -20 },
  { id: 11, w: 640, h: 600, x: 300, y: -8 },
  { id: 2, w: 580, h: 540, x: 860, y: 20 },
]);

await composeStillLife("hero-new.jpg", [23, 1, 8], [
  { id: 23, w: 680, h: 560, x: -40, y: 20 },
  { id: 1, w: 600, h: 580, x: 400, y: -16 },
  { id: 8, w: 520, h: 500, x: 920, y: 40 },
]);

await composeStillLife(
  "hero-treasure.jpg",
  [21, 18, 22],
  [
    { id: 18, w: 680, h: 560, x: -30, y: 8 },
    { id: 21, w: 600, h: 560, x: 430, y: 20 },
    { id: 22, w: 500, h: 440, x: 920, y: 80 },
  ],
  1.12
);
