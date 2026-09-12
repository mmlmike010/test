import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1200;
const H = 900;
const JH =
  "https://raw.githubusercontent.com/jhaydter/recipes/main/docs/assets/images";

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

const stillLifeOnly = process.argv.includes("--still-life-only");

if (!stillLifeOnly) {
  await plated(`${JH}/pasta-pomodoro.jpg`, "recipe-pasta.jpg");
  await plated(`${JH}/hummus.jpg`, "recipe-board.jpg");
  await plated(`${JH}/tomato-bruschetta.jpg`, "recipe-bruschetta.jpg", "south");
  await plated(`${JH}/deviled-eggs.jpg`, "recipe-deviled.jpg");
  await plated(`${JH}/dried-fruit-and-nut-mix.png`, "recipe-trail.jpg");

  {
    const bytes = await download(`${JH}/roasted-tomato-soup.png`);
    const meta = await sharp(bytes).metadata();
    const width = meta.width || 850;
    const height = meta.height || 500;
    const left = Math.round(width * 0.52);
    await sharp(bytes)
      .extract({
        left,
        top: 0,
        width: width - left,
        height,
      })
      .resize(W, H, { fit: "cover", position: "east" })
      .sharpen({ sigma: 0.55 })
      .modulate({ brightness: 1.02, saturation: 1.03 })
      .jpeg({ quality: 90 })
      .toFile(join(dir, "recipe-soup.jpg"));
    process.stdout.write("wrote recipe-soup.jpg\n");
  }
}

async function packShot(id, w, h) {
  return sharp(join(dir, `${id}.png`))
    .trim({ threshold: 18 })
    .resize(w, h, { fit: "inside" })
    .png()
    .toBuffer();
}

/** Official catalog packs only. Never leftover SKUs. */
async function stillLife(outName, items) {
  const layers = [];
  for (const item of items) {
    const buf = await packShot(item.id, item.w, item.h);
    const meta = await sharp(buf).metadata();
    const top =
      item.top ?? Math.round((H - (meta.height || item.h)) / 2);
    layers.push({ input: buf, left: item.left, top });
  }
  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 243, g: 244, b: 245 },
    },
  })
    .composite(layers)
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName} from official packs\n`);
}

await stillLife("recipe-quinoa.jpg", [
  { id: "11", w: 520, h: 680, left: 190 },
  { id: "10", w: 240, h: 460, left: 780, top: 150 },
  { id: "3", w: 300, h: 360, left: 800, top: H - 120 - 360 },
]);

await stillLife("recipe-eggs.jpg", [
  { id: "23", w: 620, h: 480, left: 80, top: 210 },
  { id: "10", w: 220, h: 420, left: 780, top: 130 },
  { id: "3", w: 280, h: 340, left: 820, top: H - 120 - 340 },
]);

await stillLife("recipe-yogurt.jpg", [
  { id: "8", w: 520, h: 640, left: 340 },
]);

await stillLife("recipe-board.jpg", [
  { id: "5", w: 560, h: 420, left: 80, top: 240 },
  { id: "2", w: 380, h: 400, left: 720, top: 70 },
  { id: "12", w: 400, h: 420, left: 700, top: 480 },
]);

await stillLife("recipe-bruschetta.jpg", [
  { id: "3", w: 420, h: 500, left: 160 },
  { id: "10", w: 280, h: 540, left: 740 },
]);
