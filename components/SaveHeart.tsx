"use client";

import { Heart } from "lucide-react";
import { useListStore } from "@/lib/store/lists";

export default function SaveHeart({
  productId,
  productName,
  className = "absolute top-1.5 right-1.5 w-7 h-7",
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const saved = useListStore((s) =>
    Boolean(
      s.lists.find((list) => list.id === "shopping")?.productIds.includes(productId)
    )
  );
  const toggle = useListStore((s) => s.toggle);

  return (
    <button
      type="button"
      className={`${className} rounded-full bg-white/90 border border-[#eee] flex items-center justify-center ${
        saved ? "text-costco-red" : "text-[#8a8a8a] hover:text-costco-red"
      }`}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${productName} from shopping list`
          : `Save ${productName} to shopping list`
      }
      onClick={(e) => {
        e.stopPropagation();
        toggle(productId);
      }}
    >
      <Heart className={`w-[14px] h-[14px] ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
