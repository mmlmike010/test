import { ChevronRight } from "lucide-react";
import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop by Department mosaic. Rectangular category cards, not a thumb strip. */
export default function WarehouseShopDepartments({
  selected,
  onPick,
}: {
  selected: string[];
  onPick: (label: string | null) => void;
}) {
  return (
    <section className="bg-white">
      <div className="flex items-center justify-between gap-2 px-1 pb-3">
        <h2 className="min-w-0 truncate text-[20px] font-bold text-[#1a1a1a]">
          Shop by Department
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-[12px] font-bold text-costco-blue hover:underline"
          onClick={() => onPick(null)}
        >
          Shop All
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {WAREHOUSE_NAV_TILES.map((tile) => {
          const active = selected.includes(tile.label);
          return (
            <button
              key={tile.label}
              type="button"
              onClick={() => onPick(active ? null : tile.label)}
              className="bg-white text-left"
            >
              <span
                className={`relative flex h-[280px] w-full items-center justify-center overflow-hidden border bg-[#eceef1] ${
                  active
                    ? "border-costco-blue ring-2 ring-costco-blue ring-offset-1"
                    : "border-[#d8d8d8] hover:border-costco-blue"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.image}
                  alt=""
                  className="h-full w-full object-contain p-1"
                />
              </span>
              <span
                className={`mt-2 block text-[14px] font-bold leading-tight text-costco-blue ${
                  active ? "underline" : "hover:underline"
                }`}
              >
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
