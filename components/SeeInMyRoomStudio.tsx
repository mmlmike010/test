"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles, Upload } from "lucide-react";
import type { Product } from "@/lib/data/products";
import {
  ROOM_SCENES,
  defaultSceneForProduct,
  getScene,
  type SceneId,
} from "@/lib/placeInRoom";
import { usePlaceInRoomStore } from "@/lib/store/placeInRoom";

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read photo"));
    };
    reader.onerror = () => reject(new Error("Could not read photo"));
    reader.readAsDataURL(file);
  });
}

export default function SeeInMyRoomStudio({
  product,
  initialScene,
  startUpload,
}: {
  product: Product;
  initialScene?: SceneId;
  startUpload?: boolean;
}) {
  const [sceneId, setSceneId] = useState<SceneId>(
    initialScene || defaultSceneForProduct(product)
  );
  const [roomUrl, setRoomUrl] = useState<string | null>(() => {
    const pending = usePlaceInRoomStore.getState().pendingRoomImage;
    if (pending) usePlaceInRoomStore.getState().setPendingRoomImage(null);
    return pending;
  });
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [imagineMode, setImagineMode] = useState<string | null>(null);
  const [loading, setLoading] = useState<"generate" | "upload" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scene = getScene(sceneId);

  useEffect(() => {
    if (startUpload) fileRef.current?.click();
  }, [startUpload]);

  const onUpload = async (file: File) => {
    setError(null);
    setMergedUrl(null);
    setImagineMode(null);
    try {
      setRoomUrl(await readImageAsDataUrl(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read photo");
    }
  };

  const merge = async (useUpload: boolean) => {
    if (useUpload && !roomUrl) {
      setError("Upload a room photo first.");
      return;
    }
    setLoading(useUpload ? "upload" : "generate");
    setError(null);
    try {
      const res = await fetch("/api/place-in-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sceneId,
          ...(useUpload && roomUrl ? { roomImage: roomUrl } : {}),
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
      setMergedUrl(data.imageUrl);
      setImagineMode(data.mode || (useUpload ? "edits" : "generations"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grok Imagine staging failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-4 lg:px-5 lg:py-4 max-w-[880px]">
      <Link
        href="/"
        className="inline-flex items-center gap-0.5 text-[13px] font-bold text-costco-blue hover:underline mb-3"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Shop
      </Link>

      <div className="flex items-center justify-between gap-2 mb-1">
        <h1 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
          See in my room
        </h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-costco-ai-pill px-2 py-[3px] text-costco-blue">
          <span className="text-[10px] font-bold" aria-hidden="true">
            ✦
          </span>
          <span className="text-[11px] font-semibold">AI staging</span>
        </span>
      </div>
      <p className="text-[13px] text-costco-text-muted mt-1 mb-4">
        Pick a Costco room template or upload a photo. Place in room lets Grok
        Imagine generate the space around this sofa — no upload required.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <section className="bg-white border border-costco-border rounded-[12px] overflow-hidden">
          <p className="px-3.5 py-2 text-[12px] font-bold text-[#555] border-b border-[#eee]">
            Product photo
          </p>
          <div className="relative aspect-[4/3] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
          </div>
          <p className="px-3.5 py-2.5 text-[13px] font-semibold text-[#1a1a1a]">
            {product.brand} {product.name}
          </p>
        </section>

        <section className="bg-white border border-costco-border rounded-[12px] overflow-hidden">
          <p className="px-3.5 py-2 text-[12px] font-bold text-[#555] border-b border-[#eee]">
            {roomUrl ? "Your room" : `${scene.label} template`}
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative block w-full aspect-[4/3] bg-costco-bg text-left"
          >
            {roomUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={roomUrl}
                alt="Uploaded room"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scene.image}
                  alt={`${scene.label} template`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/20 text-white">
                  <Upload className="w-5 h-5" aria-hidden="true" />
                  <span className="text-[13px] font-bold">Upload photo</span>
                </span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
        </section>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {ROOM_SCENES.map((s) => {
          const active = s.id === sceneId && !roomUrl;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSceneId(s.id);
                setRoomUrl(null);
                setMergedUrl(null);
              }}
              className={`rounded-full px-3 py-2 text-[12px] font-semibold ${
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
          className={`rounded-full px-3 py-2 text-[12px] font-semibold ${
            roomUrl
              ? "bg-costco-blue text-white"
              : "border border-costco-border bg-costco-chip text-[#1a1a1a]"
          }`}
        >
          Upload photo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void merge(false)}
          disabled={loading !== null}
          className="w-full sm:w-auto min-w-[200px] h-12 px-5 rounded-[8px] bg-costco-blue text-white text-[15px] font-semibold hover:bg-costco-blue-hover disabled:opacity-50"
        >
          {loading === "generate" ? "Grok Imagine is placing…" : "Place in room"}
        </button>
        {roomUrl ? (
          <button
            type="button"
            onClick={() => void merge(true)}
            disabled={loading !== null}
            className="w-full sm:w-auto h-12 px-5 rounded-[8px] border border-costco-blue bg-white text-costco-blue text-[15px] font-semibold hover:bg-costco-chip disabled:opacity-50"
          >
            {loading === "upload"
              ? "Grok Imagine is merging…"
              : "Place in this photo"}
          </button>
        ) : null}
      </div>

      {error && (
        <p className="mt-3 text-[12px] text-costco-red bg-[#fff5f6] border border-[#f3c5cb] px-3 py-2">
          {error}
        </p>
      )}

      <section className="mt-4 rounded-[12px] border-2 border-costco-blue bg-white overflow-hidden">
        <div className="px-3.5 py-2 flex items-center justify-between border-b border-[#eee]">
          <p className="text-[16px] font-bold text-[#1a1a1a]">See in my room</p>
          {imagineMode && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-costco-blue">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Grok Imagine · {imagineMode}
            </span>
          )}
        </div>
        <div className="relative aspect-video bg-costco-bg">
          {mergedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mergedUrl}
              alt={`${product.name} placed in ${scene.label}`}
              className="absolute inset-0 w-full h-full object-contain bg-white"
            />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-[13px] text-[#555] px-4 text-center">
              {loading
                ? "Grok Imagine is generating the room and placing the sofa…"
                : `${scene.label} template · tap Place in room`}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
