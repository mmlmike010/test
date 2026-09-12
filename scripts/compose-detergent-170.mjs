import { renameSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const srcPath = join(process.cwd(), "public", "products", "19.png");
const cover = { left: 500, top: 318, width: 128, height: 86 };
const sample = { left: 500, top: 252, width: 128, height: 54 };

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
}

const orange = await sharp(srcPath)
  .extract(sample)
  .resize(cover.width, cover.height, { fit: "cover", position: "south" })
  .png()
  .toBuffer();

const feather = await sharp(
  svg(
    cover.width,
    cover.height,
    `<rect x="2" y="2" width="${cover.width - 4}" height="${cover.height - 4}" rx="10" fill="#fff"/>`
  )
)
  .blur(3)
  .png()
  .toBuffer();

const patch = await sharp(orange)
  .composite([{ input: feather, blend: "dest-in" }])
  .png()
  .toBuffer();

const type = await sharp(
  svg(
    cover.width,
    cover.height,
    `
  <text x="58" y="38" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800">170</text>
  <text x="58" y="64" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" letter-spacing="0.7">LOADS*</text>
`
  )
)
  .png()
  .toBuffer();

const tmp = srcPath + ".tmp.png";
await sharp(srcPath)
  .composite([
    { input: patch, left: cover.left, top: cover.top },
    { input: type, left: cover.left, top: cover.top },
  ])
  .png({ compressionLevel: 8 })
  .toFile(tmp);
renameSync(tmp, srcPath);
console.log("reprinted 170 LOADS on Kirkland Ultra Clean");
