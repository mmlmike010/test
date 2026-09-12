import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

const CF = "https://d2lnr5mha7bycj.cloudfront.net/product-image/file";
const CLAMSHELL = `${CF}/large_2b963e60-c6a3-4037-8099-6130912fc4c9.jpeg`;
const PAINS = `${CF}/large_59299aad-1c11-43fc-a7b3-ec12ac6968ee.jpeg`;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function isStudio(r, g, b) {
  return r >= 248 && g >= 248 && b >= 248;
}

function isPastry(r, g, b) {
  if (isStudio(r, g, b)) return false;
  const warm = r - b;
  const yellow = r - g;
  return r >= 125 && g >= 62 && b <= 155 && warm >= 32 && yellow >= 4 && r + g >= 230;
}

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const shellSrc = await download(CLAMSHELL);
const pastrySrc = await download(PAINS);
const meta = await sharp(shellSrc).metadata();
const W = meta.width;
const H = meta.height;

const { data } = await sharp(shellSrc).removeAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const roll = await sharp(pastrySrc)
  .extract({ left: 310, top: 295, width: 200, height: 140 })
  .modulate({ saturation: 1.12 })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const tW = roll.info.width;
const tH = roll.info.height;
const tex = roll.data;

const out = Buffer.from(data);
let pastryCount = 0;
for (let i = 0; i < W * H; i++) {
  const r = data[i * 3];
  const g = data[i * 3 + 1];
  const b = data[i * 3 + 2];
  if (!isPastry(r, g, b)) continue;
  pastryCount += 1;
  const x = i % W;
  const y = (i - x) / W;
  const tx = (x * 2 + 18) % tW;
  const ty = (y * 2 + 8) % tH;
  const ti = (ty * tW + tx) * 3;
  const tr = tex[ti];
  const tg = tex[ti + 1];
  const tb = tex[ti + 2];
  const srcL = lum(r, g, b);
  const texL = Math.max(24, lum(tr, tg, tb));
  const lift = Math.min(1.14, Math.max(0.78, srcL / texL));
  const choc = tb < 90 || tr < 150;
  const mix = choc ? 0.72 : 0.38;
  out[i * 3] = Math.max(0, Math.min(255, Math.round(r * (1 - mix) + tr * lift * mix)));
  out[i * 3 + 1] = Math.max(
    0,
    Math.min(255, Math.round(g * (1 - mix) + tg * lift * mix))
  );
  out[i * 3 + 2] = Math.max(
    0,
    Math.min(255, Math.round(b * (1 - mix) + tb * lift * 0.9 * mix))
  );
}

const labeled = await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .png()
  .toBuffer();

const fitted = await sharp(labeled)
  .resize(720, 720, { fit: "inside" })
  .png()
  .toBuffer();
const fitMeta = await sharp(fitted).metadata();
const left = Math.round((800 - fitMeta.width) / 2);
const top = Math.round((800 - fitMeta.height) / 2) - 4;

await sharp({
  create: {
    width: 800,
    height: 800,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: fitted, left, top }])
  .png({ compressionLevel: 8 })
  .toFile(join(dir, "15.png"));

await sharp(join(dir, "15.png"))
  .trim({ threshold: 16 })
  .resize(320, 320, { fit: "cover", position: "centre" })
  .jpeg({ quality: 86 })
  .toFile(join(dir, "cat-bakery.jpg"));

console.log("wrote public/products/15.png", { W, H, pastryCount, tW, tH });
