import { join } from "node:path";
import sharp from "sharp";

const dir = join(process.cwd(), "public", "products");
const W = 1200;
const H = 900;
const JH =
  "https://raw.githubusercontent.com/jhaydter/recipes/main/docs/assets/images";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function plated(url, outName, position = "centre") {
  const bytes = await download(url);
  await sharp(bytes)
    .rotate()
    .resize(W, H, { fit: "cover", position })
    .sharpen({ sigma: 0.55 })
    .modulate({ brightness: 1.02, saturation: 1.03 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, outName));
  process.stdout.write(`wrote ${outName}\n`);
}

await plated(`${JH}/pasta-pomodoro.jpg`, "recipe-pasta.jpg");
await plated(`${JH}/hummus.jpg`, "recipe-board.jpg");
await plated(`${JH}/tomato-bruschetta.jpg`, "recipe-bruschetta.jpg", "south");
await plated(`${JH}/deviled-eggs.jpg`, "recipe-deviled.jpg");
await plated(`${JH}/dried-fruit-and-nut-mix.png`, "recipe-trail.jpg");

{
  const bytes = await download(`${JH}/roasted-tomato-soup.png`);
  const meta = await sharp(bytes).metadata();
  const width = meta.width || 850;
  const height = meta.height || 500;
  const left = Math.round(width * 0.52);
  await sharp(bytes)
    .extract({
      left,
      top: 0,
      width: width - left,
      height,
    })
    .resize(W, H, { fit: "cover", position: "east" })
    .sharpen({ sigma: 0.55 })
    .modulate({ brightness: 1.02, saturation: 1.03 })
    .jpeg({ quality: 90 })
    .toFile(join(dir, "recipe-soup.jpg"));
  process.stdout.write("wrote recipe-soup.jpg\n");
}

/** Official catalog packs only — no plated corn/bean leftover. */
{
  const pack = (id, w, h) =>
    sharp(join(dir, `${id}.png`))
      .trim({ threshold: 18 })
      .resize(w, h, { fit: "inside" })
      .png()
      .toBuffer();
  const quinoa = await pack("11", 520, 680);
  const tomatoes = await pack("3", 300, 360);
  const oil = await pack("10", 240, 460);
  const q = await sharp(quinoa).metadata();
  const t = await sharp(tomatoes).metadata();
  const o = await sharp(oil).metadata();
  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 243, g: 244, b: 245 },
    },
  })
    .composite([
      {
        input: quinoa,
        left: 190,
        top: Math.round((H - (q.height || 680)) / 2),
      },
      {
        input: oil,
        left: 780,
        top: 150,
      },
      {
        input: tomatoes,
        left: 800,
        top: H - 120 - (t.height || 360),
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(join(dir, "recipe-quinoa.jpg"));
  process.stdout.write(
    `wrote recipe-quinoa.jpg from official packs ${q.width}x${q.height} ${o.width} ${t.width}\n`
  );
}
