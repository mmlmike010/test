/** costco.com 3-up promo row. UI only — does not call Kirk. */
export default function WarehouseHomepageSpotlights({
  onPick,
}: {
  onPick: (label: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <SpotlightTile
        src="/products/23.png"
        kicker="Grocery"
        title="Dairy & Eggs"
        panel="bg-costco-blue"
        cta="text-costco-blue"
        onClick={() => onPick("Dairy & Eggs")}
      />
      <SpotlightTile
        src="/products/19.png?v=3"
        kicker="Household"
        title="Laundry & more"
        panel="bg-costco-red"
        cta="text-costco-red"
        onClick={() => onPick("Household")}
      />
      <SpotlightTile
        src="/products/15.png?v=2"
        kicker="Bakery"
        title="Fresh from the case"
        panel="bg-[#1a1a1a]"
        cta="text-[#1a1a1a]"
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
      className={`group relative h-[168px] overflow-hidden text-left ${panel}`}
    >
      <span className="absolute inset-y-0 left-0 z-10 flex w-[50%] flex-col justify-center px-4 py-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
          {kicker}
        </span>
        <span className="mt-1 block text-[20px] font-bold leading-tight text-white">
          {title}
        </span>
        <span
          className={`mt-3 inline-flex h-8 w-fit items-center bg-white px-2.5 text-[12px] font-bold ${cta}`}
        >
          Shop Now <span aria-hidden="true">›</span>
        </span>
      </span>
      <span className="absolute inset-y-4 right-4 flex w-[42%] items-center justify-center">
        <span className="flex h-full w-full items-center justify-center bg-white">
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
