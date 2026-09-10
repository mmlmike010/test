import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const pairs = [
  ["13.png", "cat-auto.jpg"],
  ["17.png", "cat-books.jpg"],
  ["18.png", "cat-cameras.jpg"],
  ["20.png", "cat-clothing.jpg"],
  ["22.png", "cat-computers.jpg"],
];

for (const [src, dest] of pairs) {
  const trimmed = await sharp(join(dir, src)).trim({ threshold: 16 }).toBuffer();
  const fitted = await sharp(trimmed)
    .resize(280, 280, { fit: "inside", withoutEnlargement: true })
    .toBuffer();
  await sharp({
    create: {
      width: 320,
      height: 320,
      channels: 3,
      background: { r: 243, g: 243, b: 243 },
    },
  })
    .composite([{ input: fitted, gravity: "centre" }])
    .jpeg({ quality: 86 })
    .toFile(join(dir, dest));
  process.stdout.write(`wrote ${dest}\n`);
}
