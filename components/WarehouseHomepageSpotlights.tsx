/** costco.com 3-up promo row. UI only — does not call Kirk. */
export default function WarehouseHomepageSpotlights({
  onPick,
}: {
  onPick: (label: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <SpotlightTile
        src="/products/banner-23.png?v=1"
        kicker="Grocery"
        title="Dairy & Eggs"
        panel="bg-costco-blue"
        cta="text-costco-blue"
        cutout={false}
        onClick={() => onPick("Dairy & Eggs")}
      />
      <SpotlightTile
        src="/products/cutout-19.png?v=1"
        kicker="Household"
        title="Laundry & more"
        panel="bg-costco-red"
        cta="text-costco-red"
        cutout
        onClick={() => onPick("Household")}
      />
      <SpotlightTile
        src="/products/cutout-15.png?v=1"
        kicker="Bakery"
        title="Fresh from the case"
        panel="bg-[#1a1a1a]"
        cta="text-[#1a1a1a]"
        cutout
        onClick={() => onPick("Bakery")}
      />
    </div>
  );
}

function SpotlightTile({
  src,
  kicker,
  title,
  panel,
  cta,
  cutout,
  onClick,
}: {
  src: string;
  kicker: string;
  title: string;
  panel: string;
  cta: string;
  cutout: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-[200px] overflow-hidden text-left ${
        cutout ? panel : ""
      }`}
    >
      <span
        className={`flex w-[46%] shrink-0 flex-col justify-center px-4 py-4 ${
          cutout ? "" : panel
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
          {kicker}
        </span>
        <span className="mt-1 block text-[22px] font-bold leading-tight text-white">
          {title}
        </span>
        <span
          className={`mt-3 inline-flex h-8 w-fit items-center bg-white px-2.5 text-[12px] font-bold ${cta}`}
        >
          Shop Now <span aria-hidden="true">›</span>
        </span>
      </span>
      <span
        className={`flex min-w-0 flex-1 items-center justify-end overflow-hidden ${
          cutout ? "pr-3" : "bg-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className={
            cutout
              ? "h-[96%] w-auto max-w-none object-contain transition-transform duration-300 group-hover:scale-[1.05]"
              : "h-full w-full object-contain p-2 transition-transform duration-300 scale-[1.2] group-hover:scale-[1.28]"
          }
        />
      </span>
    </button>
  );
}
