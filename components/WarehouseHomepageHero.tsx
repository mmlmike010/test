/** costco.com homepage promo pair. UI only — does not call Kirk. */
export default function WarehouseHomepageHero({
  onKirkland,
  onOffers,
}: {
  onKirkland: () => void;
  onOffers: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <PromoTile
          src="/products/hero-weekly.jpg?v=23"
          title="Member Only Savings"
          onClick={onOffers}
        />
        <PromoTile
          src="/products/hero-kirkland.jpg?v=23"
          title="Kirkland Signature"
          onClick={onKirkland}
        />
      </div>
      <p className="px-0.5 text-[11px] text-[#72767E]">While supplies last</p>
    </div>
  );
}

function PromoTile({
  src,
  title,
  onClick,
}: {
  src: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block h-[260px] overflow-hidden bg-[#2b3a4a] text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[72%_center] transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-y-0 left-0 flex w-[48%] flex-col justify-end bg-gradient-to-r from-black/70 via-black/35 to-transparent px-6 pb-6 pt-8">
        <span className="block text-[28px] font-bold leading-tight text-white">
          {title}
        </span>
        <span className="mt-1.5 inline-flex items-center text-[14px] font-bold text-white">
          Shop Now <span aria-hidden="true">›</span>
        </span>
      </span>
    </button>
  );
}
