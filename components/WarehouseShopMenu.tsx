import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop mega menu. Official pack thumbs only. UI only. */
export default function WarehouseShopMenu({
  onPick,
}: {
  onPick: (label: string | null) => void;
}) {
  return (
    <div className="absolute left-0 top-full z-[80] w-[min(640px,94vw)] overflow-hidden border border-[#c4c4c4] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
      <div className="flex items-center justify-between border-b border-[#ececec] px-3 py-2">
        <p className="text-[13px] font-bold text-[#1a1a1a]">Shop</p>
        <button
          type="button"
          className="text-[13px] font-bold text-costco-blue hover:underline"
          onClick={() => onPick(null)}
        >
          Shop All
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1 p-2.5">
        {WAREHOUSE_NAV_TILES.map(({ label, image }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-1.5 rounded-[3px] px-1.5 py-2 text-center hover:bg-[#f7fbfe]"
            onClick={() => onPick(label)}
          >
            <span className="relative h-[72px] w-[72px] overflow-hidden rounded-[3px] border border-[#eee] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-contain p-1"
              />
            </span>
            <span className="text-[12px] font-bold leading-snug text-costco-blue hover:underline">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
