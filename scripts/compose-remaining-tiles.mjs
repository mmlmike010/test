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
  const loafPack = await download(
    `${CF}/large_c2fd99fb-d74b-471f-8d29-93294dde4ffe.png`
  );
  const loaf = await sharp(loafPack)
    .extract({ left: 300, top: 90, width: 164, height: 280 })
    .resize(248, 168, { fit: "cover" })
    .png()
    .toBuffer();

  const bag = await sharp(
    svg(
      800,
      800,
      `
  <defs>
    <filter id="floor" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#1a1a1a" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="purpleBag" x1="0" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="#4a1d6a"/>
      <stop offset="0.45" stop-color="#6b2d86"/>
      <stop offset="1" stop-color="#3b1658"/>
    </linearGradient>
  </defs>
  <g filter="url(#floor)">
    <path fill-rule="evenodd" fill="url(#purpleBag)" d="M248 150 C248 132 270 120 298 120 L502 120 C530 120 552 132 552 150 L572 560 C572 592 546 616 514 616 L286 616 C254 616 228 592 228 560 Z M276 248 h248 v168 h-248 Z"/>
    <rect x="276" y="248" width="248" height="168" fill="none" stroke="#2a0f3d" stroke-width="8"/>
    <text x="400" y="188" text-anchor="middle" fill="#f4e8c8" font-family="Georgia, Times New Roman, serif" font-size="42" font-weight="700">Jason's</text>
    <text x="400" y="214" text-anchor="middle" fill="#d8c4e8" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="3">SOURDOUGH</text>
    <text x="400" y="452" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" letter-spacing="2">GRAINS &amp; SEEDS</text>
    <text x="400" y="484" text-anchor="middle" fill="#e8d5a3" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700">CIABATTIN</text>
    <text x="400" y="548" text-anchor="middle" fill="#c9b8d8" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700">580g</text>
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
      { input: loaf, left: 276, top: 248 },
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
      28,
      20,
      `<rect width="28" height="20" rx="2" fill="#E31837"/><text x="14" y="14" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="7" font-weight="800">C</text>`
    )
  )
    .png()
    .toBuffer();

  const seatTile = await sharp(seat)
    .composite([{ input: seatPatch, left: 262, top: 188 }])
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

await composeJars();
console.log("composed 6 + 7 from Costco Same-Day jar/tub photos");

await composeJasons();
console.log("composed 9 from photographic loaf window");

await composeHardcovers();
console.log("composed 17 from hardcover pack photography");

await composePhotoTiles();
console.log("composed 13 + 22 from pack photography");
