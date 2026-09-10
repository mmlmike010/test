"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/data/products";
import {
  ROOM_SCENES,
  defaultSceneForProduct,
  getScene,
  placementStyle,
  seeInMyRoomHref,
  type SceneId,
} from "@/lib/placeInRoom";
import { usePlaceInRoomStore } from "@/lib/store/placeInRoom";

export default function SeeInMyRoomCard({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const setLastFurniture = usePlaceInRoomStore((s) => s.setLastProduct);
  const setPendingRoomImage = usePlaceInRoomStore((s) => s.setPendingRoomImage);
  const [sceneId, setSceneId] = useState<SceneId>(() =>
    defaultSceneForProduct(product)
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const scene = getScene(sceneId);

  const openStudio = (next: SceneId, upload = false) => {
    setLastFurniture(product.id);
    router.push(
      seeInMyRoomHref({ productId: product.id, sceneId: next, upload })
    );
    onNavigate?.();
  };

  return (
    <div className="mt-4 w-full rounded-[12px] border-2 border-costco-blue bg-white p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <p className="text-[16px] font-bold text-[#1a1a1a]">See in my room</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-costco-ai-pill px-2 py-[3px] text-costco-blue">
          <span className="text-[10px] font-bold" aria-hidden="true">
            ✦
          </span>
          <span className="text-[11px] font-semibold">AI staging</span>
        </span>
      </div>

      <div className="relative h-[140px] overflow-hidden rounded-[8px] bg-costco-bg mb-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scene.image}
          alt={`${scene.label} template`}
          className="absolute inset-0 h-full w-full object-cover bg-costco-bg"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt=""
          className="absolute object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.28)]"
          style={placementStyle(scene.placement)}
        />
        <p className="absolute bottom-1.5 left-2 right-2 text-[11px] font-semibold text-white drop-shadow">
          {scene.label} template · sofa composited in place
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {ROOM_SCENES.map((s) => {
          const active = s.id === sceneId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSceneId(s.id)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                active
                  ? "bg-costco-blue text-white"
                  : "border border-costco-border bg-costco-chip text-[#1a1a1a]"
              }`}
            >
              {s.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-full border border-costco-border bg-costco-chip px-3 py-1.5 text-[12px] font-semibold text-[#1a1a1a]"
        >
          Upload photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                setPendingRoomImage(reader.result);
              }
              openStudio(sceneId, true);
            };
            reader.readAsDataURL(file);
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => openStudio(sceneId)}
        className="flex h-12 w-full items-center justify-center rounded-[8px] bg-costco-blue text-[15px] font-semibold text-white hover:bg-costco-blue-hover"
      >
        See in my room
      </button>
      <p className="mt-2 text-[12px] leading-[18px] text-costco-text-muted">
        Pick a Costco room template or upload a photo. AI places this SKU in
        your space — indoor living rooms or patio/landscape for outdoor sets.
      </p>
    </div>
  );
}
