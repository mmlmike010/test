import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

const CF = "https://d2lnr5mha7bycj.cloudfront.net/product-image/file";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function toTile(buf, outPath) {
  const fitted = await sharp(buf)
    .resize(760, 760, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: fitted, gravity: "center" }])
    .png({ compressionLevel: 8 })
    .toFile(outPath);
}

function xml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function kirkLabel({ w, h, title, line2 = "", size = "", fill = "#005DAA" }) {
  const titleSize = title.length > 12 ? Math.round(w * 0.092) : Math.round(w * 0.11);
  const line2Size = Math.round(w * 0.088);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" fill="none" stroke="#d8d8d8" stroke-width="1.5"/>
  <rect width="${w}" height="${Math.round(h * 0.34)}" fill="${fill}"/>
  <text x="${w / 2}" y="${h * 0.16}" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.12)}" font-weight="800">KIRKLAND</text>
  <text x="${w / 2}" y="${h * 0.275}" text-anchor="middle" fill="#d6e6f4" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.055)}" letter-spacing="2.4" font-weight="700">SIGNATURE</text>
  <text x="${w / 2}" y="${h * 0.54}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="800">${xml(title)}</text>
  ${line2 ? `<text x="${w / 2}" y="${h * 0.7}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${line2Size}" font-weight="800">${xml(line2)}</text>` : ""}
  ${size ? `<text x="${w / 2}" y="${h * 0.88}" text-anchor="middle" fill="#555555" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.058)}" font-weight="700">${xml(size)}</text>` : ""}
</svg>`);
}

async function composeJars() {
  const paisley = await download(
    `${CF}/large_2378656b-288a-4b99-8ad4-a05d064461e1.jpeg`
  );
  const salad = await download(
    `${CF}/large_66764c9d-6caa-47b9-a1c0-a1735bcdc630.jpeg`
  );

  const beanLabel = await sharp(
    kirkLabel({
      w: 268,
      h: 292,
      title: "FIVE BEAN",
      line2: "SALAD",
      size: "2 × 35.5 OZ",
      fill: "#1B5E20",
    })
  )
    .png()
    .toBuffer();

  const fiveBean = await sharp(paisley)
    .composite([
      { input: beanLabel, left: 28, top: 150 },
      { input: beanLabel, left: 304, top: 150 },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
  await toTile(fiveBean, join(dir, "7.png"));

  const lentilLabel = await sharp(
    kirkLabel({
      w: 424,
      h: 248,
      title: "COOKED LENTILS",
      line2: "& CHICKPEAS",
      size: "READY TO EAT",
      fill: "#5D4037",
    })
  )
    .png()
    .toBuffer();

  const lentils = await sharp(salad)
    .composite([{ input: lentilLabel, left: 88, top: 186 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  await toTile(lentils, join(dir, "6.png"));
}

async function composeHardcovers() {
  const beach = await download(
    `${CF}/large_eae360f3-e93e-460f-a895-6277f39b4a03.jpeg`
  );
  const metabolic = await download(
    `${CF}/large_a785f563-0f86-44af-ae7a-56ba10517d50.jpg`
  );

  const back = await sharp(metabolic)
    .extract({ left: 106, top: 88, width: 386, height: 423 })
    .resize(340, 372, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const front = await sharp(beach)
    .extract({ left: 144, top: 64, width: 311, height: 471 })
    .resize(292, 442, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const badge = await sharp(
    svg(
      220,
      28,
      `<rect width="220" height="28" rx="3" fill="#E31837"/>
       <text x="110" y="19" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800">COSTCO · HARDCOVER MIX</text>`
    )
  )
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: back, left: 118, top: 186 },
      { input: front, left: 292, top: 142 },
      { input: badge, left: 290, top: 612 },
    ])
    .png({ compressionLevel: 8 })
    .toFile(join(dir, "17.png"));
}

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
}

async function composeJasons() {
  // Seeded loaf face only — stay above the Izzio label and below the twist.
  const seededPack = await download(
    `${CF}/large_d2b0fee4-2249-4950-9b3a-b167df3fdc0e.jpg`
  );

  const window = { left: 220, top: 268, width: 360, height: 200 };
  const loaf = await sharp(seededPack)
    .extract({ left: 225, top: 170, width: 150, height: 88 })
    .resize(window.width, window.height, { fit: "cover" })
    .png()
    .toBuffer();

  const bag = await sharp(
    svg(
      800,
      800,
      `
  <defs>
    <filter id="floor" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="20" stdDeviation="16" flood-color="#1a1a1a" flood-opacity="0.18"/>
    </filter>
    <filter id="paper">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0" result="grain"/>
      <feBlend in="SourceGraphic" in2="grain" mode="multiply"/>
    </filter>
    <linearGradient id="purpleBag" x1="0.08" y1="0" x2="0.92" y2="1">
      <stop offset="0" stop-color="#5a2474"/>
      <stop offset="0.45" stop-color="#431862"/>
      <stop offset="1" stop-color="#2c0f44"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.18" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="0.34" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1040"/>
      <stop offset="1" stop-color="#3a1654"/>
    </linearGradient>
  </defs>
  <g filter="url(#floor)">
    <path filter="url(#paper)" fill-rule="evenodd" fill="url(#purpleBag)" d="M168 118 l20-28 h424 l20 28 v508 c0 22-18 36-44 36 H192 c-26 0-44-14-44-36 Z M220 268 h360 v200 H220 Z"/>
    <path fill-rule="evenodd" fill="url(#sheen)" d="M168 118 l20-28 h424 l20 28 v508 c0 22-18 36-44 36 H192 c-26 0-44-14-44-36 Z M220 268 h360 v200 H220 Z"/>
    <path d="M188 90 h424 l16 28 H172 Z" fill="url(#fold)"/>
    <path d="M208 78 h384 l10 12 H198 Z" fill="#241036"/>
    <path d="M176 150 h448" stroke="#2a1040" stroke-width="2" opacity="0.45"/>
    <rect x="220" y="268" width="360" height="200" fill="none" stroke="#1b0c28" stroke-width="9"/>
    <rect x="226" y="274" width="348" height="188" fill="none" stroke="#d8c48a" stroke-width="2" opacity="0.55"/>
    <text x="400" y="158" text-anchor="middle" fill="#f4e6c0" font-family="Georgia, Times New Roman, serif" font-size="52" font-weight="700">Jason's</text>
    <text x="400" y="182" text-anchor="middle" fill="#d4c0e4" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" letter-spacing="4.6">SOURDOUGH</text>
    <text x="400" y="234" text-anchor="middle" fill="#e8d5a3" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="2.2">RECIPE NO 11</text>
    <text x="400" y="512" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="800" letter-spacing="1.8">GRAINS &amp; SEEDS</text>
    <text x="400" y="540" text-anchor="middle" fill="#e8d5a3" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2.6">CIABATTIN</text>
    <text x="400" y="628" text-anchor="middle" fill="#c9b8d8" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">580g</text>
  </g>
`
    )
  )
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      { input: loaf, left: window.left, top: window.top },
      { input: bag, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 8 })
    .toFile(join(dir, "9.png"));
}

async function composePhotoTiles() {
  const seat = await download(
    `${CF}/large_7fa21e55-544f-4f30-b691-385ce5da3e01.jpg`
  );
  const sleeve = await download(
    `${CF}/large_84d967f8-2c2a-4dc0-8a74-72ad7761f5d9.jpeg`
  );

  const seatPatch = await sharp(
    svg(
      58,
      18,
      `<rect width="58" height="18" rx="2" fill="#E31837"/><text x="29" y="13" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="800" letter-spacing="0.8">COSTCO</text>`
    )
  )
    .png()
    .toBuffer();

  const seatTile = await sharp(seat)
    .composite([{ input: seatPatch, left: 248, top: 188 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  await toTile(seatTile, join(dir, "13.png"));

  const incaseBadge = await sharp(
    svg(
      62,
      18,
      `
  <rect width="62" height="18" rx="2" fill="#f4f4f4"/>
  <text x="31" y="13" text-anchor="middle" fill="#111111" font-family="Arial, Helvetica, sans-serif" font-size="8" font-weight="800" letter-spacing="1.1">incase</text>
`
    )
  )
    .png()
    .toBuffer();

  const sleeveTile = await sharp(sleeve)
    .composite([{ input: incaseBadge, left: 494, top: 458 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  await toTile(sleeveTile, join(dir, "22.png"));
}

async function composeMixedNuts() {
  const nuts = await download(
    `${CF}/large_6f376933-2b60-43ab-92ba-091277d87719.jpeg`
  );
  await toTile(nuts, join(dir, "2.png"));
}

await composeMixedNuts();
console.log("composed 2 from Kirkland Heart Healthy Mixed Nuts");

await composeJars();
console.log("composed 6 + 7 from Costco Same-Day jar/tub photos");

await composeJasons();
console.log("composed 9 from photographic loaf window");

await composeHardcovers();
console.log("composed 17 from hardcover pack photography");

await composePhotoTiles();
console.log("composed 13 + 22 from pack photography");
