import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");

/** Instacart collection tiles: fill with product artwork, not white studio padding. */
async function composeHero(outName, id, position = "attention") {
  const trimmed = await sharp(join(dir, `${id}.png`))
    .trim({ threshold: 16 })
    .toBuffer();
  await sharp(trimmed)
    .resize(1400, 640, { fit: "cover", position })
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeHero("hero-weekly.jpg", 3, "centre");
await composeHero("hero-kirkland.jpg", 11, "centre");
await composeHero("hero-new.jpg", 23, "centre");
await composeHero("hero-treasure.jpg", 18, "centre");
