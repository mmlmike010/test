import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1400;
const H = 788;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// Instacart collection cards are the lifestyle photo plus the title overlay
// in the page — no floating packs, wood bars, or kitchen-plane composites.
async function lifestyleCard(url, outName, position = "attention") {
  const bytes = await download(url);
  await sharp(bytes)
    .rotate()
    .resize(W, H, { fit: "cover", position })
    .sharpen({ sigma: 0.6 })
    .modulate({ brightness: 1.03, saturation: 1.04 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await lifestyleCard(
  "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public/tomato-pasta/tomato-penne-plated.jpeg",
  "hero-weekly.jpg",
  "centre"
);

await lifestyleCard(
  "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public/cheeseboard/cheeseboard.jpeg",
  "hero-kirkland.jpg",
  "centre"
);

await lifestyleCard(
  "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public/smoothie-bowl/smoothie-bowl-aerial.jpg",
  "hero-new.jpg",
  "centre"
);

await lifestyleCard(
  "https://raw.githubusercontent.com/RajkumarGalaxy/tea-time/main/056.jpg",
  "hero-treasure.jpg",
  "centre"
);
