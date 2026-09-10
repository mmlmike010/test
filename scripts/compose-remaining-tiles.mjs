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
  // Official Recipe No 11 is a top-load paper bakery bag, not a plastic
  // pouch. Colorize a photographed paper fiber and print over a seeded-loaf
  // window. Never dest-in or blur-recolor a competing brand's RGB.
  const PAPER =
    "https://raw.githubusercontent.com/prabhasp/ali-khasro/master/lokta/paper2.jpg";
  const seededPack = await download(
    `${CF}/large_d2b0fee4-2249-4950-9b3a-b167df3fdc0e.jpg`
  );
  const paperBytes = await download(PAPER);

  const pw = 428;
  const ph = 590;
  const bagMask = await sharp(
    svg(
      pw,
      ph,
      `<path d="M36 78 C36 48 58 38 86 38 L342 38 C370 38 392 48 392 78 L406 548 C406 572 386 582 360 582 L68 582 C42 582 22 572 22 548 Z" fill="#fff"/>`
    )
  )
    .png()
    .toBuffer();

  const paperGrey = await sharp(paperBytes)
    .resize(pw, ph, { fit: "cover", position: "centre" })
    .greyscale()
    .modulate({ brightness: 1.15 })
    .removeAlpha()
    .toBuffer();
  const purpleWash = await sharp({
    create: {
      width: pw,
      height: ph,
      channels: 3,
      background: { r: 98, g: 42, b: 122 },
    },
  })
    .jpeg()
    .toBuffer();
  const paper = await sharp(paperGrey)
    .composite([{ input: purpleWash, blend: "multiply" }])
    .removeAlpha()
    .toBuffer();

  const lighting = svg(
    pw,
    ph,
    `
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="0.3" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#1a0a24" stop-opacity="0.22"/>
    </linearGradient>
    <linearGradient id="fold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1438" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#2a1438" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${pw}" height="${ph}" fill="url(#sheen)"/>
  <rect x="22" y="38" width="384" height="52" fill="url(#fold)"/>
  <path d="M86 62 L342 62" stroke="#e8d4f0" stroke-opacity="0.28" stroke-width="2"/>
`
  );

  const body = await sharp(paper)
    .composite([{ input: lighting, blend: "over" }])
    .removeAlpha()
    .toBuffer();
  const bagAlpha = await sharp(bagMask).extractChannel("alpha").toBuffer();
  const film = await sharp(body).joinChannel(bagAlpha).png().toBuffer();

  const winW = 188;
  const winH = 168;
  const winX = Math.round((pw - winW) / 2);
  const winY = Math.round(ph * 0.3);
  const loaf = await sharp(seededPack)
    .extract({ left: 230, top: 165, width: 140, height: 120 })
    .resize(winW, winH, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const windowMask = await sharp(
    svg(
      winW,
      winH,
      `<rect width="${winW}" height="${winH}" rx="12" ry="12" fill="#fff"/>`
    )
  )
    .png()
    .toBuffer();
  const loafWindow = await sharp(loaf)
    .composite([{ input: windowMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const print = await sharp(
    svg(
      pw,
      ph,
      `
  <rect x="${winX - 5}" y="${winY - 5}" width="${winW + 10}" height="${winH + 10}" rx="14" ry="14" fill="#2a1040"/>
  <text x="${pw / 2}" y="118" text-anchor="middle" fill="#f4e6c0" font-family="Georgia, Times New Roman, serif" font-size="38" font-weight="700">Jason's</text>
  <text x="${pw / 2}" y="148" text-anchor="middle" fill="#d4b8e8" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" letter-spacing="4.4">SOURDOUGH</text>
  <text x="${pw / 2}" y="438" text-anchor="middle" fill="#f4e6c0" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="800" letter-spacing="1.5">GRAINS &amp; SEEDS</text>
  <text x="${pw / 2}" y="462" text-anchor="middle" fill="#e8d4f4" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" letter-spacing="2.4">CIABATTIN</text>
  <rect x="${pw / 2 - 80}" y="476" width="160" height="28" rx="3" fill="#C9A227"/>
  <text x="${pw / 2}" y="495" text-anchor="middle" fill="#2a1040" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" letter-spacing="1.3">RECIPE NO 11</text>
  <text x="${pw / 2}" y="536" text-anchor="middle" fill="#c9a8d8" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8">24 OZ</text>
`
    )
  )
    .png()
    .toBuffer();

  const bag = await sharp(film)
    .composite([
      { input: print, left: 0, top: 0 },
      { input: loafWindow, left: winX, top: winY },
    ])
    .png()
    .toBuffer();

  const left = Math.round((800 - pw) / 2);
  const top = Math.round((800 - ph) / 2);
  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: bag, left, top }])
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
  console.log("composed 9 from paper bakery bag + seeded loaf window");
}

if (only === "all" || only === "books") {
  await composeHardcovers();
  console.log("composed 17 from hardcover pack photography");
}

if (only === "all" || only === "photos") {
  await composePhotoTiles();
  console.log("composed 13 + 22 from pack photography");
}
