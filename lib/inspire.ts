import sharp from "sharp";
import { products, type Product } from "@/lib/data/products";

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  ms: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function buildProductCollage(
  productIds: string[]
): Promise<Buffer | null> {
  const picked = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (!picked.length) return null;

  const tiles: Buffer[] = [];
  for (const p of picked) {
    try {
      const res = await fetchWithTimeout(p.image, {}, 4000);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const tile = await sharp(buf)
        .resize(512, 512, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();
      tiles.push(tile);
    } catch {
      // skip failed fetches
    }
  }

  if (!tiles.length) return null;

  while (tiles.length < 4) {
    tiles.push(tiles[tiles.length - 1]);
  }

  const blank = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 3,
      background: { r: 250, g: 250, b: 250 },
    },
  })
    .jpeg()
    .toBuffer();

  return sharp(blank)
    .composite([
      { input: tiles[0], left: 0, top: 0 },
      { input: tiles[1], left: 512, top: 0 },
      { input: tiles[2], left: 0, top: 512 },
      { input: tiles[3], left: 512, top: 512 },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();
}

export async function generateInspirationImage(opts: {
  apiKey: string;
  productIds: string[];
  inspirePrompt?: string;
  userText: string;
}): Promise<{ url?: string; b64?: string } | null> {
  const named = opts.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  const productLine = named
    .map((p) => `${p.brand} ${p.name}`)
    .join(", ");

  const prompt =
    opts.inspirePrompt?.trim() ||
    `Appetizing Costco Same-Day recipe inspiration photo featuring these real products as the hero ingredients: ${productLine || "pantry staples"}. Warm kitchen lighting, plated meal idea, clean food-magazine style, no text overlays, no logos invented.`;

  const headers = {
    Authorization: `Bearer ${opts.apiKey}`,
    "Content-Type": "application/json",
  };

  // Prefer fast text-to-image first so chat never stalls on collage/edits.
  try {
    const genRes = await fetchWithTimeout(
      "https://api.x.ai/v1/images/generations",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "grok-imagine-image-2.0",
          prompt: `${prompt} User ask: ${opts.userText.slice(0, 200)}`,
          n: 1,
          quality: "low",
          resolution: "1k",
          aspect_ratio: "1:1",
          response_format: "url",
        }),
      },
      18000
    );
    if (genRes.ok) {
      const data = await genRes.json();
      const url = data?.data?.[0]?.url || data?.url;
      if (url) return { url };
    }
  } catch (err) {
    console.error("inspire generations failed/timeout", err);
  }

  // Optional collage edit fallback (short budget)
  try {
    const collage = await buildProductCollage(opts.productIds);
    if (!collage) return null;
    const dataUri = `data:image/jpeg;base64,${collage.toString("base64")}`;
    const editRes = await fetchWithTimeout(
      "https://api.x.ai/v1/images/edits",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "grok-imagine-image-2.0",
          prompt: `${prompt} Transform this product collage into ONE cohesive plated recipe inspiration image that clearly uses these ingredients.`,
          image: { url: dataUri, type: "image_url" },
          n: 1,
          quality: "low",
          response_format: "url",
        }),
      },
      12000
    );
    if (editRes.ok) {
      const data = await editRes.json();
      const url = data?.data?.[0]?.url || data?.url;
      if (url) return { url };
    }
  } catch (err) {
    console.error("inspire edits failed/timeout", err);
  }

  return null;
}
