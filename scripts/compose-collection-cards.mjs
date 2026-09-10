import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");

/** Instacart-style collection tiles: one cinematic pack-shot fill, not a sparse 3-up row. */
async function composeHero(outName, id) {
  await sharp(join(dir, `${id}.png`))
    .resize(1200, 560, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await composeHero("hero-weekly.jpg", 3);
await composeHero("hero-kirkland.jpg", 11);
await composeHero("hero-new.jpg", 23);
await composeHero("hero-treasure.jpg", 18);
