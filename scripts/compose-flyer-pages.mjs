import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 850;
const H = 1100;

function xml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
}

async function headerBar() {
  return sharp(
    svg(
      W,
      112,
      `
  <rect width="${W}" height="112" fill="#E31837"/>
  <text x="118" y="44" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#ffffff">COSTCO</text>
  <rect x="62" y="50" width="112" height="2.5" fill="#ffffff"/>
  <rect x="62" y="55.5" width="112" height="2.5" fill="#ffffff"/>
  <rect x="62" y="61" width="112" height="2.5" fill="#ffffff"/>
  <text x="118" y="80" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700" fill="#ffffff" letter-spacing="4.2">WHOLESALE</text>
  <text x="196" y="48" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" fill="#ffffff">Warehouse Coupon Book</text>
  <text x="196" y="72" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#F3E3A3">Gold Star · Same-Day · 11217 Brooklyn</text>
  <text x="${W - 32}" y="46" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="#ffffff">8/24/26 – 9/21/26</text>
  <text x="${W - 32}" y="70" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#F3E3A3">Sale ends in 10 days</text>
  <text x="${W - 32}" y="90" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#ffffff">While supplies last</text>
`
    )
  )
    .png()
    .toBuffer();
}

async function goldRule() {
  return sharp(
    svg(
      W,
      5,
      `
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#A3841C"/>
      <stop offset="0.5" stop-color="#F3E3A3"/>
      <stop offset="1" stop-color="#A3841C"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="5" fill="url(#g)"/>
`
    )
  )
    .png()
    .toBuffer();
}

async function footerBar() {
  return sharp(
    svg(
      W,
      34,
      `
  <rect width="${W}" height="34" fill="#005DAA"/>
  <text x="${W / 2}" y="22" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#ffffff">Same-Day · 11217 Brooklyn · Membership required · Prices higher than warehouse</text>
`
    )
  )
    .png()
    .toBuffer();
}

async function coupon({
  id,
  brand,
  name,
  price,
  was,
  save,
  size,
  w,
  h,
  featured = false,
}) {
  const photoBox = featured ? Math.round(h * 0.52) : Math.round(h * 0.5);
  const pack = await sharp(join(dir, `${id}.png`))
    .resize(w - 36, photoBox - 16, {
      fit: "inside",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();
  const packMeta = await sharp(pack).metadata();
  const packLeft = Math.round((w - (packMeta.width || w)) / 2);
  const chrome = await sharp(
    svg(
      w,
      h,
      `
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" fill="none" stroke="#1a1a1a" stroke-width="1.5"/>
  <rect x="7" y="7" width="${w - 14}" height="${h - 14}" fill="none" stroke="#c4c4c4" stroke-width="1.25" stroke-dasharray="3 4"/>
  <rect width="${w}" height="28" fill="#E31837"/>
  <text x="10" y="19" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" fill="#ffffff" letter-spacing="0.8">WAREHOUSE COUPON</text>
  <text x="${w - 10}" y="19" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#F3E3A3">LIMIT 2</text>
  <text x="12" y="${photoBox + 48}" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#005DAA">${xml(brand)}</text>
  <text x="12" y="${photoBox + 70}" font-family="Arial, Helvetica, sans-serif" font-size="${featured ? 20 : 16}" font-weight="800" fill="#1A1A1A">${xml(name)}</text>
  <text x="12" y="${photoBox + 90}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#666666">${xml(size)} · 8/24/26–9/21/26</text>
  <text x="12" y="${h - 28}" font-family="Arial, Helvetica, sans-serif" font-size="${featured ? 36 : 28}" font-weight="800" fill="#1A1A1A">$${xml(price)}</text>
  <text x="${featured ? 148 : 122}" y="${h - 30}" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#888888">$${xml(was)}</text>
  <rect x="${w - 96}" y="${h - 48}" width="84" height="26" rx="3" fill="#E31837"/>
  <text x="${w - 54}" y="${h - 30}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" fill="#ffffff">SAVE $${xml(save)}</text>
`
    )
  )
    .png()
    .toBuffer();

  return sharp(chrome)
    .composite([{ input: pack, top: 36, left: packLeft }])
    .png()
    .toBuffer();
}

const deals = [
  {
    id: "24",
    brand: "Costco",
    name: "Rotisserie Chicken",
    price: "4.99",
    was: "6.99",
    save: "2.00",
    size: "1 ct",
  },
  {
    id: "2",
    brand: "Kirkland Signature",
    name: "Mixed Nuts",
    price: "3.81",
    was: "5.14",
    save: "1.33",
    size: "36 oz",
  },
  {
    id: "3",
    brand: "Hunt's",
    name: "Diced Tomatoes",
    price: "4.40",
    was: "5.42",
    save: "1.02",
    size: "8 x 14.5 oz",
  },
  {
    id: "7",
    brand: "Kirkland Signature",
    name: "Five Bean Salad",
    price: "3.17",
    was: "4.50",
    save: "1.33",
    size: "15 oz",
  },
];

const header = await headerBar();
const gold = await goldRule();
const footer = await footerBar();

const coverIntro = await sharp(
  svg(
    W,
    88,
    `
  <rect width="${W}" height="88" fill="#ffffff"/>
  <text x="32" y="36" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#1A1A1A">Member Only Savings</text>
  <text x="32" y="62" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#555555">Valid 8/24/26 – 9/21/26 · While supplies last · Page 1 of 2</text>
`
  )
)
  .png()
  .toBuffer();

const coverGrid = [];
for (const deal of deals) {
  coverGrid.push(await coupon({ ...deal, w: 378, h: 430 }));
}

await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([
    { input: header, top: 0, left: 0 },
    { input: gold, top: 112, left: 0 },
    { input: coverIntro, top: 117, left: 0 },
    { input: coverGrid[0], top: 210, left: 32 },
    { input: coverGrid[1], top: 210, left: 440 },
    { input: coverGrid[2], top: 656, left: 32 },
    { input: coverGrid[3], top: 656, left: 440 },
    { input: footer, top: H - 34, left: 0 },
  ])
  .jpeg({ quality: 90 })
  .toFile(join(dir, "flyer-page-1.jpg"));
process.stdout.write("wrote flyer-page-1.jpg\n");

const pageIntro = await sharp(
  svg(
    W,
    64,
    `
  <rect width="${W}" height="64" fill="#ffffff"/>
  <text x="32" y="40" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="#1A1A1A">Flyer deals · Aug 24 – Sep 21</text>
`
  )
)
  .png()
  .toBuffer();

const grid = [];
for (const deal of deals) {
  grid.push(await coupon({ ...deal, w: 378, h: 430 }));
}

await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([
    { input: header, top: 0, left: 0 },
    { input: gold, top: 112, left: 0 },
    { input: pageIntro, top: 117, left: 0 },
    { input: grid[0], top: 188, left: 32 },
    { input: grid[1], top: 188, left: 440 },
    { input: grid[2], top: 634, left: 32 },
    { input: grid[3], top: 634, left: 440 },
    { input: footer, top: H - 34, left: 0 },
  ])
  .jpeg({ quality: 90 })
  .toFile(join(dir, "flyer-page-2.jpg"));
process.stdout.write("wrote flyer-page-2.jpg\n");
