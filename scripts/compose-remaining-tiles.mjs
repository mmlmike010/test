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

function studio(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#ffffff"/>
  <defs>
    <filter id="floor" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#1a1a1a" flood-opacity="0.16"/>
    </filter>
    <linearGradient id="purpleBag" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4a1d6a"/>
      <stop offset="0.45" stop-color="#6b2d86"/>
      <stop offset="1" stop-color="#3b1658"/>
    </linearGradient>
    <linearGradient id="loaf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e8c99a"/>
      <stop offset="0.55" stop-color="#c9a066"/>
      <stop offset="1" stop-color="#8d6230"/>
    </linearGradient>
  </defs>
  <g filter="url(#floor)">${inner}</g>
</svg>`;
}

const studioPacks = {
  9: studio(`
    <path d="M236 168 C236 148 262 136 292 136 L508 136 C538 136 564 148 564 168 L584 548 C584 582 556 608 522 608 L278 608 C244 608 216 582 216 548 Z" fill="url(#purpleBag)"/>
    <path d="M250 176 C250 164 268 156 290 156 L510 156 C532 156 550 164 550 176 L568 540 C568 566 546 586 520 586 L280 586 C254 586 232 566 232 540 Z" fill="#5c2478"/>
    <rect x="268" y="248" width="264" height="168" rx="10" fill="#2a0f3d"/>
    <rect x="276" y="256" width="248" height="152" rx="8" fill="url(#loaf)"/>
    <ellipse cx="400" cy="318" rx="108" ry="36" fill="#d4a574" opacity=".85"/>
    <path d="M292 300 Q400 248 508 300" fill="none" stroke="#8d6230" stroke-width="5"/>
    <path d="M308 328 Q400 286 492 328" fill="none" stroke="#6d4c28" stroke-width="3"/>
    <circle cx="348" cy="334" r="4" fill="#4e342e"/>
    <circle cx="400" cy="348" r="3.5" fill="#5d4037"/>
    <circle cx="452" cy="330" r="4" fill="#4e342e"/>
    <circle cx="376" cy="366" r="3" fill="#3e2723"/>
    <circle cx="428" cy="370" r="3.2" fill="#4e342e"/>
    <text x="400" y="214" text-anchor="middle" fill="#f4e8c8" font-family="Georgia, Times New Roman, serif" font-size="42" font-weight="700">Jason's</text>
    <text x="400" y="454" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" letter-spacing="3">SOURDOUGH</text>
    <text x="400" y="486" text-anchor="middle" fill="#e8d5a3" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700">GRAINS &amp; SEEDS</text>
    <text x="400" y="548" text-anchor="middle" fill="#c9b8d8" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700">CIABATTIN · 580g</text>
  `),
  17: studio(`
    <rect x="214" y="236" width="168" height="250" rx="3" fill="#153e75" transform="rotate(-8 298 361)"/>
    <rect x="228" y="250" width="140" height="18" fill="#9ec5f0" transform="rotate(-8 298 259)"/>
    <rect x="318" y="210" width="168" height="268" rx="3" fill="#8B1E1E"/>
    <rect x="332" y="226" width="140" height="18" fill="#f5c6c6"/>
    <rect x="268" y="268" width="176" height="262" rx="3" fill="#1f4d2a"/>
    <rect x="282" y="284" width="148" height="18" fill="#c8e6c9"/>
    <rect x="268" y="430" width="176" height="36" fill="#E31837"/>
    <text x="356" y="454" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800">COSTCO · 3 HARDCOVERS</text>
    <text x="400" y="572" text-anchor="middle" fill="#444444" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700">BESTSELLER MIX</text>
  `),
};

function svg(w, h, inner) {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${inner}
</svg>`);
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

for (const [id, markup] of Object.entries(studioPacks)) {
  await sharp(Buffer.from(markup)).png({ compressionLevel: 8 }).toFile(join(dir, `${id}.png`));
  console.log("studio", id);
}

await composePhotoTiles();
console.log("composed 13 + 22 from pack photography");
