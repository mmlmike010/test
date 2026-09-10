import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "kirk");
mkdirSync(dir, { recursive: true });

const W = 1000;
const H = 630;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const paper = await download(
  "https://raw.githubusercontent.com/prabhasp/ali-khasro/master/lokta/paper2.jpg"
);

const texture = await sharp(paper)
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 1.18, saturation: 0.55 })
  .toBuffer();

const cream = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 243, g: 234, b: 208, alpha: 0.72 },
  },
})
  .png()
  .toBuffer();

const wash = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff6d8" stop-opacity="0.28"/>
      <stop offset="0.45" stop-color="#f3ead0" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#c9b27a" stop-opacity="0.22"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`)
)
  .png()
  .toBuffer();

await sharp(texture)
  .composite([
    { input: cream, blend: "over" },
    { input: wash, blend: "over" },
  ])
  .jpeg({ quality: 90 })
  .toFile(join(dir, "card-stock.jpg"));

process.stdout.write("wrote public/kirk/card-stock.jpg\n");
