"use client";

import { Star } from "lucide-react";

export default function SuggestedActionChip({
  label,
  tone = "blue",
  onClick,
  disabled,
}: {
  label: string;
  tone?: "blue" | "red";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[52px] flex items-center gap-3 pl-3.5 pr-4 bg-costco-chip border border-[#d1d5db] rounded-full hover:border-costco-blue disabled:opacity-50 text-left"
    >
      <span
        className={`size-7 rounded-[14px] flex items-center justify-center shrink-0 ${
          tone === "red" ? "bg-costco-red" : "bg-costco-blue"
        }`}
      >
        <Star className="w-3 h-3 fill-white text-white" aria-hidden="true" />
      </span>
      <span className="text-[14px] font-semibold text-[#1a1a1a]">{label}</span>
    </button>
  );
}
