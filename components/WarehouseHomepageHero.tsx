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
          src="/products/24.png"
          kicker="Limited-Time Offers"
          title="Member Only Savings"
          panel="bg-costco-red"
          cta="text-costco-red"
          onClick={onOffers}
        />
        <PromoTile
          src="/products/10.png"
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
      className={`group relative h-[280px] overflow-hidden text-left ${panel}`}
    >
      <span className="absolute inset-y-0 left-0 z-10 flex w-[48%] flex-col justify-center px-6 py-6">
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
      <span className="absolute inset-y-8 right-6 flex w-[44%] items-center justify-center">
        <span className="flex h-full w-full max-w-[220px] items-center justify-center bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="h-[86%] w-[86%] object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </span>
      </span>
    </button>
  );
}
