import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

function frame(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <defs>
    <filter id="pack" x="-25%" y="-15%" width="150%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#1a1a1a" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g filter="url(#pack)">${inner}</g>
</svg>`;
}

function kirkLabel(x, y, w, h, title, sub, color = "#005DAA") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>
    <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="1.2">KIRKLAND</text>
    <text x="${x + w / 2}" y="${y + 38}" text-anchor="middle" fill="#c5d8ea" font-family="Arial, Helvetica, sans-serif" font-size="8" letter-spacing="2.4">SIGNATURE</text>
    <text x="${x + w / 2}" y="${y + 62}" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">${title}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + 80}" text-anchor="middle" fill="#e8f2fa" font-family="Arial, Helvetica, sans-serif" font-size="10">${sub}</text>` : ""}`;
}

const packs = {
  1: frame(`<rect x="118" y="70" width="164" height="230" rx="6" fill="#005DAA"/>
    <rect x="128" y="150" width="144" height="138" fill="#f4e4c4"/>
    <circle cx="168" cy="200" r="16" fill="#7a1f3d"/>
    <circle cx="198" cy="188" r="14" fill="#3b1d12"/>
    <circle cx="228" cy="204" r="15" fill="#9b2d4a"/>
    <circle cx="188" cy="228" r="12" fill="#5c3317"/>
    <circle cx="220" cy="236" r="11" fill="#7a1f3d"/>
    ${kirkLabel(118, 70, 164, 80, "GRANOLA", "Organic Berry")}
    <rect x="118" y="70" width="28" height="230" fill="url(#shine)"/>`),
  2: frame(`<rect x="112" y="88" width="176" height="200" rx="10" fill="#6d4c41"/>
    <ellipse cx="200" cy="210" rx="62" ry="38" fill="#e8c99a"/>
    <ellipse cx="168" cy="200" rx="20" ry="12" fill="#c4a062"/>
    <ellipse cx="200" cy="192" rx="18" ry="11" fill="#8b5a2b"/>
    <ellipse cx="232" cy="202" rx="17" ry="10" fill="#e8c99a"/>
    <ellipse cx="186" cy="220" rx="15" ry="9" fill="#6b3f1f"/>
    ${kirkLabel(112, 88, 176, 72, "MIXED NUTS", "3 lb")}
    <rect x="112" y="88" width="30" height="200" fill="url(#shine)"/>`),
  3: frame(`<rect x="138" y="78" width="124" height="230" rx="8" fill="#b71c1c"/>
    <rect x="146" y="150" width="108" height="120" fill="#f3e5d4"/>
    <circle cx="200" cy="210" r="32" fill="#e74c3c"/>
    <circle cx="188" cy="200" r="8" fill="#f5b7b1"/>
    <rect x="138" y="78" width="124" height="64" fill="#8e1b1b"/>
    <text x="200" y="108" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">HUNT'S</text>
    <text x="200" y="128" text-anchor="middle" fill="#ffcdd2" font-family="Arial" font-size="11">DICED TOMATOES</text>
    <rect x="138" y="78" width="22" height="230" fill="url(#shine)"/>`),
  4: frame(`<rect x="168" y="58" width="64" height="28" rx="6" fill="#5d4037"/>
    <rect x="158" y="86" width="84" height="230" rx="10" fill="#b71c1c"/>
    <rect x="170" y="118" width="60" height="100" fill="#f5e6c8"/>
    <text x="200" y="150" text-anchor="middle" fill="#b71c1c" font-family="Arial" font-size="13" font-weight="700">MUTTI</text>
    <text x="200" y="170" text-anchor="middle" fill="#333" font-family="Arial" font-size="10">TOMATO BASIL</text>
    <ellipse cx="200" cy="248" rx="16" ry="9" fill="#2e7d32"/>
    <rect x="158" y="86" width="16" height="230" fill="url(#shine)"/>`),
  5: frame(`<rect x="108" y="150" width="184" height="118" rx="18" fill="#e8c57a"/>
    <ellipse cx="200" cy="198" rx="58" ry="22" fill="#d4a017"/>
    <rect x="150" y="96" width="100" height="58" rx="6" fill="#005DAA"/>
    <text x="200" y="122" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">SABRA</text>
    <text x="200" y="140" text-anchor="middle" fill="#c5d8ea" font-family="Arial" font-size="10">HUMMUS CLASSIC</text>
    <rect x="108" y="256" width="184" height="14" rx="3" fill="#c9a227"/>`),
  6: frame(`<rect x="128" y="78" width="144" height="230" rx="16" fill="#5d4037"/>
    <rect x="140" y="150" width="120" height="90" rx="8" fill="#efebe9"/>
    <circle cx="170" cy="186" r="16" fill="#c9a66b"/>
    <circle cx="210" cy="192" r="14" fill="#8d6e63"/>
    <circle cx="190" cy="210" r="12" fill="#a1887f"/>
    ${kirkLabel(128, 78, 144, 72, "LENTILS", "&amp; Chickpeas")}
    <rect x="128" y="78" width="24" height="230" fill="url(#shine)"/>`),
  7: frame(`<rect x="118" y="110" width="164" height="176" rx="12" fill="#ffffff" stroke="#cfd8dc" stroke-width="2"/>
    <rect x="118" y="110" width="164" height="40" rx="12" fill="#2e7d32"/>
    <rect x="118" y="134" width="164" height="16" fill="#2e7d32"/>
    <text x="200" y="136" text-anchor="middle" fill="#fff" font-family="Arial" font-size="14" font-weight="700">5 BEAN SALAD</text>
    <ellipse cx="160" cy="200" rx="20" ry="13" fill="#c0392b"/>
    <ellipse cx="200" cy="214" rx="18" ry="12" fill="#6d4c41"/>
    <ellipse cx="238" cy="198" rx="19" ry="13" fill="#f4d03f"/>
    <ellipse cx="190" cy="240" rx="16" ry="11" fill="#1e8449"/>`),
  8: frame(`<rect x="130" y="90" width="140" height="210" rx="14" fill="#eceff1"/>
    <rect x="130" y="90" width="140" height="58" fill="#005DAA"/>
    <text x="200" y="124" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">CHOBANI</text>
    <text x="200" y="144" text-anchor="middle" fill="#bbdefb" font-family="Arial" font-size="10">GREEK YOGURT</text>
    <ellipse cx="200" cy="210" rx="46" ry="18" fill="#fff8e1"/>
    <rect x="130" y="282" width="140" height="18" fill="#90a4ae"/>
    <rect x="130" y="90" width="22" height="210" fill="url(#shine)"/>`),
  9: frame(`<ellipse cx="200" cy="250" rx="118" ry="40" fill="#c9a66b"/>
    <ellipse cx="200" cy="210" rx="116" ry="56" fill="#e8c99a"/>
    <path d="M100 210 Q200 150 300 210" fill="none" stroke="#b08950" stroke-width="4"/>
    <path d="M112 228 Q200 180 288 228" fill="none" stroke="#a67c3d" stroke-width="3"/>
    <circle cx="158" cy="198" r="5" fill="#5d4037"/>
    <circle cx="236" cy="190" r="4" fill="#5d4037"/>
    <circle cx="200" cy="216" r="4" fill="#6d4c41"/>
    <text x="200" y="92" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="16" font-weight="700">SOURDOUGH</text>
    <text x="200" y="114" text-anchor="middle" fill="#8d6e63" font-family="Arial" font-size="12">GRAINS &amp; SEEDS</text>`),
  10: frame(`<rect x="176" y="52" width="48" height="32" rx="6" fill="#3e2723"/>
    <rect x="166" y="84" width="68" height="240" rx="8" fill="#1b5e20"/>
    <rect x="176" y="118" width="48" height="130" fill="#f5e6c8"/>
    ${kirkLabel(166, 84, 68, 88, "OLIVE", "OIL")}
    <ellipse cx="200" cy="270" rx="12" ry="22" fill="#9ccc65" opacity=".75"/>
    <rect x="166" y="84" width="14" height="240" fill="url(#shine)"/>`),
  11: frame(`<path d="M122 300 L150 78 L250 78 L278 300 Z" fill="#f5e6c8"/>
    <rect x="150" y="78" width="100" height="28" fill="#6d4c41"/>
    ${kirkLabel(158, 118, 84, 88, "QUINOA", "Organic")}
    <ellipse cx="176" cy="240" rx="7" ry="5" fill="#c4a062"/>
    <ellipse cx="208" cy="252" rx="7" ry="5" fill="#a1887f"/>
    <ellipse cx="190" cy="268" rx="6" ry="4" fill="#8d6e63"/>`),
  12: frame(`<rect x="108" y="100" width="184" height="196" rx="14" fill="#efebe9"/>
    <rect x="108" y="100" width="184" height="56" fill="#E31837"/>
    <text x="200" y="126" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">TRAIL MIX</text>
    <text x="200" y="146" text-anchor="middle" fill="#ffcdd2" font-family="Arial" font-size="11">KIRKLAND SIGNATURE</text>
    <circle cx="155" cy="210" r="16" fill="#6d4c41"/>
    <circle cx="190" cy="198" r="14" fill="#c0392b"/>
    <circle cx="226" cy="214" r="15" fill="#f4d03f"/>
    <circle cx="255" cy="200" r="12" fill="#8d6e63"/>
    <circle cx="176" cy="238" r="11" fill="#3e2723"/>
    <circle cx="214" cy="246" r="12" fill="#c4a062"/>`),
  13: frame(`<rect x="78" y="130" width="244" height="150" rx="18" fill="#37474f"/>
    <rect x="100" y="150" width="200" height="110" rx="10" fill="#546e7a"/>
    <rect x="124" y="172" width="90" height="66" rx="6" fill="#90a4ae"/>
    <text x="200" y="108" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="16" font-weight="700">CAR SEAT PROTECTOR</text>`),
  14: frame(`<rect x="122" y="70" width="156" height="250" rx="10" fill="#ffffff" stroke="#b3e5fc" stroke-width="2"/>
    <rect x="122" y="70" width="156" height="58" fill="#4fc3f7"/>
    <text x="200" y="106" text-anchor="middle" fill="#01579b" font-family="Arial" font-size="18" font-weight="700">WIPES</text>
    <rect x="142" y="150" width="116" height="16" fill="#e1f5fe"/>
    <rect x="142" y="176" width="116" height="16" fill="#e1f5fe"/>
    <rect x="142" y="202" width="116" height="16" fill="#e1f5fe"/>
    <text x="200" y="280" text-anchor="middle" fill="#0277bd" font-family="Arial" font-size="14" font-weight="700">12-PACK</text>`),
  15: frame(`<path d="M78 250 Q140 140 200 200 Q260 140 322 250 Z" fill="#c47a3a"/>
    <path d="M100 248 Q150 178 200 214 Q250 178 300 248" fill="#6d4c41"/>
    <ellipse cx="200" cy="258" rx="118" ry="24" fill="#e8c99a"/>
    <text x="200" y="92" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="16" font-weight="700">CROISSANTS</text>
    <text x="200" y="114" text-anchor="middle" fill="#8d6e63" font-family="Arial" font-size="12">CHOCOLATE · 12 CT</text>`),
  16: frame(`<rect x="176" y="48" width="48" height="28" rx="4" fill="#4a148c"/>
    <path d="M166 76 L234 76 L222 318 L178 318 Z" fill="#4a148c"/>
    <path d="M178 112 L222 112 L214 286 L186 286 Z" fill="#6a1b9a"/>
    <rect x="186" y="130" width="28" height="80" fill="#f5e6c8"/>
    <text x="200" y="164" text-anchor="middle" fill="#4a148c" font-family="Arial" font-size="9" font-weight="700">CAB</text>
    <text x="200" y="178" text-anchor="middle" fill="#4a148c" font-family="Arial" font-size="8">1.5L</text>
    <rect x="166" y="76" width="14" height="242" fill="url(#shine)"/>`),
  17: frame(`<rect x="96" y="100" width="84" height="118" fill="#1565c0"/>
    <rect x="106" y="112" width="64" height="16" fill="#bbdefb"/>
    <rect x="168" y="118" width="84" height="118" fill="#c62828"/>
    <rect x="178" y="130" width="64" height="16" fill="#ffcdd2"/>
    <rect x="132" y="176" width="84" height="118" fill="#2e7d32"/>
    <rect x="142" y="188" width="64" height="16" fill="#c8e6c9"/>
    <text x="200" y="330" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="14" font-weight="700">HARDCOVER MIX</text>`),
  18: frame(`<rect x="128" y="140" width="144" height="100" rx="16" fill="#263238"/>
    <circle cx="200" cy="190" r="32" fill="#455a64"/>
    <circle cx="200" cy="190" r="20" fill="#90caf9"/>
    <circle cx="200" cy="190" r="8" fill="#0d47a1"/>
    <rect x="248" y="150" width="18" height="12" rx="2" fill="#ff8f00"/>
    <text x="200" y="292" text-anchor="middle" fill="#37474f" font-family="Arial" font-size="16" font-weight="700">4K ACTION CAMERA</text>`),
  19: frame(`<rect x="148" y="62" width="104" height="40" rx="8" fill="#0277bd"/>
    <rect x="140" y="100" width="120" height="220" rx="12" fill="#0288d1"/>
    <rect x="156" y="132" width="88" height="86" fill="#e1f5fe"/>
    <text x="200" y="168" text-anchor="middle" fill="#01579b" font-family="Arial" font-size="12" font-weight="700">KIRKLAND</text>
    <text x="200" y="188" text-anchor="middle" fill="#0277bd" font-family="Arial" font-size="11">170 LOADS</text>
    <rect x="172" y="248" width="56" height="20" rx="4" fill="#01579b"/>
    <rect x="140" y="100" width="20" height="220" fill="url(#shine)"/>`),
  20: frame(`<rect x="118" y="150" width="52" height="100" rx="10" fill="#37474f"/>
    <rect x="174" y="138" width="52" height="100" rx="10" fill="#546e7a"/>
    <rect x="230" y="150" width="52" height="100" rx="10" fill="#37474f"/>
    <rect x="128" y="144" width="32" height="12" rx="3" fill="#cfd8dc"/>
    <rect x="184" y="132" width="32" height="12" rx="3" fill="#cfd8dc"/>
    <rect x="240" y="144" width="32" height="12" rx="3" fill="#cfd8dc"/>
    <text x="200" y="292" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="16" font-weight="700">MERINO SOCKS</text>
    <text x="200" y="314" text-anchor="middle" fill="#78909c" font-family="Arial" font-size="12">6-PACK</text>`),
  21: frame(`<rect x="132" y="72" width="136" height="240" rx="8" fill="#4e342e"/>
    <rect x="144" y="96" width="112" height="84" fill="#efebe9"/>
    <text x="200" y="128" text-anchor="middle" fill="#4e342e" font-family="Arial" font-size="13" font-weight="700">KIRKLAND</text>
    <text x="200" y="150" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="12">COLOMBIAN</text>
    <ellipse cx="200" cy="222" rx="18" ry="12" fill="#3e2723"/>
    <ellipse cx="182" cy="244" rx="12" ry="8" fill="#5d4037"/>
    <ellipse cx="218" cy="244" rx="12" ry="8" fill="#5d4037"/>
    <text x="200" y="286" text-anchor="middle" fill="#d7ccc8" font-family="Arial" font-size="14" font-weight="700">3 LB</text>
    <rect x="132" y="72" width="22" height="240" fill="url(#shine)"/>`),
  22: frame(`<rect x="96" y="118" width="208" height="148" rx="12" fill="#263238"/>
    <rect x="110" y="132" width="180" height="120" rx="8" fill="#37474f"/>
    <rect x="130" y="152" width="140" height="80" rx="4" fill="#90caf9" opacity=".35"/>
    <text x="200" y="308" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="16" font-weight="700">LAPTOP SLEEVE</text>`),
  23: frame(`<rect x="108" y="96" width="184" height="200" rx="10" fill="#fff8e1"/>
    <rect x="108" y="96" width="184" height="42" fill="#f9a825"/>
    <text x="200" y="124" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">EGGS 24 CT</text>
    <ellipse cx="158" cy="190" rx="18" ry="24" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="200" cy="186" rx="18" ry="24" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="242" cy="190" rx="18" ry="24" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="178" cy="236" rx="18" ry="24" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="222" cy="236" rx="18" ry="24" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>`),
  24: frame(`<ellipse cx="200" cy="268" rx="100" ry="40" fill="#d7ccc8"/>
    <ellipse cx="200" cy="198" rx="78" ry="92" fill="#ef9a49"/>
    <ellipse cx="200" cy="168" rx="52" ry="44" fill="#e07b39"/>
    <path d="M156 142 Q200 108 244 142" fill="#c96a2b"/>
    <ellipse cx="172" cy="186" rx="12" ry="7" fill="#fff3e0" opacity=".5"/>
    <text x="200" y="340" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="15" font-weight="700">ROTISSERIE CHICKEN</text>`),
};

const cats = {
  treasure: "12",
  trending: "2",
  new: "1",
  weekly: "4",
  kirkland: "21",
  recipes: "10",
  catering: "5",
};

for (const [id, markup] of Object.entries(packs)) {
  const svgPath = join(dir, `${id}.svg`);
  const pngPath = join(dir, `${id}.png`);
  writeFileSync(svgPath, markup);
  await sharp(Buffer.from(markup)).png().toFile(pngPath);
}
for (const [id, src] of Object.entries(cats)) {
  await sharp(join(dir, `${src}.png`)).resize(200, 200).png().toFile(join(dir, `cat-${id}.png`));
}
console.log(`wrote ${Object.keys(packs).length} pack shots + ${Object.keys(cats).length} category tiles`);
