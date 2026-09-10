import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

const CF = "https://d2lnr5mha7bycj.cloudfront.net/product-image/file";

/** Exact brand / item-type matches only — never a competing logo on a Kirkland SKU.
 *  Tiles 6 and 7 are composed in compose-remaining-tiles.mjs (full Kirkland
 *  labels over Costco Same-Day jar/tub photography).
 *  Tiles 13 and 22 are also composed there from pack photography (seat cover,
 *  black laptop sleeve) with source-brand marks covered. */
const tiles = {
  1: `${CF}/large_5bbadc9e-09c1-49aa-86ec-de31a36d08e5.jpeg`, // Kirkland organic granola
  2: `${CF}/large_6f376933-2b60-43ab-92ba-091277d87719.jpeg`, // Kirkland Heart Healthy Mixed Nuts 36 oz
  3: `${CF}/large_be581b7c-a021-4dcd-9460-10660cd7b6ec.png`, // Hunt's diced tomatoes
  4: `${CF}/large_d22ae167-8690-49ee-9681-ab73cdf2ded7.png`, // Mutti basil sauce
  5: `${CF}/large_a3b82731-4651-476a-a0c3-01c97a17c2c6.png`, // Sabra Classic Hummus
  8: `${CF}/large_1d261a52-dd8e-43be-bb72-139f7dd89094.png`, // Chobani Greek yogurt
  10: `${CF}/large_83cdd023-627e-4ee5-8d7e-6d23e8a79fba.jpeg`, // Kirkland organic EVOO 2L
  11: `${CF}/large_a21841e9-2cb1-46d8-8d2e-83912a9885b3.jpeg`, // Kirkland organic quinoa 4.5 lb
  12: `${CF}/large_adf25ab7-12db-4804-b050-bcb09de56385.jpeg`, // Kirkland trail mix 4 lb
  14: `${CF}/large_a2cd3f74-f69f-4f72-af14-0f653d8c7e6b.webp`, // Kirkland baby wipes
  15: `${CF}/large_2b963e60-c6a3-4037-8099-6130912fc4c9.jpeg`, // Kirkland bakery croissants 12ct
  16: `${CF}/large_c15562b6-ac05-4b15-8df9-594e7b216767.jpeg`, // Kirkland Alexander Valley Cabernet
  18: `${CF}/large_a4a5dbcb-d19b-42d0-b34e-eccccfedb1cd.jpeg`, // GoPro HERO11 bundle
  19: `${CF}/large_fc09f4a9-8ad0-4983-9451-bdbe70fcf0d9.jpeg`, // Kirkland Ultra Clean HE liquid detergent
  20: `${CF}/large_029a4c28-4763-49fe-b0ee-0e9d1f402fb1.jpeg`, // Kirkland merino crew socks
  21: `${CF}/large_2bacbaac-2b3d-4412-baad-d7bdb17b6080.jpeg`, // Kirkland Colombian 3 lb
  23: `${CF}/large_f2a0a010-0b6e-4d94-bd34-c39fa04626b2.jpeg`, // Kirkland organic eggs 24ct
  24: `${CF}/large_e5d1efe6-fead-4b09-a7ca-7c7e0b11ea6f.jpg`, // rotisserie clamshell
};

const categories = {
  "cat-treasure": 18,
  "cat-trending": 5,
  "cat-new": 23,
  "cat-weekly": 3,
  "cat-kirkland": 10,
  "cat-recipes": 4,
  "cat-catering": 24,
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
  await sharp(buf)
    .resize(320, 320, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86 })
    .toFile(outPath);
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
