import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop mega menu. Official pack thumbs only. UI only. */
export default function WarehouseShopMenu({
  onPick,
}: {
  onPick: (label: string | null) => void;
}) {
  return (
    <div className="absolute left-0 top-full z-[80] w-[min(980px,96vw)] overflow-hidden border border-[#c4c4c4] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-2.5">
        <p className="text-[15px] font-bold text-[#1a1a1a]">Shop</p>
        <button
          type="button"
          className="text-[13px] font-bold text-costco-blue hover:underline"
          onClick={() => onPick(null)}
        >
          Shop All
        </button>
      </div>
      <div className="flex">
        <div className="w-[220px] shrink-0 border-r border-[#ececec] py-2">
          <button
            type="button"
            className="flex w-full items-center px-4 py-2 text-left text-[13px] font-bold text-costco-blue hover:bg-[#f7fbfe] hover:underline"
            onClick={() => onPick(null)}
          >
            Shop All Departments
          </button>
          {WAREHOUSE_NAV_TILES.map(({ label }) => (
            <button
              key={`nav-${label}`}
              type="button"
              className="flex w-full items-center px-4 py-2 text-left text-[13px] font-semibold text-costco-blue hover:bg-[#f7fbfe] hover:underline"
              onClick={() => onPick(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-3 p-4">
          {WAREHOUSE_NAV_TILES.map(({ label, mosaic }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col gap-1.5 px-1 py-1 text-left hover:bg-[#f7fbfe]"
              onClick={() => onPick(label)}
            >
              <span className="relative aspect-[16/10] w-full overflow-hidden bg-[#eceef1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mosaic}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </span>
              <span className="text-[13px] font-bold leading-snug text-costco-blue hover:underline">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
