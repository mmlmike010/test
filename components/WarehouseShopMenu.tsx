import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop mega menu. Official pack thumbs only. UI only. */
export default function WarehouseShopMenu({
  onPick,
}: {
  onPick: (label: string | null) => void;
}) {
  return (
    <div className="absolute left-0 top-full z-[80] w-[min(860px,96vw)] overflow-hidden border border-[#c4c4c4] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between border-b border-[#ececec] px-3.5 py-2">
        <p className="text-[13px] font-bold text-[#1a1a1a]">Shop</p>
        <button
          type="button"
          className="text-[13px] font-bold text-costco-blue hover:underline"
          onClick={() => onPick(null)}
        >
          Shop All
        </button>
      </div>
      <div className="flex">
        <div className="w-[200px] shrink-0 border-r border-[#ececec] py-1.5">
          <button
            type="button"
            className="flex w-full items-center px-3.5 py-1.5 text-left text-[13px] font-bold text-costco-blue hover:bg-[#f7fbfe] hover:underline"
            onClick={() => onPick(null)}
          >
            Shop All Departments
          </button>
          {WAREHOUSE_NAV_TILES.map(({ label }) => (
            <button
              key={`nav-${label}`}
              type="button"
              className="flex w-full items-center px-3.5 py-1.5 text-left text-[13px] font-semibold text-costco-blue hover:bg-[#f7fbfe] hover:underline"
              onClick={() => onPick(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-1 p-3">
          {WAREHOUSE_NAV_TILES.map(({ label, image }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-1.5 rounded-[3px] px-2 py-2 text-center hover:bg-[#f7fbfe]"
              onClick={() => onPick(label)}
            >
              <span className="relative h-24 w-24 overflow-hidden rounded-[3px] border border-[#e8e8e8] bg-[#f6f6f6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain p-1.5"
                />
              </span>
              <span className="text-[12px] font-bold leading-snug text-costco-blue hover:underline">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
