const SHORTCUTS: {
  label: string;
  image: string;
  department: string | null;
}[] = [
  {
    label: "What's New",
    image: "/products/banner-2.png?v=1",
    department: null,
  },
  {
    label: "Limited-Time Offers",
    image: "/products/banner-15.png?v=1",
    department: null,
  },
  {
    label: "Kirkland Signature",
    image: "/products/banner-10.png?v=1",
    department: "Kirkland Signature",
  },
  {
    label: "Grocery",
    image: "/products/banner-23.png?v=1",
    department: "Dairy & Eggs",
  },
  {
    label: "Household",
    image: "/products/banner-19.png?v=1",
    department: "Household",
  },
  {
    label: "Baby",
    image: "/products/banner-14.png?v=1",
    department: "Baby",
  },
  {
    label: "Bakery",
    image: "/products/banner-15.png?v=1",
    department: "Bakery",
  },
  {
    label: "Wine & spirits",
    image: "/products/banner-16.png?v=1",
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
            <span className="mx-auto flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full bg-[#f6f7f8] hover:ring-2 hover:ring-costco-blue">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="h-[82px] w-[82px] object-contain"
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
