const SHORTCUTS: {
  label: string;
  image: string;
  department: string | null;
}[] = [
  {
    label: "What's New",
    image: "/products/mosaic-2.png?v=1",
    department: null,
  },
  {
    label: "Limited-Time Offers",
    image: "/products/mosaic-15.png?v=1",
    department: null,
  },
  {
    label: "Kirkland Signature",
    image: "/products/mosaic-10.png?v=1",
    department: "Kirkland Signature",
  },
  {
    label: "Grocery",
    image: "/products/mosaic-23.png?v=1",
    department: "Dairy & Eggs",
  },
  {
    label: "Household",
    image: "/products/mosaic-19.png?v=1",
    department: "Household",
  },
  {
    label: "Baby",
    image: "/products/mosaic-14.png?v=1",
    department: "Baby",
  },
  {
    label: "Bakery",
    image: "/products/mosaic-15.png?v=1",
    department: "Bakery",
  },
  {
    label: "Wine & spirits",
    image: "/products/mosaic-16.png?v=1",
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
            className="w-[112px] shrink-0 bg-white text-center"
          >
            <span className="mx-auto block h-[96px] w-[96px] overflow-hidden rounded-full bg-[#eceef1] hover:ring-2 hover:ring-costco-blue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover"
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
