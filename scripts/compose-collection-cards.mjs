import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");

/** Full pack on a blurred crop — Instacart collection tiles, not logo billboards. */
async function composeHero(outName, id, { blurBehind = true } = {}) {
  const trimmed = await sharp(join(dir, `${id}.png`))
    .trim({ threshold: 16 })
    .toBuffer();

  if (!blurBehind) {
    const padded = await sharp(trimmed)
      .extend({
        top: 36,
        bottom: 36,
        left: 48,
        right: 48,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toBuffer();
    await sharp(padded)
      .resize(1400, 640, { fit: "cover", position: "centre" })
      .jpeg({ quality: 88 })
      .toFile(join(dir, outName));
    process.stdout.write(`wrote ${outName}\n`);
    return;
  }

  const bg = await sharp(trimmed)
    .resize(1400, 640, { fit: "cover", position: "centre" })
    .blur(36)
    .modulate({ brightness: 1.06, saturation: 0.85 })
    .toBuffer();
  const fitted = await sharp(trimmed)
    .resize(1180, 560, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = fitted;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 246 && data[i + 1] > 246 && data[i + 2] > 246) data[i + 3] = 0;
  }
  const fg = await sharp(data, { raw: info }).png().toBuffer();
  await sharp(bg)
    .composite([{ input: fg, gravity: "centre" }])
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeHero("hero-weekly.jpg", 3);
await composeHero("hero-kirkland.jpg", 11);
await composeHero("hero-new.jpg", 23);
await composeHero("hero-treasure.jpg", 18, { blurBehind: false });
