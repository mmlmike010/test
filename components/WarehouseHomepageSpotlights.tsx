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
        zoom="scale-[1.45] group-hover:scale-[1.55]"
        onClick={() => onPick("Dairy & Eggs")}
      />
      <SpotlightTile
        src="/products/19.png?v=3"
        kicker="Household"
        title="Laundry & more"
        panel="bg-costco-red"
        cta="text-costco-red"
        zoom="scale-[1.3] group-hover:scale-[1.4]"
        onClick={() => onPick("Household")}
      />
      <SpotlightTile
        src="/products/15.png?v=2"
        kicker="Bakery"
        title="Fresh from the case"
        panel="bg-[#1a1a1a]"
        cta="text-[#1a1a1a]"
        zoom="scale-[1.4] group-hover:scale-[1.5]"
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
  zoom,
  onClick,
}: {
  src: string;
  kicker: string;
  title: string;
  panel: string;
  cta: string;
  zoom: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-[184px] overflow-hidden text-left"
    >
      <span
        className={`flex w-[48%] flex-col justify-center px-4 py-4 ${panel}`}
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
      <span className="flex w-[52%] items-center justify-center overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className={`h-[88%] w-[80%] object-contain transition-transform duration-300 ${zoom}`}
        />
      </span>
    </button>
  );
}
