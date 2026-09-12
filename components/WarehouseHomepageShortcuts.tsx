import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

const SHORTCUTS: {
  label: string;
  image: string;
  department: string | null;
}[] = [
  {
    label: "What's New",
    image: "/products/2.png?v=2",
    department: null,
  },
  {
    label: "Limited-Time Offers",
    image: "/products/15.png?v=2",
    department: null,
  },
  {
    label: "Kirkland Signature",
    image: "/products/10.png",
    department: "Kirkland Signature",
  },
  {
    label: "Grocery",
    image: "/products/23.png",
    department: "Dairy & Eggs",
  },
  {
    label: "Household",
    image: "/products/19.png?v=3",
    department: "Household",
  },
  {
    label: "Baby",
    image: "/products/14.png",
    department: "Baby",
  },
  {
    label: "Bakery",
    image: "/products/15.png?v=2",
    department: "Bakery",
  },
  {
    label: "Wine & spirits",
    image:
      WAREHOUSE_NAV_TILES.find((tile) => tile.label === "Wine & spirits")
        ?.image ?? "/products/16.png",
    department: "Wine & spirits",
  },
];

/** costco.com homepage circular shortcuts. UI only — does not call Kirk. */
export default function WarehouseHomepageShortcuts({
  onOffers,
  onPick,
}: {
  onOffers: () => void;
  onPick: (label: string | null) => void;
}) {
  return (
    <nav aria-label="Shop shortcuts">
      <div className="flex justify-between gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
        {SHORTCUTS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() =>
              item.department ? onPick(item.department) : onOffers()
            }
            className="w-[104px] shrink-0 bg-white text-center"
          >
            <span className="mx-auto flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border border-[#e5e5e5] bg-white hover:border-costco-blue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="h-[72px] w-[72px] object-contain"
              />
            </span>
            <span className="mt-1.5 block text-[12px] font-bold leading-tight text-costco-blue hover:underline">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
