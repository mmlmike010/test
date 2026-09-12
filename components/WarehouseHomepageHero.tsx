/** costco.com homepage promo pair. UI only — does not call Kirk. */
export default function WarehouseHomepageHero({
  onKirkland,
  onOffers,
}: {
  onKirkland: () => void;
  onOffers: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onOffers}
        className="overflow-hidden bg-[#2b3a4a] text-left"
      >
        <span className="relative block h-[168px] bg-[#3d4f63]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/products/hero-weekly.jpg?v=22"
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
          />
        </span>
        <span className="block px-1.5 py-1.5">
          <span className="block text-[15px] font-bold leading-tight text-white">
            Member Only Savings
          </span>
          <span className="mt-0.5 block text-[11px] font-bold text-white/80">
            Shop ›
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onKirkland}
        className="overflow-hidden bg-[#4a5d73] text-left"
      >
        <span className="relative block h-[168px] bg-[#5b6f82]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/products/hero-kirkland.jpg?v=22"
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
          />
        </span>
        <span className="block px-1.5 py-1.5">
          <span className="block text-[15px] font-bold leading-tight text-white">
            Kirkland Signature
          </span>
          <span className="mt-0.5 block text-[11px] font-bold text-white/80">
            Shop ›
          </span>
        </span>
      </button>
    </div>
  );
}
