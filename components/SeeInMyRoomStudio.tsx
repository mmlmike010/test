"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles, Upload } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { defaultSceneForProduct } from "@/lib/placeInRoom";

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

export default function SeeInMyRoomStudio({ product }: { product: Product }) {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [imagineMode, setImagineMode] = useState<string | null>(null);
  const [loading, setLoading] = useState<"generate" | "upload" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sceneId = defaultSceneForProduct(product);

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

      <h1 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
        See it in my room
      </h1>
      <p className="text-[13px] text-[#666] mt-1 mb-4">
        Tap Place in room — Grok Imagine generates a space around this sofa.
        Upload is optional.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <section className="bg-white border border-[#eee] rounded-[12px] overflow-hidden">
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

        <section className="bg-white border border-[#eee] rounded-[12px] overflow-hidden">
          <p className="px-3.5 py-2 text-[12px] font-bold text-[#555] border-b border-[#eee]">
            Your room{" "}
            <span className="font-semibold text-[#888]">(optional)</span>
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative block w-full aspect-[4/3] bg-[#f6f7f8] text-left"
          >
            {roomUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={roomUrl}
                alt="Uploaded room"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#555]">
                <Upload className="w-6 h-6 text-costco-blue" aria-hidden="true" />
                <span className="text-[13px] font-bold text-costco-blue">
                  Upload a room photo
                </span>
                <span className="text-[12px] text-[#777]">JPG or PNG</span>
              </span>
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void merge(false)}
          disabled={loading !== null}
          className="w-full sm:w-auto min-w-[200px] h-12 px-5 rounded-full bg-costco-blue text-white text-[15px] font-bold hover:bg-costco-blue-hover disabled:opacity-50"
        >
          {loading === "generate" ? "Grok Imagine is placing…" : "Place in room"}
        </button>
        {roomUrl ? (
          <button
            type="button"
            onClick={() => void merge(true)}
            disabled={loading !== null}
            className="w-full sm:w-auto h-12 px-5 rounded-full border border-costco-blue bg-white text-costco-blue text-[15px] font-bold hover:bg-[#e8f2fa] disabled:opacity-50"
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

      <section className="mt-4 bg-white border border-[#eee] rounded-[12px] overflow-hidden">
        <div className="px-3.5 py-2 flex items-center justify-between border-b border-[#eee]">
          <p className="text-[12px] font-bold text-[#555]">Merged result</p>
          {imagineMode && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-costco-blue">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Grok Imagine · {imagineMode}
            </span>
          )}
        </div>
        <div className="relative aspect-video bg-[#f3f3f3]">
          {mergedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mergedUrl}
              alt={`${product.name} placed in a generated room`}
              className="absolute inset-0 w-full h-full object-contain bg-white"
            />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-[13px] text-[#777] px-4 text-center">
              {loading
                ? "Grok Imagine is generating the room and placing the sofa…"
                : "Tap Place in room — no upload needed."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
