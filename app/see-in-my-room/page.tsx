"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StoreChrome from "@/components/StoreChrome";
import SeeInMyRoomStudio from "@/components/SeeInMyRoomStudio";
import { products } from "@/lib/data/products";
import {
  DEFAULT_FURNITURE_ID,
  isFurnitureProduct,
  isSceneId,
} from "@/lib/placeInRoom";

function SeeInMyRoomPageInner() {
  const params = useSearchParams();
  const requested = params.get("product");
  const product =
    products.find((p) => p.id === requested && isFurnitureProduct(p)) ||
    products.find((p) => p.id === DEFAULT_FURNITURE_ID) ||
    products.find(isFurnitureProduct);
  const rawScene = params.get("scene");
  const scene = isSceneId(rawScene) ? rawScene : undefined;
  const startUpload = params.get("upload") === "1";

  if (!product) {
    return (
      <StoreChrome>
        <p className="p-6 text-sm text-[#555]">No furniture SKU available.</p>
      </StoreChrome>
    );
  }

  return (
    <StoreChrome>
      <SeeInMyRoomStudio
        product={product}
        initialScene={scene}
        startUpload={startUpload}
      />
    </StoreChrome>
  );
}

export default function SeeInMyRoomPage() {
  return (
    <Suspense
      fallback={
        <StoreChrome>
          <p className="p-6 text-sm text-[#555]">Loading…</p>
        </StoreChrome>
      }
    >
      <SeeInMyRoomPageInner />
    </Suspense>
  );
}
