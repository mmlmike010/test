"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";

export default function StoreSheet({
  title,
  onClose,
  children,
  wide = false,
  page = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  page?: boolean;
}) {
  const kirkOpen = useSessionStore((s) => s.kirkOpen);

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
        className={`fixed z-[90] flex min-h-0 flex-col bg-[#e8eaed] ${storefrontOverlayClass(kirkOpen)}`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="flex h-full min-h-0 flex-col"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#ececec] bg-white px-4 py-3.5">
            <h2 className="pr-3 text-[18px] font-bold leading-none text-[#1a1a1a]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 hover:bg-[#f6f6f6]"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-[#555]" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-[90] flex items-end justify-center sm:items-center sm:p-4 ${storefrontOverlayClass(kirkOpen)}`}
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
        className={`relative flex w-full max-h-[92dvh] flex-col overflow-hidden rounded-t-[16px] bg-white shadow-2xl sm:rounded-[16px] ${
          wide ? "max-w-[560px]" : "max-w-[440px]"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#ececec] px-4 py-3.5">
          <h2 className="pr-3 text-[18px] font-bold leading-none text-[#1a1a1a]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 hover:bg-[#f6f6f6]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
