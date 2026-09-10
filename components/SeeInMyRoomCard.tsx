"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Product } from "@/lib/data/products";
import {
  defaultSceneForProduct,
  getScene,
  placementStyle,
} from "@/lib/placeInRoom";

export default function SeeInMyRoomCard({ product }: { product: Product }) {
  const scene = getScene(defaultSceneForProduct(product));
  const [loading, setLoading] = useState(false);
  const [stagedUrl, setStagedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/place-in-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sceneId: scene.id,
        }),
      });
      const data = (await res.json()) as { imageUrl?: string; error?: string };
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || "Grok Imagine staging failed");
      }
      setStagedUrl(data.imageUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grok Imagine staging failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#eee]">
      <button
        type="button"
        onClick={() => void stage()}
        disabled={loading}
        className="w-full h-11 rounded-full bg-costco-blue text-white text-[14px] font-bold hover:bg-costco-blue-hover disabled:opacity-60"
      >
        See it in my room
      </button>
      <div className="relative mt-3 h-[160px] rounded-[8px] overflow-hidden bg-[#f3f3f3] border border-[#eee]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stagedUrl || scene.image}
          alt={
            stagedUrl
              ? `${product.name} staged with Grok Imagine`
              : `${scene.label} preview`
          }
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!stagedUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt=""
            className="absolute object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.25)]"
            style={placementStyle(scene.placement)}
          />
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-costco-blue animate-pulse" aria-hidden="true" />
            <p className="text-[12px] font-bold text-costco-blue">
              Grok Imagine is staging…
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-[12px] text-costco-red bg-[#fff5f6] border border-[#f3c5cb] px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
