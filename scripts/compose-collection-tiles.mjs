import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const TW = 1280;
const TH = 720;

/** 16:9 homepage tiles from the 1600×520 landing banners. Pack stays on the right. */
async function tileFromBanner(srcName, outName, shift = 0) {
  const src = join(dir, srcName);
  const scaled = await sharp(src)
    .resize({ height: TH, fit: "inside" })
    .toBuffer();
  const meta = await sharp(scaled).metadata();
  const sw = meta.width || TW;
  const left = Math.max(0, Math.min(sw - TW, sw - TW - 40 + shift));
  await sharp(scaled)
    .extract({ left, top: 0, width: Math.min(TW, sw), height: TH })
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName} from ${srcName} @ x=${left}\n`);
}

await tileFromBanner("hero-weekly.jpg", "hero-weekly-tile.jpg", 20);
await tileFromBanner("hero-kirkland.jpg", "hero-kirkland-tile.jpg", 0);
await tileFromBanner("hero-new.jpg", "hero-new-tile.jpg", 10);
await tileFromBanner("hero-treasure.jpg", "hero-treasure-tile.jpg", -10);
