import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products, type Product } from "@/lib/data/products";
import {
  getScene,
  type SceneId,
} from "@/lib/placeInRoom";

export const IMAGINE_MODEL = "grok-imagine-image-2.0";

const SCENE_SETTING: Record<SceneId, string> = {
  "living-room":
    "a bright modern living room with oak hardwood, a linen rug, and a large window with daylight",
  bedroom:
    "a calm bedroom with soft daylight, a textured rug, nightstands, and a padded headboard wall",
  office:
    "a home office with a desk, bookshelves, task lighting, and a window",
  patio:
    "an outdoor patio / landscape with a wood deck, planting, and late-afternoon sun",
};

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

function publicFile(urlPath: string): string {
  const clean = (urlPath.split("?")[0] || urlPath).replace(/^\//, "");
  return path.join(process.cwd(), "public", clean);
}

async function loadLocalOrRemote(src: string): Promise<Buffer | null> {
  try {
    if (src.startsWith("data:image/")) {
      const match = src.match(/^data:image\/\w+;base64,(.+)$/);
      return match?.[1] ? Buffer.from(match[1], "base64") : null;
    }
    if (src.startsWith("http://") || src.startsWith("https://")) {
      const res = await fetchWithTimeout(src, {}, 6000);
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    }
    return await readFile(publicFile(src));
  } catch {
    return null;
  }
}

async function toJpegDataUri(buf: Buffer): Promise<string> {
  const jpeg = await sharp(buf)
    .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

function extractImageUrl(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const rec = data as { data?: { url?: string }[]; url?: string };
  const url = rec.data?.[0]?.url || rec.url;
  return typeof url === "string" && url ? url : null;
}

function stagingPrompt(product: Product, sceneId: SceneId, uploaded: boolean): string {
  const sku = `${product.brand} ${product.name}`;
  const setting = SCENE_SETTING[sceneId];
  const roomBit = uploaded
    ? "the member's uploaded room photograph (keep architecture, perspective, and lighting)"
    : setting;
  return [
    `Virtual staging / place-in-room composite for a Costco furniture SKU.`,
    `Place this exact product into ${roomBit}: ${sku}.`,
    `The furniture must look physically present: correct scale, grounded on the floor, natural contact shadows, matching light direction.`,
    `Photorealistic interior/exterior catalog photo. No people, no text overlays, no invented logos, no watermark.`,
  ].join(" ");
}

async function imagineGenerations(
  apiKey: string,
  prompt: string
): Promise<string | null> {
  const res = await fetchWithTimeout(
    "https://api.x.ai/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: IMAGINE_MODEL,
        prompt,
        n: 1,
        quality: "low",
        resolution: "1k",
        aspect_ratio: "16:9",
        response_format: "url",
      }),
    },
    20000
  );
  if (!res.ok) {
    console.error("Imagine generations failed", res.status, (await res.text()).slice(0, 400));
    return null;
  }
  return extractImageUrl(await res.json());
}

async function imagineEdits(
  apiKey: string,
  prompt: string,
  imageUris: string[]
): Promise<string | null> {
  if (!imageUris.length) return null;
  const image =
    imageUris.length === 1
      ? { url: imageUris[0], type: "image_url" }
      : imageUris.map((url) => ({ url, type: "image_url" }));

  const res = await fetchWithTimeout(
    "https://api.x.ai/v1/images/edits",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: IMAGINE_MODEL,
        prompt,
        image,
        n: 1,
        quality: "low",
        resolution: "1k",
        aspect_ratio: "16:9",
        response_format: "url",
      }),
    },
    22000
  );
  if (!res.ok) {
    console.error("Imagine edits failed", res.status, (await res.text()).slice(0, 400));
    return null;
  }
  return extractImageUrl(await res.json());
}

export async function stageFurnitureWithImagine(opts: {
  apiKey: string;
  productId: string;
  sceneId: SceneId;
  roomImage?: string;
}): Promise<{
  url: string;
  model: typeof IMAGINE_MODEL;
  mode: "edits" | "generations";
} | null> {
  const product = products.find((p) => p.id === opts.productId);
  if (!product) return null;

  const scene = getScene(opts.sceneId);
  const uploaded = Boolean(opts.roomImage);
  const prompt = stagingPrompt(product, opts.sceneId, uploaded);

  const refs: string[] = [];
  const roomBuf = await loadLocalOrRemote(opts.roomImage || scene.image);
  if (roomBuf) refs.push(await toJpegDataUri(roomBuf));
  const skuBuf = await loadLocalOrRemote(product.image);
  if (skuBuf) refs.push(await toJpegDataUri(skuBuf));

  // Prefer edits: room (+ SKU) in, staged environment out — real compositing.
  if (refs.length) {
    try {
      const edited = await imagineEdits(opts.apiKey, prompt, refs);
      if (edited) return { url: edited, model: IMAGINE_MODEL, mode: "edits" };
      if (refs.length > 1) {
        const roomOnly = await imagineEdits(opts.apiKey, prompt, [refs[0]!]);
        if (roomOnly) return { url: roomOnly, model: IMAGINE_MODEL, mode: "edits" };
      }
    } catch (err) {
      console.error("Imagine edits threw", err);
    }
  }

  try {
    const generated = await imagineGenerations(opts.apiKey, prompt);
    if (generated) return { url: generated, model: IMAGINE_MODEL, mode: "generations" };
  } catch (err) {
    console.error("Imagine generations threw", err);
  }

  return null;
}
