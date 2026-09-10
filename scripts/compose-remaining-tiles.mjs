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
  const titleSize = title.length > 12 ? Math.round(w * 0.11) : Math.round(w * 0.13);
  const line2Size = Math.round(w * 0.1);
  const band = Math.round(h * 0.3);
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#F6F3EA"/>
  <rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#C9C2B0" stroke-width="1.25"/>
  <rect width="${w}" height="${band}" fill="${fill}"/>
  <text x="${w / 2}" y="${band * 0.48}" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.105)}" font-weight="800">KIRKLAND</text>
  <text x="${w / 2}" y="${band * 0.78}" text-anchor="middle" fill="#F3E3A3" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.048)}" letter-spacing="2.2" font-weight="700">SIGNATURE</text>
  <line x1="14" y1="${band + 8}" x2="${w - 14}" y2="${band + 8}" stroke="#C9A227" stroke-width="1.5"/>
  <text x="${w / 2}" y="${h * 0.52}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="800">${xml(title)}</text>
  ${line2 ? `<text x="${w / 2}" y="${h * 0.68}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, Helvetica, sans-serif" font-size="${line2Size}" font-weight="800">${xml(line2)}</text>` : ""}
  ${size ? `<text x="${w / 2}" y="${h * 0.88}" text-anchor="middle" fill="#5a564c" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(w * 0.055)}" font-weight="700">${xml(size)}</text>` : ""}
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
      fill: "#1B5E20",
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
      fill: "#5D4037",
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
  // Recipe No 11: head-on mauve kraft sack, folded lip, loaf window.
  // Paper fiber only — never dest-in a competing bag.
  const PAPER =
    "https://raw.githubusercontent.com/prabhasp/ali-khasro/master/lokta/paper2.jpg";
  const crumbShot = await download(
    "https://user-images.githubusercontent.com/15069517/151712105-4d4076e5-3871-4c6b-89a0-40c0bdf22248.jpg"
  );
  const paperBytes = await download(PAPER);

  const pw = 360;
  const ph = 640;
  const paperGrey = await sharp(paperBytes)
    .resize(pw, ph, { fit: "cover", position: "centre" })
    .greyscale()
    .normalize()
    .modulate({ brightness: 1.26, saturation: 0.28 })
    .sharpen(1.5)
    .removeAlpha()
    .toBuffer();
  const mauveWash = await sharp({
    create: {
      width: pw,
      height: ph,
      channels: 3,
      background: { r: 164, g: 104, b: 118 },
    },
  })
    .jpeg()
    .toBuffer();
  const paper = await sharp(paperGrey)
    .composite([{ input: mauveWash, blend: "multiply" }])
    .modulate({ brightness: 1.12 })
    .removeAlpha()
    .toBuffer();

  // Soft sack: slightly bowed sides, rolled lip, folded bottom.
  const bagD = `M36,58
    C28,52 28,40 42,34
    C88,18 180,22 248,16
    C300,20 328,28 330,42
    C334,52 328,62 324,70
    L328,92
    C336,160 338,320 332,500
    C330,560 328,590 300,604
    L60,604
    C32,590 28,560 28,500
    C22,320 24,160 32,92
    L36,58 Z`;

  const bagMask = await sharp(svg(pw, ph, `<path fill="#fff" d="${bagD}"/>`))
    .png()
    .toBuffer();

  const lighting = svg(
    pw,
    ph,
    `
  <defs>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2a1020" stop-opacity="0.2"/>
      <stop offset="0.2" stop-color="#fff6ea" stop-opacity="0.18"/>
      <stop offset="0.55" stop-color="#fff6ea" stop-opacity="0"/>
      <stop offset="1" stop-color="#2a1020" stop-opacity="0.22"/>
    </linearGradient>
  </defs>
  <rect width="${pw}" height="${ph}" fill="url(#sheen)"/>
  <rect x="28" y="16" width="304" height="78" fill="#3a1830" fill-opacity="0.14"/>
  <path d="M48,38 C110,26 180,32 250,24 C290,28 318,34 322,44" fill="none" stroke="#3a1830" stroke-opacity="0.22" stroke-width="3"/>
  <path d="M44,54 C120,42 200,48 260,40 C300,44 320,50 324,58" fill="none" stroke="#3a1830" stroke-opacity="0.14" stroke-width="2"/>
  <path d="M40,592 L320,592" fill="none" stroke="#3a1830" stroke-opacity="0.16" stroke-width="2"/>
  <path d="M48,604 L312,604" fill="none" stroke="#3a1830" stroke-opacity="0.1" stroke-width="2"/>
`
  );

  const body = await sharp(paper)
    .composite([{ input: lighting, blend: "over" }])
    .removeAlpha()
    .toBuffer();
  const bagAlpha = await sharp(bagMask).extractChannel("alpha").toBuffer();
  const film = await sharp(body).joinChannel(bagAlpha).png().toBuffer();

  const winW = 236;
  const winH = 252;
  const winX = Math.round((pw - winW) / 2);
  const winY = 148;
  const loaf = await sharp(crumbShot)
    .extract({ left: 1420, top: 480, width: 1960, height: 1680 })
    .resize(winW, winH, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const windowMask = await sharp(
    svg(winW, winH, `<rect width="${winW}" height="${winH}" rx="3" ry="3" fill="#fff"/>`)
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
    <rect width="${winW}" height="${winH}" rx="3" fill="url(#film)"/>
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
  <rect x="${winX - 5}" y="${winY - 5}" width="${winW + 10}" height="${winH + 10}" rx="4" fill="#4a2434"/>
  <text x="${pw / 2}" y="108" text-anchor="middle" fill="#f7ead2" font-family="Georgia, Times New Roman, serif" font-size="40" font-weight="700">Jason's</text>
  <text x="${pw / 2}" y="132" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="5.2">SOURDOUGH</text>
  <text x="${pw / 2}" y="434" text-anchor="middle" fill="#f7ead2" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" letter-spacing="1.8">GRAINS &amp; SEEDS</text>
  <text x="${pw / 2}" y="456" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="2.6">TASTE THE MAGIC</text>
  <rect x="${pw / 2 - 78}" y="470" width="156" height="26" rx="2" fill="#C9A227"/>
  <text x="${pw / 2}" y="488" text-anchor="middle" fill="#3a1830" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.4">RECIPE NO 11</text>
  <rect x="78" y="36" width="204" height="28" rx="2" fill="#C9A227"/>
  <text x="${pw / 2}" y="55" text-anchor="middle" fill="#3a1830" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.6">RESEAL TO KEEP FRESH</text>
  <text x="${pw / 2}" y="548" text-anchor="middle" fill="#f0d8c8" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8">24 OZ</text>
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
    .rotate(-1.6, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const rotMeta = await sharp(rotated).metadata();
  const shadow = await sharp(
    svg(
      rotMeta.width,
      64,
      `<ellipse cx="${rotMeta.width / 2}" cy="34" rx="${rotMeta.width * 0.26}" ry="10" fill="#000" fill-opacity="0.16"/>`
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
