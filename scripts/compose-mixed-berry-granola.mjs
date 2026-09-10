import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

const CF =
  "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_5bbadc9e-09c1-49aa-86ec-de31a36d08e5.jpeg";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
}

const src = await download(CF);
const meta = await sharp(src).metadata();
const W = meta.width;
const H = meta.height;

// Die-cut only — never keep Ancient Grains / Nature's Path RGB.
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({
  resolveWithObject: true,
});
// Flood studio white from the corners so the pouch's cream face stays inside the die-cut.
const bg = Buffer.alloc(W * H);
const stack = [0, W - 1, (H - 1) * W, H * W - 1];
const isStudio = (i) => {
  const r = data[i * 3];
  const g = data[i * 3 + 1];
  const b = data[i * 3 + 2];
  return r >= 248 && g >= 248 && b >= 248;
};
while (stack.length) {
  const i = stack.pop();
  if (i < 0 || i >= W * H || bg[i] || !isStudio(i)) continue;
  bg[i] = 1;
  const x = i % W;
  const y = (i - x) / W;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (y > 0) stack.push(i - W);
  if (y < H - 1) stack.push(i + W);
}
const alpha = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) alpha[i] = bg[i] ? 0 : 255;
const maskRgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  maskRgba[i * 4] = 255;
  maskRgba[i * 4 + 1] = 255;
  maskRgba[i * 4 + 2] = 255;
  maskRgba[i * 4 + 3] = alpha[i];
}
const pouchMask = await sharp(maskRgba, {
  raw: { width: W, height: H, channels: 4 },
})
  .png()
  .toBuffer();

// Tight bowl only — raspberries in granola.
const bowl = await sharp(src)
  .extract({ left: 170, top: 104, width: 160, height: 104 })
  .resize(196, 196, { fit: "cover", position: "centre" })
  .modulate({ brightness: 1.03, saturation: 1.12 })
  .png()
  .toBuffer();
const circleMask = await sharp(
  svg(196, 196, `<circle cx="98" cy="98" r="98" fill="#fff"/>`)
)
  .png()
  .toBuffer();
const bowlRound = await sharp(bowl)
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const face = await sharp(
  svg(
    W,
    H,
    `
  <rect x="113" y="39" width="381" height="248" fill="#CFA05A"/>
  <rect x="113" y="287" width="381" height="287" fill="#F6F1E6"/>
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3a2410" stop-opacity="0.14"/>
      <stop offset="0.22" stop-color="#fff8ee" stop-opacity="0.2"/>
      <stop offset="0.55" stop-color="#fff8ee" stop-opacity="0"/>
      <stop offset="1" stop-color="#3a2410" stop-opacity="0.16"/>
    </linearGradient>
  </defs>
  <rect x="113" y="39" width="381" height="535" fill="url(#sheen)"/>
  <rect x="150" y="48" width="308" height="16" rx="3" fill="#b89a68"/>
  <rect x="162" y="52" width="284" height="7" rx="2" fill="#8e7a52"/>
`
  )
)
  .png()
  .toBuffer();

const print = await sharp(
  svg(
    W,
    H,
    `
  <rect x="168" y="308" width="264" height="48" rx="3" fill="#1a1a1a"/>
  <text x="300" y="341" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" letter-spacing="1.6">KIRKLAND</text>
  <text x="300" y="380" text-anchor="middle" fill="#3d3226" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" letter-spacing="3.2">SIGNATURE</text>
  <text x="300" y="424" text-anchor="middle" fill="#7A1F3D" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800">MIXED BERRY</text>
  <text x="300" y="456" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="1.4">ORGANIC GRANOLA</text>
  <text x="300" y="486" text-anchor="middle" fill="#555555" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700">RASPBERRY · BLUEBERRY · STRAWBERRY</text>
  <text x="300" y="530" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800">3.5 LB</text>
  <text x="300" y="552" text-anchor="middle" fill="#666666" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700">NET WT 56 OZ (1.59 kg)</text>
`
  )
)
  .png()
  .toBuffer();

const ring = await sharp(
  svg(208, 208, `<circle cx="104" cy="104" r="102" fill="none" stroke="#6a4a28" stroke-width="5"/>`)
)
  .png()
  .toBuffer();

const labeled = await sharp(face)
  .composite([
    { input: print, left: 0, top: 0 },
    { input: ring, left: 196, top: 72 },
    { input: bowlRound, left: 202, top: 78 },
  ])
  .png()
  .toBuffer();

const pouch = await sharp(labeled)
  .composite([{ input: pouchMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const shadow = await sharp(
  svg(
    800,
    80,
    `<ellipse cx="400" cy="40" rx="118" ry="12" fill="#000" fill-opacity="0.14"/>`
  )
)
  .blur(10)
  .png()
  .toBuffer();

const fitted = await sharp(pouch)
  .resize(720, 720, { fit: "inside" })
  .png()
  .toBuffer();
const fitMeta = await sharp(fitted).metadata();
const left = Math.round((800 - fitMeta.width) / 2);
const top = Math.round((800 - fitMeta.height) / 2) - 8;

await sharp({
  create: {
    width: 800,
    height: 800,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    { input: shadow, left: 0, top: top + fitMeta.height - 36 },
    { input: fitted, left, top },
  ])
  .png({ compressionLevel: 8 })
  .toFile(join(dir, "1.png"));

console.log("wrote public/products/1.png", { W, H, info: info.width });
