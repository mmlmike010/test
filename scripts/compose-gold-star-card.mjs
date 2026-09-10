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
  .modulate({ brightness: 1.08, saturation: 0.7 })
  .toBuffer();

const cream = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 236, g: 220, b: 176, alpha: 0.62 },
  },
})
  .png()
  .toBuffer();

const wash = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff3c4" stop-opacity="0.34"/>
      <stop offset="0.42" stop-color="#e8d29a" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#b8953a" stop-opacity="0.28"/>
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
