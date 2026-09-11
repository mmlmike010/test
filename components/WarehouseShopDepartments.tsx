import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop by Department tiles. Official packs only. UI only. */
export default function WarehouseShopDepartments({
  selected,
  onPick,
}: {
  selected: string[];
  onPick: (label: string | null) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white">
      <div className="flex items-center justify-between border-b border-[#ececec] px-3 py-2">
        <p className="text-[13px] font-bold text-[#1a1a1a]">
          Shop by Department
        </p>
        <button
          type="button"
          className="text-[12px] font-bold text-costco-blue hover:underline"
          onClick={() => onPick(null)}
        >
          Shop All
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1 p-2">
        {WAREHOUSE_NAV_TILES.map(({ label, image }) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              className={`flex flex-col items-center gap-1 rounded-[3px] px-1 py-1.5 text-center ${
                active ? "bg-[#f7fbfe] ring-1 ring-costco-blue" : "hover:bg-[#f7fbfe]"
              }`}
              onClick={() => onPick(active ? null : label)}
            >
              <span className="relative h-14 w-14 overflow-hidden rounded-[3px] border border-[#e8e8e8] bg-[#f6f6f6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain p-1"
                />
              </span>
              <span className="text-[10px] font-bold leading-snug text-costco-blue">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
