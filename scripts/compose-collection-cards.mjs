import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1600;
const H = 520;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const CF = "https://d2lnr5mha7bycj.cloudfront.net/product-image/file";

async function knockoutWhite(buf, cutoff = 242) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const seen = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i]) return;
    const o = i * 4;
    if (data[o] < cutoff || data[o + 1] < cutoff || data[o + 2] < cutoff) return;
    seen[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    data[i * 4 + 3] = 0;
    const x = i % width;
    const y = (i - x) / width;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }
  return sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();
}

/** Costco.com-style collection banner: studio sweep + one exact pack. */
async function merchHero({ file, wash, outName, scale = 0.92, nudgeX = 80 }) {
  const src = await download(`${CF}/${file}`);
  const sweepSrc = await download(
    "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/Concrete.jpg"
  );

  const sweep = await sharp(sweepSrc)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.62, saturation: 0.4 })
    .toBuffer();

  const tint = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: wash,
    },
  })
    .png()
    .toBuffer();

  const cut = await knockoutWhite(src);
  const pack = await sharp(cut)
    .trim()
    .resize(Math.round(H * scale * 1.35), Math.round(H * scale), { fit: "inside" })
    .png()
    .toBuffer();
  const meta = await sharp(pack).metadata();
  const left = Math.round((W - meta.width) / 2) + Math.round(nudgeX * 0.35);
  const top = Math.round((H - meta.height) / 2);
  const shadow = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="110"><ellipse cx="${meta.width / 2}" cy="58" rx="${meta.width * 0.34}" ry="16" fill="black" fill-opacity="0.32"/></svg>`
    )
  )
    .blur(16)
    .png()
    .toBuffer();

  await sharp(sweep)
    .composite([
      { input: tint, blend: "over" },
      { input: shadow, left, top: top + meta.height - 48 },
      { input: pack, left, top },
    ])
    .sharpen({ sigma: 0.55 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

const only = process.argv[2] || "all";

if (only === "all" || only === "weekly") {
  await merchHero({
    file: "large_e5d1efe6-fead-4b09-a7ca-7c7e0b11ea6f.jpg",
    wash: { r: 180, g: 42, b: 48, alpha: 0.38 },
    outName: "hero-weekly.jpg",
    scale: 0.88,
    nudgeX: 110,
  });
}

if (only === "all" || only === "kirkland") {
  await merchHero({
    file: "large_83cdd023-627e-4ee5-8d7e-6d23e8a79fba.jpeg",
    wash: { r: 0, g: 70, b: 140, alpha: 0.36 },
    outName: "hero-kirkland.jpg",
    scale: 0.8,
    nudgeX: 90,
  });
}

if (only === "all" || only === "featured") {
  await merchHero({
    file: "large_a3b82731-4651-476a-a0c3-01c97a17c2c6.png",
    wash: { r: 210, g: 150, b: 40, alpha: 0.28 },
    outName: "hero-new.jpg",
    scale: 0.9,
    nudgeX: 100,
  });
}

if (only === "all" || only === "household") {
  await merchHero({
    file: "large_2bacbaac-2b3d-4412-baad-d7bdb17b6080.jpeg",
    wash: { r: 90, g: 42, b: 28, alpha: 0.4 },
    outName: "hero-treasure.jpg",
    scale: 0.92,
    nudgeX: 80,
  });
}
