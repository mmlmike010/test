import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");

async function productThumb(id, size) {
  return sharp(join(dir, `${id}.png`))
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
}

async function composeCard(outName, ids) {
  const W = 1200;
  const H = 560;
  const size = 340;
  const y = Math.round((H - size) / 2 - 18);
  const gap = 28;
  const total = ids.length * size + (ids.length - 1) * gap;
  let x = Math.round((W - total) / 2);

  const layers = [];
  for (const id of ids) {
    layers.push({
      input: await productThumb(id, size),
      left: x,
      top: y,
    });
    x += size + gap;
  }

  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 247, g: 247, b: 247 },
    },
  })
    .composite(layers)
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeCard("hero-weekly.jpg", [3, 5, 8]);
await composeCard("hero-kirkland.jpg", [10, 11, 21]);
await composeCard("hero-new.jpg", [23, 1, 8]);
await composeCard("hero-treasure.jpg", [18, 17, 13]);
