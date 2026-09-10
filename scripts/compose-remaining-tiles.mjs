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
  // Official Recipe No 11 is a standing mauve paper bakery bag with a
  // large loaf window. Paper fiber only — never dest-in a competing bag.
  const PAPER =
    "https://raw.githubusercontent.com/prabhasp/ali-khasro/master/lokta/paper2.jpg";
  const crumbShot = await download(
    "https://user-images.githubusercontent.com/15069517/151712105-4d4076e5-3871-4c6b-89a0-40c0bdf22248.jpg"
  );
  const paperBytes = await download(PAPER);

  const pw = 368;
  const ph = 620;
  const bagX = 18;
  const bagY = 22;
  const bagW = pw - 36;
  const bagH = ph - 36;
  const bagMask = await sharp(
    svg(
      pw,
      ph,
      `<path fill="#fff" d="M${bagX + 10},${bagY}
        L${bagX + bagW - 10},${bagY}
        Q${bagX + bagW},${bagY} ${bagX + bagW},${bagY + 10}
        L${bagX + bagW},${bagY + bagH - 14}
        Q${bagX + bagW},${bagY + bagH} ${bagX + bagW - 14},${bagY + bagH}
        L${bagX + 14},${bagY + bagH}
        Q${bagX},${bagY + bagH} ${bagX},${bagY + bagH - 14}
        L${bagX},${bagY + 10}
        Q${bagX},${bagY} ${bagX + 10},${bagY}
        Z"/>`
    )
  )
    .png()
    .toBuffer();

  const paperGrey = await sharp(paperBytes)
    .resize(pw, ph, { fit: "cover", position: "centre" })
    .greyscale()
    .normalize()
    .modulate({ brightness: 1.22, saturation: 0.3 })
    .sharpen(1.6)
    .removeAlpha()
    .toBuffer();
  const mauveWash = await sharp({
    create: {
      width: pw,
      height: ph,
      channels: 3,
      background: { r: 148, g: 86, b: 108 },
    },
  })
    .jpeg()
    .toBuffer();
  const paper = await sharp(paperGrey)
    .composite([{ input: mauveWash, blend: "multiply" }])
    .modulate({ brightness: 1.08 })
    .removeAlpha()
    .toBuffer();

  const lighting = svg(
    pw,
    ph,
    `
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2a1020" stop-opacity="0.18"/>
      <stop offset="0.22" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#2a1020" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="${pw}" height="${ph}" fill="url(#sheen)"/>
  <rect x="${bagX}" y="${bagY}" width="${bagW}" height="36" fill="#3a1830" fill-opacity="0.16"/>
  <line x1="${bagX + 18}" y1="${bagY + 14}" x2="${bagX + bagW - 18}" y2="${bagY + 14}" stroke="#3a1830" stroke-opacity="0.18" stroke-width="2"/>
  <line x1="${bagX + 28}" y1="${bagY + 22}" x2="${bagX + bagW - 28}" y2="${bagY + 22}" stroke="#3a1830" stroke-opacity="0.12" stroke-width="2"/>
`
  );

  const body = await sharp(paper)
    .composite([{ input: lighting, blend: "over" }])
    .removeAlpha()
    .toBuffer();
  const bagAlpha = await sharp(bagMask).extractChannel("alpha").toBuffer();
  const film = await sharp(body).joinChannel(bagAlpha).png().toBuffer();

  const winW = 252;
  const winH = 268;
  const winX = Math.round((pw - winW) / 2);
  const winY = 142;
  const loaf = await sharp(crumbShot)
    .extract({ left: 1420, top: 480, width: 1960, height: 1680 })
    .resize(winW, winH, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const windowMask = await sharp(
    svg(winW, winH, `<rect width="${winW}" height="${winH}" rx="4" ry="4" fill="#fff"/>`)
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
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/>
        <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="1" stop-color="#3a1830" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <rect width="${winW}" height="${winH}" rx="4" fill="url(#film)"/>
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
  <rect x="${winX - 8}" y="${winY - 8}" width="${winW + 16}" height="${winH + 16}" rx="6" fill="#4a2040"/>
  <text x="${pw / 2}" y="92" text-anchor="middle" fill="#f7ead2" font-family="Georgia, Times New Roman, serif" font-size="40" font-weight="700">Jason's</text>
  <text x="${pw / 2}" y="118" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="5.2">SOURDOUGH</text>
  <text x="${pw / 2}" y="448" text-anchor="middle" fill="#f7ead2" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" letter-spacing="1.8">GRAINS &amp; SEEDS</text>
  <text x="${pw / 2}" y="470" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="2.6">TASTE THE MAGIC</text>
  <rect x="${pw / 2 - 78}" y="484" width="156" height="26" rx="2" fill="#C9A227"/>
  <text x="${pw / 2}" y="502" text-anchor="middle" fill="#3a1830" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.4">RECIPE NO 11</text>
  <text x="${pw / 2}" y="538" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8">24 OZ</text>
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
    .rotate(-1.4, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
  const top = Math.round((800 - rotMeta.height) / 2) - 8;
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
  console.log("composed 9 from mauve bakery bag + photographic seeded crumb window");
}

if (only === "all" || only === "books") {
  await composeHardcovers();
  console.log("composed 17 from hardcover pack photography");
}

if (only === "all" || only === "photos") {
  await composePhotoTiles();
  console.log("composed 13 + 22 from pack photography");
}
