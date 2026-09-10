import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "kirk");
mkdirSync(dir, { recursive: true });

const W = 420;
const H = 560;

const res = await fetch(
  "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/Seamless_Aegean_Marble_Texture.jpg"
);
if (!res.ok) throw new Error(`${res.status} marble`);
const marble = Buffer.from(await res.arrayBuffer());

const texture = await sharp(marble)
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.62, saturation: 0.18 })
  .toBuffer();

const grade = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 96, g: 112, b: 128, alpha: 0.55 },
  },
})
  .png()
  .toBuffer();

const lighting = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="0.38" stop-color="#c5d0da" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#3a4450" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`)
)
  .png()
  .toBuffer();

await sharp(texture)
  .composite([
    { input: grade, blend: "over" },
    { input: lighting, blend: "over" },
  ])
  .jpeg({ quality: 90 })
  .toFile(join(dir, "id-backdrop.jpg"));

process.stdout.write("wrote public/kirk/id-backdrop.jpg\n");
