import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data/products";
import { IMAGINE_MODEL, stageFurnitureWithImagine } from "@/lib/imagineStage";
import {
  ROOM_SCENES,
  isFurnitureProduct,
  type SceneId,
} from "@/lib/placeInRoom";

export const runtime = "nodejs";

const SCENE_IDS = new Set(ROOM_SCENES.map((s) => s.id));

export async function POST(req: NextRequest) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "XAI_API_KEY is not set" },
      { status: 500 }
    );
  }

  let body: {
    productId?: string;
    sceneId?: string;
    roomImage?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const product = products.find((p) => p.id === String(body.productId || ""));
  if (!product || !isFurnitureProduct(product)) {
    return NextResponse.json({ error: "Furniture SKU required" }, { status: 400 });
  }

  const sceneId = String(body.sceneId || "living-room") as SceneId;
  if (!SCENE_IDS.has(sceneId)) {
    return NextResponse.json({ error: "Unknown scene" }, { status: 400 });
  }

  const roomImage =
    typeof body.roomImage === "string" && body.roomImage.startsWith("data:image/")
      ? body.roomImage
      : undefined;

  try {
    const staged = await stageFurnitureWithImagine({
      apiKey,
      productId: product.id,
      sceneId,
      roomImage,
    });
    if (!staged) {
      return NextResponse.json(
        { error: "Grok Imagine did not return a staging image" },
        { status: 502 }
      );
    }
    return NextResponse.json({
      imageUrl: staged.url,
      model: staged.model,
      mode: staged.mode,
      sceneId,
      productId: product.id,
    });
  } catch (err) {
    console.error("place-in-room Imagine failed", err);
    return NextResponse.json(
      { error: "Grok Imagine request failed", model: IMAGINE_MODEL },
      { status: 502 }
    );
  }
}
