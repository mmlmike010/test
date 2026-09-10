"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";

export default function StoreSheet({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const kirkOpen = useSessionStore((s) => s.kirkOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={`fixed z-[90] flex items-end sm:items-center justify-center sm:p-4 ${storefrontOverlayClass(kirkOpen)}`}
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
        className={`relative w-full ${
          wide ? "max-w-[560px]" : "max-w-[440px]"
        } max-h-[92dvh] bg-white rounded-t-[16px] sm:rounded-[16px] shadow-2xl flex flex-col overflow-hidden`}
      >
        <div className="px-4 py-3.5 border-b border-[#ececec] flex items-center justify-between shrink-0">
          <h2 className="font-bold text-[#1a1a1a] text-[18px] leading-none pr-3">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f6f6f6] shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      </div>
    </div>
  );
}
