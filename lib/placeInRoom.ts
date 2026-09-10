import type { CSSProperties } from "react";
import { products, type Product } from "@/lib/data/products";

export const FURNITURE_DEPARTMENT = "Furniture & Outdoor";

export type SceneId = "living-room" | "bedroom" | "office" | "patio";

export type ScenePlacement = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type RoomScene = {
  id: SceneId;
  label: string;
  image: string;
  crumb: string;
  placement: ScenePlacement;
};

export const ROOM_SCENES: RoomScene[] = [
  {
    id: "living-room",
    label: "Living room",
    image: "/rooms/living-room.jpg",
    crumb: "Living Room",
    placement: { left: 0.18, top: 0.42, width: 0.64, height: 0.46 },
  },
  {
    id: "bedroom",
    label: "Bedroom",
    image: "/rooms/bedroom.jpg",
    crumb: "Bedroom",
    placement: { left: 0.2, top: 0.36, width: 0.6, height: 0.5 },
  },
  {
    id: "office",
    label: "Office",
    image: "/rooms/office.jpg",
    crumb: "Office",
    placement: { left: 0.38, top: 0.4, width: 0.34, height: 0.48 },
  },
  {
    id: "patio",
    label: "Patio / landscape",
    image: "/rooms/patio.jpg",
    crumb: "Patio",
    placement: { left: 0.16, top: 0.4, width: 0.68, height: 0.5 },
  },
];

export const DEFAULT_FURNITURE_ID = "25";
export const PATIO_FURNITURE_ID = "28";

export function isFurnitureProduct(product: Product): boolean {
  return (
    product.department === FURNITURE_DEPARTMENT ||
    (product.tags || []).some((t) => t === "furniture" || t === "outdoor")
  );
}

export function furnitureProducts(): Product[] {
  return products.filter(isFurnitureProduct);
}

export function getScene(id: SceneId): RoomScene {
  return ROOM_SCENES.find((s) => s.id === id) || ROOM_SCENES[0]!;
}

export function defaultSceneForProduct(product: Product): SceneId {
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  if (tags.includes("outdoor") || product.category === "patio") return "patio";
  if (product.category === "bedroom" || tags.includes("bedroom")) return "bedroom";
  if (product.category === "office" || tags.includes("office")) return "office";
  return "living-room";
}

export function pickFurnitureProduct(
  sceneId?: SceneId | null,
  preferredId?: string | null
): Product {
  const byScene = (id: SceneId): Product | undefined => {
    if (id === "patio") return products.find((p) => p.id === PATIO_FURNITURE_ID);
    if (id === "bedroom") return products.find((p) => p.category === "bedroom");
    if (id === "office") return products.find((p) => p.category === "office");
    return products.find((p) => p.id === DEFAULT_FURNITURE_ID);
  };

  const preferred = preferredId ? products.find((p) => p.id === preferredId) : undefined;
  if (preferred && isFurnitureProduct(preferred)) {
    if (!sceneId || defaultSceneForProduct(preferred) === sceneId) return preferred;
    if (sceneId !== "patio") return preferred;
  }

  return byScene(sceneId || "living-room") || furnitureProducts()[0]!;
}

export function wantsPlaceInRoom(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return false;
  return (
    /see (this )?(in )?my room/.test(t) ||
    /place in (my )?room/.test(t) ||
    /stage (my )?(patio|landscape|room)/.test(t) ||
    /virtual stag/.test(t) ||
    /living room template/.test(t) ||
    /upload (a )?(room )?photo/.test(t)
  );
}

export type PlaceInRoomIntent = {
  sceneId: SceneId;
  upload: boolean;
};

export function parsePlaceInRoomAsk(
  text: string,
  preferredId?: string | null
): PlaceInRoomIntent {
  const t = (text || "").toLowerCase();
  const upload = /upload/.test(t);
  let sceneId: SceneId = "living-room";
  if (/patio|landscape|outdoor|deck/.test(t)) sceneId = "patio";
  else if (/bedroom/.test(t)) sceneId = "bedroom";
  else if (/office|desk/.test(t)) sceneId = "office";
  else if (/living/.test(t)) sceneId = "living-room";
  else {
    const preferred = preferredId ? products.find((p) => p.id === preferredId) : undefined;
    if (preferred && isFurnitureProduct(preferred)) {
      sceneId = defaultSceneForProduct(preferred);
    }
  }
  return { sceneId, upload };
}

export function placementStyle(placement: ScenePlacement): CSSProperties {
  return {
    left: `${placement.left * 100}%`,
    top: `${placement.top * 100}%`,
    width: `${placement.width * 100}%`,
    height: `${placement.height * 100}%`,
  };
}
