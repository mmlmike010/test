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

function kirkLabel({ w, h, title, line2 = "", size = "" }) {
  const titleSize = title.length > 12 ? Math.round(w * 0.1) : Math.round(w * 0.12);
  const line2Size = Math.round(w * 0.092);
  const mark = Math.round(h * 0.22);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#F7F4EC"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#C9C2B0" stroke-width="1.25"/>
  <text x="${w / 2}" y="${mark * 0.62}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.072)}" font-weight="800" letter-spacing="0.4">KIRKLAND</text>
  <line x1="${w * 0.18}" y1="${mark * 0.86}" x2="${w * 0.34}" y2="${mark * 0.86}" stroke="#C9A227" stroke-width="1.4"/>
  <text x="${w / 2}" y="${mark * 0.96}" text-anchor="middle" fill="#C9A227" font-family="Georgia, Times New Roman, serif" font-size="${Math.round(w * 0.042)}" font-style="italic" font-weight="700">Signature</text>
  <line x1="${w * 0.66}" y1="${mark * 0.86}" x2="${w * 0.82}" y2="${mark * 0.86}" stroke="#C9A227" stroke-width="1.4"/>
  <text x="${w / 2}" y="${h * 0.5}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="800">${xml(title)}</text>
  ${line2 ? `<text x="${w / 2}" y="${h * 0.66}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${line2Size}" font-weight="800">${xml(line2)}</text>` : ""}
  ${size ? `<text x="${w / 2}" y="${h * 0.88}" text-anchor="middle" fill="#5a564c" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.05)}" font-weight="700">${xml(size)}</text>` : ""}
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
      w: 236,
      h: 268,
      title: "FIVE BEAN",
      line2: "SALAD",
      size: "15 OZ",
    })
  )
    .png()
    .toBuffer();

  const burstCover = await sharp({
    create: {
      width: 18,
      height: 24,
      channels: 3,
      background: { r: 246, g: 243, b: 234 },
    },
  })
    .png()
    .toBuffer();

  const fiveBean = await sharp(paisley)
    .composite([
      { input: burstCover, left: 28, top: 246 },
      { input: beanLabel, left: 36, top: 166 },
      { input: beanLabel, left: 328, top: 166 },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
  await toTile(fiveBean, join(dir, "7.png"));

  const lentilLabel = await sharp(
    kirkLabel({
      w: 476,
      h: 198,
      title: "COOKED LENTILS",
      line2: "& CHICKPEAS",
      size: "17 OZ · READY TO EAT",
    })
  )
    .png()
    .toBuffer();

  const lentils = await sharp(salad)
    .composite([{ input: lentilLabel, left: 62, top: 214 }])
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
  // Recipe No 11: printed plastic ciabattin bag, not a kraft sack.
  // Crumb window is seeded sourdough only — never dest-in a competing bag.
  const crumbShot = await download(
    "https://user-images.githubusercontent.com/15069517/151712105-4d4076e5-3871-4c6b-89a0-40c0bdf22248.jpg"
  );

  const pw = 392;
  const ph = 560;
  const plastic = await sharp({
    create: {
      width: pw,
      height: ph,
      channels: 3,
      background: { r: 132, g: 72, b: 88 },
    },
  })
    .jpeg()
    .toBuffer();

  const bagD = `M48,36
    C44,28 52,18 72,16
    L320,16
    C340,18 348,28 344,36
    L348,72
    C356,150 358,300 350,470
    C348,516 336,536 300,544
    L92,544
    C56,536 44,516 42,470
    C34,300 36,150 44,72
    Z`;

  const bagMask = await sharp(svg(pw, ph, `<path fill="#fff" d="${bagD}"/>`))
    .png()
    .toBuffer();

  const lighting = svg(
    pw,
    ph,
    `
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2a1020" stop-opacity="0.28"/>
      <stop offset="0.22" stop-color="#fff6ea" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="#fff6ea" stop-opacity="0"/>
      <stop offset="1" stop-color="#2a1020" stop-opacity="0.26"/>
    </linearGradient>
    <linearGradient id="vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff6ea" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#2a1020" stop-opacity="0.16"/>
    </linearGradient>
  </defs>
  <rect width="${pw}" height="${ph}" fill="url(#sheen)"/>
  <rect width="${pw}" height="${ph}" fill="url(#vert)"/>
  <rect x="64" y="16" width="264" height="22" fill="#C9A227"/>
`
  );

  const body = await sharp(plastic)
    .composite([{ input: lighting, blend: "over" }])
    .removeAlpha()
    .toBuffer();
  const bagAlpha = await sharp(bagMask).extractChannel("alpha").toBuffer();
  const film = await sharp(body).joinChannel(bagAlpha).png().toBuffer();

  const winW = 272;
  const winH = 268;
  const winX = Math.round((pw - winW) / 2);
  const winY = 124;
  const loaf = await sharp(crumbShot)
    .extract({ left: 1120, top: 480, width: 2240, height: 1500 })
    .resize(winW, winH, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const windowMask = await sharp(
    svg(winW, winH, `<rect width="${winW}" height="${winH}" rx="6" ry="6" fill="#fff"/>`)
  )
    .png()
    .toBuffer();
  const loafWindow = await sharp(loaf)
    .composite([{ input: windowMask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const filmSheen = await sharp(
    svg(
      winW,
      winH,
      `
    <defs>
      <linearGradient id="film" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.24"/>
        <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="1" stop-color="#3a1830" stop-opacity="0.12"/>
      </linearGradient>
    </defs>
    <rect width="${winW}" height="${winH}" rx="6" fill="url(#film)"/>
  `
    )
  )
    .png()
    .toBuffer();

  const print = await sharp(
    svg(
      pw,
      ph,
      `
  <text x="${pw / 2}" y="32" text-anchor="middle" fill="#3a1830" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="800" letter-spacing="1.8">RESEAL TO KEEP FRESH</text>
  <rect x="${winX - 5}" y="${winY - 5}" width="${winW + 10}" height="${winH + 10}" rx="7" fill="#4a2434"/>
  <text x="${pw / 2}" y="82" text-anchor="middle" fill="#f7ead2" font-family="Georgia, Times New Roman, serif" font-size="40" font-style="italic" font-weight="700">Jason's</text>
  <text x="${pw / 2}" y="106" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="5.4">SOURDOUGH</text>
  <text x="${pw / 2}" y="418" text-anchor="middle" fill="#f7ead2" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" letter-spacing="2">GRAINS &amp; SEEDS</text>
  <text x="${pw / 2}" y="440" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="2.4">TASTE THE MAGIC</text>
  <rect x="${pw / 2 - 82}" y="452" width="164" height="26" rx="2" fill="#C9A227"/>
  <text x="${pw / 2}" y="470" text-anchor="middle" fill="#3a1830" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.4">RECIPE NO 11</text>
  <text x="${pw / 2}" y="510" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="2">24 OZ</text>
`
    )
  )
    .png()
    .toBuffer();

  const bag = await sharp(film)
    .composite([
      { input: print, left: 0, top: 0 },
      { input: loafWindow, left: winX, top: winY },
      { input: filmSheen, left: winX, top: winY },
    ])
    .png()
    .toBuffer();

  const rotated = await sharp(bag)
    .rotate(-1.2, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const rotMeta = await sharp(rotated).metadata();
  const shadow = await sharp(
    svg(
      rotMeta.width,
      64,
      `<ellipse cx="${rotMeta.width / 2}" cy="34" rx="${rotMeta.width * 0.28}" ry="10" fill="#000" fill-opacity="0.16"/>`
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
      { input: shadow, left, top: top + rotMeta.height - 28 },
      { input: rotated, left, top },
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

const only = process.argv[2] || "all";

if (only === "all" || only === "nuts") {
  await composeMixedNuts();
  console.log("composed 2 from Kirkland Heart Healthy Mixed Nuts");
}

if (only === "all" || only === "jars") {
  await composeJars();
  console.log("composed 6 + 7 from Costco Same-Day jar/tub photos");
}

if (only === "all" || only === "jasons") {
  await composeJasons();
  console.log("composed 9 as a printed plastic ciabattin bag + seeded crumb window");
}

if (only === "all" || only === "books") {
  await composeHardcovers();
  console.log("composed 17 from hardcover pack photography");
}

if (only === "all" || only === "photos") {
  await composePhotoTiles();
  console.log("composed 13 + 22 from pack photography");
}
