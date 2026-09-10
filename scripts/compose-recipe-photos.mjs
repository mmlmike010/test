import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1200;
const H = 900;
const GH =
  "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function plated(url, outName, position = "centre") {
  const bytes = await download(url);
  await sharp(bytes)
    .rotate()
    .resize(W, H, { fit: "cover", position })
    .sharpen({ sigma: 0.55 })
    .modulate({ brightness: 1.02, saturation: 1.03 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await plated(`${GH}/smoothie-bowl/smoothie-bowl-aerial.jpg`, "recipe-yogurt.jpg");
await plated(`${GH}/tomato_fritatta_aerial.jpg`, "recipe-eggs.jpg", "south");
await plated(`${GH}/fried_rice.jpeg`, "recipe-quinoa.jpg");
await plated(`${GH}/tomato-pasta/tomato-penne-plated.jpeg`, "recipe-pasta.jpg");
await plated(`${GH}/cheeseboard/cheeseboard.jpeg`, "recipe-board.jpg");
