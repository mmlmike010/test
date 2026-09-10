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

const pw = 420;
const ph = 700;

// Tight bowl only — raspberries in granola. No Kirkland / Nature's Path / Ancient Grains type.
const bowl = await sharp(src)
  .extract({ left: 170, top: 104, width: 160, height: 104 })
  .resize(228, 228, { fit: "cover", position: "centre" })
  .modulate({ brightness: 1.03, saturation: 1.12 })
  .png()
  .toBuffer();

const circleMask = await sharp(
  svg(228, 228, `<circle cx="114" cy="114" r="114" fill="#fff"/>`)
)
  .png()
  .toBuffer();
const bowlRound = await sharp(bowl)
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

const face = await sharp(
  svg(
    pw,
    ph,
    `
  <rect width="${pw}" height="318" fill="#CFA05A"/>
  <rect y="318" width="${pw}" height="${ph - 318}" fill="#F6F1E6"/>
`
  )
)
  .removeAlpha()
  .toBuffer();

const pouchD = `M54,38
  L366,38
  L366,668
  C366,682 354,690 338,690
  L82,690
  C66,690 54,682 54,668
  Z`;

const bagMask = await sharp(svg(pw, ph, `<path fill="#fff" d="${pouchD}"/>`))
  .png()
  .toBuffer();

const lighting = svg(
  pw,
  ph,
  `
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3a2410" stop-opacity="0.1"/>
      <stop offset="0.22" stop-color="#fff8ee" stop-opacity="0.2"/>
      <stop offset="0.55" stop-color="#fff8ee" stop-opacity="0"/>
      <stop offset="1" stop-color="#3a2410" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <rect width="${pw}" height="${ph}" fill="url(#sheen)"/>
  <rect x="54" y="38" width="312" height="22" fill="#c9b089"/>
  <rect x="64" y="44" width="292" height="8" rx="3" fill="#9a8864"/>
  <path d="M70,676 L350,676" fill="none" stroke="#2a1a0c" stroke-opacity="0.1" stroke-width="2"/>
`
);

const body = await sharp(face)
  .composite([{ input: lighting, blend: "over" }])
  .removeAlpha()
  .toBuffer();
const bagAlpha = await sharp(bagMask).extractChannel("alpha").toBuffer();
const film = await sharp(body).joinChannel(bagAlpha).png().toBuffer();

const print = await sharp(
  svg(
    pw,
    ph,
    `
  <rect x="78" y="340" width="264" height="52" rx="3" fill="#1a1a1a"/>
  <text x="210" y="375" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" letter-spacing="1.8">KIRKLAND</text>
  <text x="210" y="418" text-anchor="middle" fill="#3d3226" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" letter-spacing="3.6">SIGNATURE</text>
  <text x="210" y="468" text-anchor="middle" fill="#7A1F3D" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800">MIXED BERRY</text>
  <text x="210" y="504" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" letter-spacing="1.5">ORGANIC GRANOLA</text>
  <text x="210" y="540" text-anchor="middle" fill="#555555" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">RASPBERRY · BLUEBERRY · STRAWBERRY</text>
  <text x="210" y="600" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800">3.5 LB</text>
  <text x="210" y="628" text-anchor="middle" fill="#666666" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">NET WT 56 OZ (1.59 kg)</text>
`
  )
)
  .png()
  .toBuffer();

const ring = await sharp(
  svg(
    240,
    240,
    `<circle cx="120" cy="120" r="118" fill="none" stroke="#6a4a28" stroke-width="5"/>`
  )
)
  .png()
  .toBuffer();

const bag = await sharp(film)
  .composite([
    { input: print, left: 0, top: 0 },
    { input: ring, left: 90, top: 68 },
    { input: bowlRound, left: 96, top: 74 },
  ])
  .png()
  .toBuffer();

const rotated = await sharp(bag)
  .rotate(-0.6, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const rotMeta = await sharp(rotated).metadata();
const shadow = await sharp(
  svg(
    rotMeta.width,
    64,
    `<ellipse cx="${rotMeta.width / 2}" cy="34" rx="${rotMeta.width * 0.28}" ry="11" fill="#000" fill-opacity="0.16"/>`
  )
)
  .blur(12)
  .png()
  .toBuffer();

const left = Math.round((800 - rotMeta.width) / 2);
const top = Math.round((800 - rotMeta.height) / 2) - 6;
await sharp({
  create: {
    width: 800,
    height: 800,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    { input: shadow, left, top: top + rotMeta.height - 30 },
    { input: rotated, left, top },
  ])
  .png({ compressionLevel: 8 })
  .toFile(join(dir, "1.png"));

console.log("wrote public/products/1.png");
