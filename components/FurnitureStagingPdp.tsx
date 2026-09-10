"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, Sparkles, Upload, X } from "lucide-react";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { usePlaceInRoomStore } from "@/lib/store/placeInRoom";
import StarRating from "@/components/StarRating";
import {
  ROOM_SCENES,
  defaultSceneForProduct,
  getScene,
  type SceneId,
} from "@/lib/placeInRoom";

function FurnitureStagingBody({
  product,
  initialScene,
  startUpload,
}: {
  product: Product;
  initialScene: SceneId;
  startUpload: boolean;
}) {
  const closePdp = usePlaceInRoomStore((s) => s.closePdp);
  const clearUploadRequest = usePlaceInRoomStore((s) => s.clearUploadRequest);
  const addItem = useCartStore((s) => s.addItem);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity || 0
  );

  const [sceneId, setSceneId] = useState<SceneId>(initialScene);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [stagedUrl, setStagedUrl] = useState<string | null>(null);
  const [imagineMode, setImagineMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startUpload) return;
    fileRef.current?.click();
    clearUploadRequest();
  }, [startUpload, clearUploadRequest]);

  const scene = getScene(sceneId);
  const crumb = `Home › Furniture › ${scene.crumb} › ${product.brand} ${product.name}`;

  const onAdd = () => {
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const readUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadUrl(reader.result);
        setStagedUrl(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const stageWithImagine = async (nextScene: SceneId, roomImage?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/place-in-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sceneId: nextScene,
          roomImage: roomImage || undefined,
        }),
      });
      const data = (await res.json()) as {
        imageUrl?: string;
        mode?: string;
        error?: string;
      };
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || "Grok Imagine staging failed");
      }
      setStagedUrl(data.imageUrl);
      setImagineMode(data.mode || "generations");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grok Imagine staging failed");
    } finally {
      setLoading(false);
    }
  };

  const pickScene = (id: SceneId) => {
    setSceneId(id);
    setUploadUrl(null);
    setStagedUrl(null);
    void stageWithImagine(id);
  };

  return (
    <div className="fixed inset-0 z-[70] lg:right-[380px] xl:right-[420px] flex justify-center lg:justify-start">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close product"
        onClick={closePdp}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.brand} ${product.name}`}
        className="relative w-full max-w-[920px] h-full bg-[#f5f5f5] shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-3.5 bg-white border-b border-[#d1d5db] shrink-0">
          <p className="text-[20px] font-bold text-costco-red tracking-tight">COSTCO</p>
          <p className="hidden sm:block text-[13px] text-costco-text-muted truncate">
            {crumb}
          </p>
          <button
            type="button"
            onClick={closePdp}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 lg:p-6 flex flex-col xl:flex-row gap-6 items-start">
            <div className="w-full xl:max-w-[560px] flex flex-col gap-4">
              <div className="relative h-[280px] sm:h-[320px] bg-white border border-[#d1d5db] rounded-[8px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  className="absolute inset-0 w-full h-full object-contain p-6"
                />
                <p className="absolute bottom-3 left-4 text-[13px] font-medium text-costco-text-muted">
                  {product.brand} {product.name} — warehouse photo
                </p>
              </div>

              <div
                ref={stageRef}
                className="bg-white border-2 border-costco-blue rounded-[12px] p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[16px] font-bold text-[#1a1a1a]">See in my room</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full bg-costco-ai-pill text-costco-blue">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span className="text-[11px] font-semibold">AI staging</span>
                  </span>
                </div>

                <div className="relative h-[220px] rounded-[8px] overflow-hidden bg-[#ede8e0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stagedUrl || uploadUrl || scene.image}
                    alt={
                      stagedUrl
                        ? `${product.name} staged in ${scene.label}`
                        : `${scene.label} template`
                    }
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-costco-blue animate-pulse" />
                      <p className="text-[13px] font-bold text-costco-blue">
                        Grok Imagine is staging…
                      </p>
                    </div>
                  )}
                  {!loading && !stagedUrl && (
                    <p className="absolute bottom-3 left-3 text-[13px] font-medium text-[#1a1a1a] bg-white/80 px-2 py-1 rounded">
                      {uploadUrl
                        ? "Your photo · tap See in my room to stage"
                        : `${scene.label} template`}
                    </p>
                  )}
                  {stagedUrl && imagineMode && (
                    <p className="absolute bottom-2 right-2 text-[10px] font-bold uppercase tracking-wide bg-black/60 text-white px-2 py-0.5">
                      Grok Imagine · {imagineMode}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {ROOM_SCENES.map((s) => {
                    const active = sceneId === s.id && !uploadUrl;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickScene(s.id)}
                        className={`px-3 py-2 rounded-full text-[12px] font-semibold ${
                          active
                            ? "bg-costco-blue text-white"
                            : "bg-costco-chip text-[#1a1a1a] border border-[#d1d5db]"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={`px-3 py-2 rounded-full text-[12px] font-semibold inline-flex items-center gap-1 ${
                      uploadUrl
                        ? "bg-costco-blue text-white"
                        : "bg-costco-chip text-[#1a1a1a] border border-[#d1d5db]"
                    }`}
                  >
                    <Upload className="w-3 h-3" aria-hidden="true" />
                    Upload photo
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) readUpload(file);
                    }}
                  />
                </div>
                {error && (
                  <p className="text-[12px] text-costco-red bg-[#fff5f6] border border-[#f3c5cb] px-3 py-2">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full xl:max-w-[360px] bg-white border border-[#d1d5db] rounded-[12px] p-6 flex flex-col gap-4">
              <h2 className="text-[22px] font-bold text-[#1a1a1a] leading-snug">
                {product.brand}® {product.name}
              </h2>
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
              <p className="text-[28px] font-bold text-costco-red tabular-nums leading-none">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-[13px] text-costco-text-muted">
                Member-Only · Warehouse delivery available
              </p>
              <button
                type="button"
                onClick={() => {
                  stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  void stageWithImagine(sceneId, uploadUrl);
                }}
                disabled={loading}
                className="h-12 w-full rounded-[8px] bg-costco-blue text-white text-[15px] font-semibold hover:bg-costco-blue-hover disabled:opacity-60"
              >
                See in my room
              </button>
              <button
                type="button"
                onClick={onAdd}
                className={`h-12 w-full rounded-[8px] text-white text-[15px] font-semibold flex items-center justify-center gap-2 ${
                  justAdded ? "bg-costco-red-hover" : "bg-costco-red hover:bg-costco-red-hover"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added{qty > 0 ? ` · ${qty} in cart` : ""}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to cart
                  </>
                )}
              </button>
              <p className="text-[12px] text-costco-text-muted leading-[18px]">
                Pick a Costco room template or upload a photo. Grok Imagine places
                this SKU in your space — indoor rooms or patio/landscape for outdoor
                sets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FurnitureStagingPdp() {
  const pdpOpen = usePlaceInRoomStore((s) => s.pdpOpen);
  const pdpProductId = usePlaceInRoomStore((s) => s.pdpProductId);
  const preferredScene = usePlaceInRoomStore((s) => s.preferredScene);
  const uploadRequested = usePlaceInRoomStore((s) => s.uploadRequested);
  const product = products.find((p) => p.id === pdpProductId);

  if (!pdpOpen || !product) return null;

  return (
    <FurnitureStagingBody
      key={`${product.id}-${preferredScene ?? "default"}-${uploadRequested ? "up" : "n"}`}
      product={product}
      initialScene={preferredScene || defaultSceneForProduct(product)}
      startUpload={uploadRequested}
    />
  );
}
