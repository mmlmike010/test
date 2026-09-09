import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

const CF = "https://d2lnr5mha7bycj.cloudfront.net/product-image/file";

/** Exact brand / item-type matches only — never a competing logo on a Kirkland SKU. */
const tiles = {
  3: `${CF}/large_be581b7c-a021-4dcd-9460-10660cd7b6ec.png`, // Hunt's diced tomatoes
  4: `${CF}/large_d22ae167-8690-49ee-9681-ab73cdf2ded7.png`, // Mutti basil sauce
  5: `${CF}/large_a3b82731-4651-476a-a0c3-01c97a17c2c6.png`, // Sabra Classic Hummus
  8: `${CF}/large_1d261a52-dd8e-43be-bb72-139f7dd89094.png`, // Chobani Greek yogurt
  24: `${CF}/large_ab44a7b9-e618-4b32-8b59-04bf8b95d908.jpg`, // rotisserie chicken
};

const categories = {
  "cat-treasure": 24,
  "cat-trending": 5,
  "cat-new": 8,
  "cat-weekly": 3,
  "cat-recipes": 4,
  "cat-catering": 5,
};

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function toTile(buf, outPath) {
  const fitted = await sharp(buf)
    .resize(760, 760, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 8 })
    .toFile(outPath);
}

async function toCategoryDisc(buf, outPath) {
  const square = await sharp(buf)
    .resize(320, 320, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86 })
    .toFile(outPath);
  return square;
}

const buffers = {};
for (const [id, url] of Object.entries(tiles)) {
  process.stdout.write(`tile ${id}… `);
  const buf = await download(url);
  buffers[id] = buf;
  await toTile(buf, join(dir, `${id}.png`));
  console.log("ok", buf.length);
}

for (const [name, id] of Object.entries(categories)) {
  await toCategoryDisc(buffers[id], join(dir, `${name}.jpg`));
  console.log("category", name);
}

const kirkSrc = join(dir, "10.png");
await sharp(kirkSrc)
  .resize(320, 320, { fit: "cover", position: "centre" })
  .jpeg({ quality: 86 })
  .toFile(join(dir, "cat-kirkland.jpg"));
console.log("category cat-kirkland");
