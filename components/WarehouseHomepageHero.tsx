/** costco.com campaign tiles. UI only — does not call Kirk. */
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
          src="/products/hero-weekly.jpg?v=24"
          kicker="Limited-Time Offers"
          title="Member Only Savings"
          panel="bg-costco-red"
          cta="text-costco-red"
          onClick={onOffers}
        />
        <PromoTile
          src="/products/hero-kirkland.jpg?v=24"
          kicker="Kirkland Signature"
          title="Member favorites"
          panel="bg-costco-blue"
          cta="text-costco-blue"
          onClick={onKirkland}
        />
      </div>
      <p className="px-0.5 text-[11px] text-[#72767E]">While supplies last</p>
    </div>
  );
}

function PromoTile({
  src,
  kicker,
  title,
  panel,
  cta,
  onClick,
}: {
  src: string;
  kicker: string;
  title: string;
  panel: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid h-[280px] grid-cols-[minmax(200px,40%)_minmax(0,1fr)] overflow-hidden text-left"
    >
      <span className={`flex flex-col justify-center px-6 py-6 ${panel}`}>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
          {kicker}
        </span>
        <span className="mt-2 block text-[30px] font-bold leading-[1.05] text-white">
          {title}
        </span>
        <span
          className={`mt-5 inline-flex h-9 w-fit items-center bg-white px-3 text-[13px] font-bold ${cta}`}
        >
          Shop Now <span aria-hidden="true">›</span>
        </span>
      </span>
      <span className="relative overflow-hidden bg-[#2b3a4a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full origin-right scale-[1.2] object-cover object-[78%_center] transition-transform duration-300 group-hover:scale-[1.25]"
        />
      </span>
    </button>
  );
}
