import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 850;
const H = 1100;

function svg(markup) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${markup}</svg>`
  );
}

async function headerBar() {
  return sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="118">
      <rect width="${W}" height="118" fill="#E31837"/>
      <rect y="118" width="${W}" height="0"/>
      <text x="36" y="52" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="white">COSTCO</text>
      <text x="36" y="86" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="white">Member Only Savings</text>
      <text x="${W - 36}" y="50" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="white">8/24/26 – 9/20/26</text>
      <text x="${W - 36}" y="76" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#F3E3A3">Gold Star · Same-Day</text>
      <text x="${W - 36}" y="98" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="white">Sale ends in 10 days</text>
    </svg>`)
  )
    .png()
    .toBuffer();
}

async function goldRule() {
  return sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="6">
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#A3841C"/><stop offset="0.5" stop-color="#F3E3A3"/><stop offset="1" stop-color="#A3841C"/></linearGradient></defs>
      <rect width="${W}" height="6" fill="url(#g)"/>
    </svg>`)
  )
    .png()
    .toBuffer();
}

async function footerBar() {
  return sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="36">
      <rect width="${W}" height="36" fill="#005DAA"/>
      <text x="${W / 2}" y="23" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="white">Same-Day · 11217 Brooklyn · Membership required · Prices higher than warehouse</text>
    </svg>`)
  )
    .png()
    .toBuffer();
}

async function couponCard({ id, brand, name, price, was, save, size }) {
  const pack = await sharp(join(dir, `${id}.png`))
    .resize(280, 220, { fit: "inside", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  const cardW = 370;
  const cardH = 400;
  const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cardW}" height="150">
    <rect width="${cardW}" height="150" fill="white"/>
    <text x="16" y="28" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#005DAA">${escapeXml(brand)}</text>
    <text x="16" y="52" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#1A1A1A">${escapeXml(name)}</text>
    <text x="16" y="74" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#666">${escapeXml(size)}</text>
    <text x="16" y="108" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#1A1A1A">$${price}</text>
    <text x="130" y="106" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#888" text-decoration="line-through">$${was}</text>
    <rect x="16" y="118" width="88" height="22" rx="3" fill="#E31837"/>
    <text x="60" y="134" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" fill="white">SAVE $${save}</text>
  </svg>`);
  return sharp({
    create: {
      width: cardW,
      height: cardH,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([
      { input: pack, top: 16, left: Math.round((cardW - 280) / 2) },
      { input: await sharp(label).png().toBuffer(), top: 250, left: 0 },
    ])
    .extend({
      top: 1,
      bottom: 1,
      left: 1,
      right: 1,
      background: { r: 220, g: 220, b: 220 },
    })
    .png()
    .toBuffer();
}

function escapeXml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const header = await headerBar();
const gold = await goldRule();
const footer = await footerBar();

const coverPhoto = await sharp(join(dir, "recipe-pasta.jpg"))
  .resize(W - 72, 620, { fit: "cover", position: "centre" })
  .jpeg()
  .toBuffer();

const coverCopy = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="220">
    <rect width="${W}" height="220" fill="#F6F7F8"/>
    <text x="36" y="48" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#1A1A1A">Warehouse coupon book</text>
    <text x="36" y="84" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#333">Valid 8/24/26 – 9/20/26 · While supplies last</text>
    <text x="36" y="120" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#555">Shop these Member Only Savings on Costco Same-Day.</text>
    <text x="36" y="156" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#005DAA">Page 1 of 2 · Flyer deals inside</text>
  </svg>`)
)
  .png()
  .toBuffer();

await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 246, g: 247, b: 248 },
  },
})
  .composite([
    { input: header, top: 0, left: 0 },
    { input: gold, top: 118, left: 0 },
    { input: coverCopy, top: 124, left: 0 },
    { input: coverPhoto, top: 344, left: 36 },
    { input: footer, top: H - 36, left: 0 },
  ])
  .jpeg({ quality: 90 })
  .toFile(join(dir, "flyer-page-1.jpg"));
process.stdout.write("wrote flyer-page-1.jpg\n");

const deals = [
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
  {
    id: "24",
    brand: "Costco",
    name: "Rotisserie Chicken",
    price: "4.99",
    was: "6.99",
    save: "2.00",
    size: "1 ct",
  },
];

const cards = [];
for (const deal of deals) cards.push(await couponCard(deal));

const pageCopy = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="56">
    <rect width="${W}" height="56" fill="#F6F7F8"/>
    <text x="36" y="36" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#1A1A1A">Flyer deals · Aug 24 – Sep 20</text>
  </svg>`)
)
  .png()
  .toBuffer();

await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 246, g: 247, b: 248 },
  },
})
  .composite([
    { input: header, top: 0, left: 0 },
    { input: gold, top: 118, left: 0 },
    { input: pageCopy, top: 124, left: 0 },
    { input: cards[0], top: 186, left: 40 },
    { input: cards[1], top: 186, left: 440 },
    { input: cards[2], top: 612, left: 40 },
    { input: cards[3], top: 612, left: 440 },
    { input: footer, top: H - 36, left: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(join(dir, "flyer-page-2.jpg"));
process.stdout.write("wrote flyer-page-2.jpg\n");
