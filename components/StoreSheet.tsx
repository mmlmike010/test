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
  crumbs,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  page?: boolean;
  tone?: "sameday" | "warehouse";
  crumbs?: { label: string; onClick?: () => void }[];
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
    if (warehouse) {
      const trail =
        crumbs && crumbs.length
          ? crumbs
          : [
              { label: "Home", onClick: onClose },
              { label: title },
            ];
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
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6">
              <div className="mx-auto max-w-[1180px]">
                <div className="flex items-start justify-between gap-2">
                  <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-[#555]"
                  >
                    {trail.map((crumb, index) => (
                      <span key={`${crumb.label}-${index}`} className="contents">
                        {index > 0 ? (
                          <span aria-hidden="true">›</span>
                        ) : null}
                        {crumb.onClick ? (
                          <button
                            type="button"
                            onClick={crumb.onClick}
                            className="font-bold text-costco-blue hover:underline"
                          >
                            {crumb.label}
                          </button>
                        ) : (
                          <span className="text-[#1a1a1a]">{crumb.label}</span>
                        )}
                      </span>
                    ))}
                  </nav>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[3px] p-1 text-[#555] hover:bg-[#f7fbfe]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-0.5 text-[22px] font-bold leading-snug text-[#1a1a1a]">
                  {title}
                </h2>
                <div className="mt-4">{children}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
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
