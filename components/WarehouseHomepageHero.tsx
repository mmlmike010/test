"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    src: "/products/24.png",
    kicker: "Limited-Time Offers",
    title: "Member Only Savings",
    panel: "bg-costco-red",
    cta: "text-costco-red",
    zoom: "scale-[2.15] group-hover:scale-[2.25]",
    action: "offers" as const,
  },
  {
    src: "/products/10.png",
    kicker: "Kirkland Signature",
    title: "Member favorites",
    panel: "bg-costco-blue",
    cta: "text-costco-blue",
    zoom: "scale-[1.7] group-hover:scale-[1.8]",
    action: "kirkland" as const,
  },
  {
    src: "/products/23.png",
    kicker: "Grocery",
    title: "Dairy & Eggs",
    panel: "bg-[#1a1a1a]",
    cta: "text-[#1a1a1a]",
    zoom: "scale-[1.9] group-hover:scale-[2]",
    action: "dairy" as const,
  },
];

/** costco.com homepage hero carousel. UI only — does not call Kirk. */
export default function WarehouseHomepageHero({
  onKirkland,
  onOffers,
  onPick,
}: {
  onKirkland: () => void;
  onOffers: () => void;
  onPick: (label: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const go = (next: number) => {
    const count = SLIDES.length;
    setIndex(((next % count) + count) % count);
  };
  const shop = () => {
    if (slide.action === "offers") onOffers();
    else if (slide.action === "kirkland") onKirkland();
    else onPick("Dairy & Eggs");
  };

  return (
    <div className="-mx-4 -mt-4 lg:-mx-8">
      <div
        className="relative"
        aria-roledescription="carousel"
        aria-label="Featured offers"
      >
        <button
          type="button"
          onClick={shop}
          className="group relative flex h-[400px] w-full overflow-hidden text-left"
        >
          <span
            className={`relative z-10 flex w-[48%] flex-col justify-center py-8 pl-20 pr-8 lg:pl-24 ${slide.panel}`}
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/80">
              {slide.kicker}
            </span>
            <span className="mt-3 block text-[44px] font-bold leading-[1.02] text-white">
              {slide.title}
            </span>
            <span
              className={`mt-6 inline-flex h-10 w-fit items-center bg-white px-4 text-[14px] font-bold ${slide.cta}`}
            >
              Shop Now <span aria-hidden="true">›</span>
            </span>
          </span>
          <span className="relative flex w-[52%] items-center justify-center overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt=""
              className={`h-full w-full object-contain p-3 transition-transform duration-300 ${slide.zoom}`}
            />
          </span>
        </button>
        <button
          type="button"
          aria-label="Previous offer"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:bg-[#f6f6f6]"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next offer"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-[0_1px_4px_rgba(0,0,0,0.18)] hover:bg-[#f6f6f6]"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="absolute bottom-4 left-20 z-10 flex gap-1.5 lg:left-24">
          {SLIDES.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show offer ${i + 1} of ${SLIDES.length}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="px-4 pt-1.5 text-[11px] text-[#72767E] lg:px-8">
        While supplies last
      </p>
    </div>
  );
}
