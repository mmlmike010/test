import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1400;
const H = 788;

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// Instacart collection cards are the lifestyle photo plus the title overlay
// in the page — no floating packs, wood bars, or kitchen-plane composites.
async function lifestyleCard(url, outName, position = "attention") {
  const bytes = await download(url);
  await sharp(bytes)
    .rotate()
    .resize(W, H, { fit: "cover", position })
    .sharpen({ sigma: 0.6 })
    .modulate({ brightness: 1.03, saturation: 1.04 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
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

/** Costco.com-style household banner: photographic studio sweep + the
 *  Kirkland detergent jug. Not a kitchen-plane collage. */
async function householdMerch() {
  const jugSrc = await download(
    `${CF}/large_fc09f4a9-8ad0-4983-9451-bdbe70fcf0d9.jpeg`
  );
  const sweepSrc = await download(
    "https://raw.githubusercontent.com/bx5974/bullet3/master/data/kitchens/fatihrmutfak/Concrete.jpg"
  );

  const sweep = await sharp(sweepSrc)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.55, saturation: 0.45 })
    .toBuffer();

  const wash = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 168, g: 48, b: 32, alpha: 0.42 },
    },
  })
    .png()
    .toBuffer();

  const cut = await knockoutWhite(jugSrc);
  const jug = await sharp(cut)
    .trim()
    .resize(Math.round(H * 1.12), Math.round(H * 0.9), { fit: "inside" })
    .png()
    .toBuffer();
  const jugMeta = await sharp(jug).metadata();
  const left = Math.round((W - jugMeta.width) / 2) + 70;
  const top = Math.round((H - jugMeta.height) / 2) + 18;
  const shadow = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${jugMeta.width}" height="110"><ellipse cx="${jugMeta.width / 2}" cy="58" rx="${jugMeta.width * 0.36}" ry="18" fill="black" fill-opacity="0.38"/></svg>`
    )
  )
    .blur(18)
    .png()
    .toBuffer();

  await sharp(sweep)
    .composite([
      { input: wash, blend: "over" },
      { input: shadow, left, top: top + jugMeta.height - 52 },
      { input: jug, left, top },
    ])
    .sharpen({ sigma: 0.55 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, "hero-treasure.jpg"));
  process.stdout.write("wrote hero-treasure.jpg (household merch)\n");
}

const only = process.argv[2] || "all";

if (only === "all" || only === "weekly") {
  await lifestyleCard(
    "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public/tomato-pasta/tomato-penne-plated.jpeg",
    "hero-weekly.jpg",
    "centre"
  );
}

if (only === "all" || only === "kirkland") {
  await lifestyleCard(
    "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public/cheeseboard/cheeseboard.jpeg",
    "hero-kirkland.jpg",
    "centre"
  );
}

if (only === "all" || only === "featured") {
  await lifestyleCard(
    "https://raw.githubusercontent.com/kchenturtles/PassionfruitKitchen/main/public/smoothie-bowl/smoothie-bowl-aerial.jpg",
    "hero-new.jpg",
    "centre"
  );
}

if (only === "all" || only === "household") {
  await householdMerch();
}
