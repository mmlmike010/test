import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "products");
mkdirSync(dir, { recursive: true });

function svg(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#ffffff"/>
  <g transform="translate(200 200) scale(1.55) translate(-200 -200)">
  ${body}
  </g>
</svg>`;
}

function cat(bg, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="${bg}"/>
  ${body}
</svg>`;
}

const art = {
  1: svg(`<ellipse cx="200" cy="250" rx="130" ry="70" fill="#c4a574"/>
    <ellipse cx="200" cy="240" rx="120" ry="58" fill="#e8c99a"/>
    <circle cx="150" cy="220" r="16" fill="#7a1f3d"/>
    <circle cx="190" cy="205" r="14" fill="#3b1d12"/>
    <circle cx="230" cy="218" r="15" fill="#9b2d4a"/>
    <circle cx="170" cy="248" r="12" fill="#5c3317"/>
    <circle cx="250" cy="246" r="13" fill="#7a1f3d"/>
    <circle cx="210" cy="260" r="11" fill="#3b1d12"/>
    <rect x="155" y="120" width="90" height="70" rx="8" fill="#005DAA"/>
    <text x="200" y="152" text-anchor="middle" fill="#fff" font-family="Arial" font-size="13" font-weight="700">KIRKLAND</text>
    <text x="200" y="172" text-anchor="middle" fill="#fff" font-family="Arial" font-size="11">GRANOLA</text>`),
  2: svg(`<ellipse cx="200" cy="255" rx="125" ry="55" fill="#d8b56a"/>
    <ellipse cx="155" cy="230" rx="28" ry="18" fill="#c4a062" transform="rotate(-20 155 230)"/>
    <ellipse cx="200" cy="220" rx="26" ry="16" fill="#8b5a2b"/>
    <ellipse cx="245" cy="232" rx="24" ry="15" fill="#e8c99a"/>
    <ellipse cx="175" cy="255" rx="22" ry="14" fill="#6b3f1f"/>
    <ellipse cx="230" cy="258" rx="25" ry="16" fill="#c4a062"/>
    <circle cx="200" cy="248" r="10" fill="#3d2a14"/>
    <rect x="150" y="118" width="100" height="64" rx="6" fill="#E31837"/>
    <text x="200" y="148" text-anchor="middle" fill="#fff" font-family="Arial" font-size="13" font-weight="700">KIRKLAND</text>
    <text x="200" y="168" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12">MIXED NUTS</text>`),
  3: svg(`<rect x="145" y="110" width="110" height="190" rx="8" fill="#c0392b"/>
    <rect x="152" y="118" width="96" height="50" fill="#f4f1ea"/>
    <text x="200" y="140" text-anchor="middle" fill="#c0392b" font-family="Arial" font-size="11" font-weight="700">HUNT'S</text>
    <text x="200" y="158" text-anchor="middle" fill="#333" font-family="Arial" font-size="10">DICED</text>
    <circle cx="200" cy="210" r="28" fill="#e74c3c"/>
    <circle cx="188" cy="204" r="8" fill="#f5b7b1"/>
    <rect x="145" y="288" width="110" height="14" fill="#922b21"/>`),
  4: svg(`<rect x="160" y="90" width="80" height="28" rx="6" fill="#8d6e63"/>
    <rect x="155" y="118" width="90" height="200" rx="10" fill="#b71c1c"/>
    <rect x="168" y="140" width="64" height="90" fill="#f5e6c8"/>
    <text x="200" y="168" text-anchor="middle" fill="#b71c1c" font-family="Arial" font-size="10" font-weight="700">MUTTI</text>
    <text x="200" y="186" text-anchor="middle" fill="#333" font-family="Arial" font-size="9">TOMATO</text>
    <text x="200" y="200" text-anchor="middle" fill="#333" font-family="Arial" font-size="9">BASIL</text>
    <ellipse cx="200" cy="248" rx="18" ry="10" fill="#2e7d32"/>`),
  5: svg(`<rect x="105" y="155" width="190" height="120" rx="18" fill="#e8c57a"/>
    <ellipse cx="200" cy="205" rx="58" ry="24" fill="#d4a017"/>
    <rect x="155" y="100" width="90" height="56" rx="6" fill="#005DAA"/>
    <text x="200" y="134" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">SABRA</text>
    <rect x="105" y="268" width="190" height="16" rx="3" fill="#c9a227"/>`),
  6: svg(`<rect x="140" y="120" width="120" height="170" rx="18" fill="#6d4c41"/>
    <rect x="150" y="132" width="100" height="80" rx="8" fill="#efebe9"/>
    <circle cx="175" cy="168" r="14" fill="#c9a66b"/>
    <circle cx="210" cy="175" r="12" fill="#8d6e63"/>
    <circle cx="192" cy="190" r="11" fill="#a1887f"/>
    <text x="200" y="240" text-anchor="middle" fill="#fff" font-family="Arial" font-size="11" font-weight="700">LENTILS</text>
    <text x="200" y="258" text-anchor="middle" fill="#f5e6c8" font-family="Arial" font-size="10">&amp; CHICKPEAS</text>`),
  7: svg(`<rect x="125" y="140" width="150" height="130" rx="12" fill="#fff"/>
    <rect x="125" y="140" width="150" height="28" rx="12" fill="#2e7d32"/>
    <rect x="125" y="156" width="150" height="12" fill="#2e7d32"/>
    <ellipse cx="165" cy="210" rx="18" ry="12" fill="#c0392b"/>
    <ellipse cx="200" cy="220" rx="16" ry="11" fill="#6d4c41"/>
    <ellipse cx="235" cy="208" rx="17" ry="12" fill="#f4d03f"/>
    <ellipse cx="190" cy="240" rx="15" ry="10" fill="#1e8449"/>
    <text x="200" y="160" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="700">5 BEAN</text>`),
  8: svg(`<rect x="130" y="115" width="140" height="175" rx="14" fill="#eceff1"/>
    <rect x="130" y="115" width="140" height="48" fill="#005DAA"/>
    <text x="200" y="146" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="700">CHOBANI</text>
    <ellipse cx="200" cy="215" rx="48" ry="20" fill="#fff8e1"/>
    <rect x="130" y="274" width="140" height="16" fill="#90a4ae"/>`),
  9: svg(`<ellipse cx="200" cy="230" rx="110" ry="36" fill="#c9a66b"/>
    <ellipse cx="200" cy="210" rx="108" ry="50" fill="#e8c99a"/>
    <path d="M110 210 Q200 160 290 210" fill="none" stroke="#b08950" stroke-width="3"/>
    <path d="M120 225 Q200 185 280 225" fill="none" stroke="#a67c3d" stroke-width="2"/>
    <circle cx="160" cy="200" r="4" fill="#5d4037"/>
    <circle cx="230" cy="195" r="3" fill="#5d4037"/>
    <circle cx="200" cy="215" r="3" fill="#6d4c41"/>`),
  10: svg(`<rect x="175" y="70" width="50" height="36" rx="6" fill="#3e2723"/>
    <rect x="168" y="106" width="64" height="210" rx="8" fill="#1b5e20"/>
    <rect x="178" y="130" width="44" height="120" fill="#f5e6c8"/>
    <text x="200" y="165" text-anchor="middle" fill="#1b5e20" font-family="Arial" font-size="9" font-weight="700">KIRKLAND</text>
    <text x="200" y="182" text-anchor="middle" fill="#333" font-family="Arial" font-size="8">OLIVE OIL</text>
    <ellipse cx="200" cy="230" rx="12" ry="20" fill="#9ccc65" opacity=".7"/>`),
  11: svg(`<path d="M130 300 L155 110 L245 110 L270 300 Z" fill="#f5e6c8"/>
    <rect x="155" y="110" width="90" height="24" fill="#8d6e63"/>
    <rect x="165" y="150" width="70" height="70" fill="#005DAA"/>
    <text x="200" y="180" text-anchor="middle" fill="#fff" font-family="Arial" font-size="11" font-weight="700">QUINOA</text>
    <text x="200" y="198" text-anchor="middle" fill="#fff" font-family="Arial" font-size="9">ORGANIC</text>
    <ellipse cx="180" cy="250" rx="6" ry="4" fill="#c4a062"/>
    <ellipse cx="210" cy="258" rx="6" ry="4" fill="#a1887f"/>
    <ellipse cx="195" cy="270" rx="5" ry="3" fill="#8d6e63"/>`),
  12: svg(`<rect x="120" y="140" width="160" height="130" rx="14" fill="#efebe9"/>
    <rect x="120" y="140" width="160" height="34" fill="#E31837"/>
    <text x="200" y="162" text-anchor="middle" fill="#fff" font-family="Arial" font-size="13" font-weight="700">TRAIL MIX</text>
    <circle cx="160" cy="210" r="12" fill="#6d4c41"/>
    <circle cx="190" cy="200" r="10" fill="#c0392b"/>
    <circle cx="220" cy="214" r="11" fill="#f4d03f"/>
    <circle cx="245" cy="202" r="9" fill="#8d6e63"/>
    <circle cx="175" cy="232" r="8" fill="#3e2723"/>
    <circle cx="210" cy="238" r="9" fill="#c4a062"/>`),
  13: svg(`<rect x="90" y="150" width="220" height="130" rx="18" fill="#37474f"/>
    <rect x="110" y="168" width="180" height="94" rx="8" fill="#546e7a"/>
    <rect x="130" y="188" width="80" height="54" rx="6" fill="#90a4ae"/>
    <text x="200" y="130" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="14" font-weight="700">CAR SEAT</text>
    <text x="200" y="310" text-anchor="middle" fill="#607d8b" font-family="Arial" font-size="12">PROTECTOR</text>`),
  14: svg(`<rect x="130" y="100" width="140" height="200" rx="10" fill="#fff"/>
    <rect x="130" y="100" width="140" height="48" fill="#4fc3f7"/>
    <text x="200" y="130" text-anchor="middle" fill="#01579b" font-family="Arial" font-size="13" font-weight="700">WIPES</text>
    <rect x="148" y="168" width="104" height="14" fill="#e1f5fe"/>
    <rect x="148" y="190" width="104" height="14" fill="#e1f5fe"/>
    <rect x="148" y="212" width="104" height="14" fill="#e1f5fe"/>
    <text x="200" y="270" text-anchor="middle" fill="#0277bd" font-family="Arial" font-size="12">12-PACK</text>`),
  15: svg(`<path d="M90 250 Q140 160 200 210 Q260 160 310 250 Z" fill="#c47a3a"/>
    <path d="M110 248 Q150 190 200 220 Q250 190 290 248" fill="#6d4c41"/>
    <ellipse cx="200" cy="255" rx="110" ry="22" fill="#e8c99a"/>
    <text x="200" y="120" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="14" font-weight="700">CROISSANTS</text>
    <text x="200" y="310" text-anchor="middle" fill="#8d6e63" font-family="Arial" font-size="12">12 CT</text>`),
  16: svg(`<rect x="175" y="68" width="50" height="30" rx="4" fill="#4a148c"/>
    <path d="M168 98 L232 98 L222 310 L178 310 Z" fill="#4a148c"/>
    <path d="M178 130 L222 130 L216 280 L184 280 Z" fill="#6a1b9a"/>
    <rect x="188" y="145" width="24" height="70" fill="#f5e6c8"/>
    <text x="200" y="175" text-anchor="middle" fill="#4a148c" font-family="Arial" font-size="8" font-weight="700">CAB</text>
    <text x="200" y="188" text-anchor="middle" fill="#4a148c" font-family="Arial" font-size="7">1.5L</text>`),
  17: svg(`<rect x="120" y="110" width="70" height="100" fill="#1565c0"/>
    <rect x="128" y="118" width="54" height="14" fill="#bbdefb"/>
    <rect x="195" y="120" width="70" height="100" fill="#c62828"/>
    <rect x="203" y="128" width="54" height="14" fill="#ffcdd2"/>
    <rect x="155" y="180" width="70" height="100" fill="#2e7d32"/>
    <rect x="163" y="188" width="54" height="14" fill="#c8e6c9"/>
    <text x="200" y="320" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="13" font-weight="700">HARDCOVER MIX</text>`),
  18: svg(`<rect x="145" y="150" width="110" height="80" rx="14" fill="#263238"/>
    <circle cx="200" cy="190" r="26" fill="#455a64"/>
    <circle cx="200" cy="190" r="16" fill="#90caf9"/>
    <circle cx="200" cy="190" r="7" fill="#0d47a1"/>
    <rect x="230" y="158" width="16" height="10" rx="2" fill="#ff8f00"/>
    <text x="200" y="280" text-anchor="middle" fill="#37474f" font-family="Arial" font-size="14" font-weight="700">4K CAMERA</text>`),
  19: svg(`<rect x="150" y="90" width="100" height="40" rx="8" fill="#0277bd"/>
    <rect x="145" y="128" width="110" height="190" rx="12" fill="#0288d1"/>
    <rect x="160" y="155" width="80" height="70" fill="#e1f5fe"/>
    <text x="200" y="185" text-anchor="middle" fill="#01579b" font-family="Arial" font-size="11" font-weight="700">KIRKLAND</text>
    <text x="200" y="204" text-anchor="middle" fill="#0277bd" font-family="Arial" font-size="10">170 LOADS</text>
    <rect x="175" y="250" width="50" height="18" rx="4" fill="#01579b"/>`),
  20: svg(`<rect x="130" y="160" width="50" height="90" rx="10" fill="#37474f"/>
    <rect x="175" y="150" width="50" height="90" rx="10" fill="#546e7a"/>
    <rect x="220" y="160" width="50" height="90" rx="10" fill="#37474f"/>
    <rect x="140" y="155" width="30" height="12" rx="3" fill="#cfd8dc"/>
    <rect x="185" y="145" width="30" height="12" rx="3" fill="#cfd8dc"/>
    <rect x="230" y="155" width="30" height="12" rx="3" fill="#cfd8dc"/>
    <text x="200" y="290" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="14" font-weight="700">MERINO SOCKS</text>
    <text x="200" y="310" text-anchor="middle" fill="#78909c" font-family="Arial" font-size="12">6-PACK</text>`),
  21: svg(`<rect x="145" y="100" width="110" height="200" rx="8" fill="#4e342e"/>
    <rect x="155" y="118" width="90" height="70" fill="#efebe9"/>
    <text x="200" y="148" text-anchor="middle" fill="#4e342e" font-family="Arial" font-size="11" font-weight="700">KIRKLAND</text>
    <text x="200" y="168" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="10">COLOMBIAN</text>
    <ellipse cx="200" cy="230" rx="16" ry="10" fill="#3e2723"/>
    <ellipse cx="185" cy="248" rx="10" ry="7" fill="#5d4037"/>
    <ellipse cx="215" cy="248" rx="10" ry="7" fill="#5d4037"/>
    <text x="200" y="280" text-anchor="middle" fill="#d7ccc8" font-family="Arial" font-size="12">3 LB</text>`),
  22: svg(`<rect x="110" y="130" width="180" height="130" rx="10" fill="#263238"/>
    <rect x="122" y="142" width="156" height="106" rx="6" fill="#37474f"/>
    <rect x="140" y="160" width="120" height="70" rx="4" fill="#90caf9" opacity=".35"/>
    <text x="200" y="300" text-anchor="middle" fill="#455a64" font-family="Arial" font-size="14" font-weight="700">LAPTOP SLEEVE</text>`),
  23: svg(`<rect x="115" y="120" width="170" height="160" rx="10" fill="#fff8e1"/>
    <rect x="115" y="120" width="170" height="32" fill="#f9a825"/>
    <text x="200" y="142" text-anchor="middle" fill="#fff" font-family="Arial" font-size="13" font-weight="700">EGGS 24 CT</text>
    <ellipse cx="160" cy="200" rx="16" ry="22" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="200" cy="198" rx="16" ry="22" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="240" cy="200" rx="16" ry="22" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="180" cy="240" rx="16" ry="22" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>
    <ellipse cx="220" cy="240" rx="16" ry="22" fill="#fffde7" stroke="#f0e68c" stroke-width="2"/>`),
  24: svg(`<ellipse cx="200" cy="250" rx="90" ry="36" fill="#d7ccc8"/>
    <ellipse cx="200" cy="200" rx="70" ry="85" fill="#ef9a49"/>
    <ellipse cx="200" cy="175" rx="48" ry="40" fill="#e07b39"/>
    <path d="M160 150 Q200 120 240 150" fill="#c96a2b"/>
    <ellipse cx="175" cy="190" rx="10" ry="6" fill="#fff3e0" opacity=".5"/>
    <text x="200" y="330" text-anchor="middle" fill="#6d4c41" font-family="Arial" font-size="13" font-weight="700">ROTISSERIE</text>`),
};

const cats = {
  treasure: cat(
    "#f4d03f",
    `<rect x="120" y="150" width="160" height="120" rx="10" fill="#f9e79f"/>
    <rect x="120" y="150" width="160" height="32" fill="#E31837"/>
    <rect x="185" y="118" width="30" height="50" fill="#c0392b"/>
    <text x="200" y="172" text-anchor="middle" fill="#fff" font-family="Arial" font-size="18" font-weight="700">HUNT</text>`
  ),
  trending: cat(
    "#e8f2fa",
    `<polyline points="70,280 150,190 195,220 280,100 340,130" fill="none" stroke="#005DAA" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="320,70 360,150 280,130" fill="#005DAA"/>`
  ),
  new: cat(
    "#005DAA",
    `<text x="200" y="220" text-anchor="middle" fill="#fff" font-family="Arial" font-size="64" font-weight="700">NEW</text>`
  ),
  weekly: cat(
    "#E31837",
    `<text x="200" y="185" text-anchor="middle" fill="#fff" font-family="Arial" font-size="36" font-weight="700">SAVE</text>
    <text x="200" y="230" text-anchor="middle" fill="#fff" font-family="Arial" font-size="22">THIS WEEK</text>`
  ),
  kirkland: cat(
    "#005DAA",
    `<text x="200" y="185" text-anchor="middle" fill="#fff" font-family="Arial" font-size="28" font-weight="700">KIRKLAND</text>
    <text x="200" y="225" text-anchor="middle" fill="#bbdefb" font-family="Arial" font-size="16" letter-spacing="4">SIGNATURE</text>`
  ),
  recipes: cat(
    "#efebe9",
    `<circle cx="200" cy="220" r="90" fill="#fff"/>
    <circle cx="200" cy="220" r="14" fill="#9e9e9e"/>
    <rect x="186" y="70" width="28" height="70" fill="#78909c"/>`
  ),
  catering: cat(
    "#eceff1",
    `<ellipse cx="200" cy="250" rx="140" ry="36" fill="#b0bec5"/>
    <ellipse cx="200" cy="215" rx="130" ry="70" fill="#fff"/>
    <circle cx="145" cy="210" r="22" fill="#e74c3c"/>
    <circle cx="200" cy="198" r="20" fill="#27ae60"/>
    <circle cx="255" cy="212" r="22" fill="#f4d03f"/>`
  ),
};

for (const [id, markup] of Object.entries(art)) {
  writeFileSync(join(dir, `${id}.svg`), markup);
}
for (const [id, markup] of Object.entries(cats)) {
  writeFileSync(join(dir, `cat-${id}.svg`), markup);
}
console.log(`wrote ${Object.keys(art).length} products + ${Object.keys(cats).length} categories`);
