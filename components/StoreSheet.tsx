"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useStorefrontOverlayClass, useSessionStore } from "@/lib/store/session";

export default function StoreSheet({
  title,
  onClose,
  children,
  wide = false,
  page = false,
  tone = "sameday",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  page?: boolean;
  tone?: "sameday" | "warehouse";
}) {
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const overlayClass = useStorefrontOverlayClass(kirkOpen);
  const warehouse = tone === "warehouse";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (page) {
    return (
      <div
        className={`fixed z-[90] flex min-h-0 flex-col bg-[#e8eaed] ${overlayClass}`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="flex h-full min-h-0 flex-col"
        >
          <div
            className={`flex shrink-0 items-center justify-between bg-white px-4 py-3.5 ${
              warehouse ? "border-b border-[#c4c4c4]" : "border-b border-[#ececec]"
            }`}
          >
            <h2 className="pr-3 text-[18px] font-bold leading-none text-[#1a1a1a]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`shrink-0 p-2 ${
                warehouse
                  ? "rounded-[3px] hover:bg-[#f7fbfe]"
                  : "rounded-full hover:bg-[#f6f6f6]"
              }`}
              aria-label="Close"
            >
              <X className="h-5 w-5 text-[#555]" />
            </button>
          </div>
          {warehouse ? (
            <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
          ) : null}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-[90] flex items-end justify-center sm:items-center sm:p-4 ${overlayClass}`}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex w-full max-h-[92dvh] flex-col overflow-hidden bg-white shadow-2xl ${
          warehouse
            ? "rounded-t-[3px] sm:rounded-[3px]"
            : "rounded-t-[16px] sm:rounded-[16px]"
        } ${wide ? "max-w-[560px]" : "max-w-[440px]"}`}
      >
        <div
          className={`flex shrink-0 items-center justify-between px-4 py-3.5 ${
            warehouse ? "border-b border-[#c4c4c4]" : "border-b border-[#ececec]"
          }`}
        >
          <h2 className="pr-3 text-[18px] font-bold leading-none text-[#1a1a1a]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 p-2 ${
              warehouse
                ? "rounded-[3px] hover:bg-[#f7fbfe]"
                : "rounded-full hover:bg-[#f6f6f6]"
            }`}
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>
        {warehouse ? (
          <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
