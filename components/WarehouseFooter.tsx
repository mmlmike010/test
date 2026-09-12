"use client";

import CostcoLogo from "@/components/CostcoLogo";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import {
  formatAddress,
  useSessionStore,
} from "@/lib/store/session";
import { EMPTY_WAREHOUSE_FACETS } from "@/lib/ui/warehouseSearch";

/** costco.com dark footer. UI only — never sent to Kirk. */
export default function WarehouseFooter({
  className = "",
}: {
  className?: string;
}) {
  const address = useSessionStore((s) => s.address);
  const setSheet = useSessionStore((s) => s.setSheet);
  const inspect = useCatalogStore((s) => s.inspect);
  const search = useCatalogStore((s) => s.search);
  const closeCart = useCartStore((s) => s.closeCart);

  const shopKirkland = () => {
    inspect(null);
    closeCart();
    setSheet(null);
    useCatalogStore.setState({
      q: "kirkland",
      department: null,
      tag: null,
      openList: null,
      openRecipe: null,
      listTone: "warehouse",
      warehouseFacets: EMPTY_WAREHOUSE_FACETS,
      warehouseSort: "relevance",
    });
    void search();
    document.querySelector("main")?.scrollTo({ top: 0 });
  };

  return (
    <footer className={`overflow-hidden bg-[#333] text-white ${className}`}>
      <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-6 sm:grid-cols-4 lg:px-6">
        <div>
          <CostcoLogo compact tone="onRed" />
          <p className="mt-3 text-[12px] leading-relaxed text-white/75">
            Delivery to {address.line1}, {formatAddress(address)}. Membership
            required. Prices higher than warehouse.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f3e3a3]">
            Customer Service
          </p>
          <div className="mt-2 flex flex-col items-start gap-1.5">
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={() => setSheet("customer", "warehouse")}
            >
              Customer Service
            </button>
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={() => setSheet("membership", "warehouse")}
            >
              Membership
            </button>
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={() => setSheet("signin", "warehouse")}
            >
              Orders &amp; Returns
            </button>
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={() => setSheet("delivery", "warehouse")}
            >
              Delivery
            </button>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f3e3a3]">
            Get to Know Costco
          </p>
          <div className="mt-2 flex flex-col items-start gap-1.5">
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={shopKirkland}
            >
              Kirkland Signature
            </button>
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={shopKirkland}
            >
              Shop
            </button>
            <button
              type="button"
              className="text-[13px] text-white hover:underline"
              onClick={() => setSheet("pricing", "sameday")}
            >
              Pricing &amp; fees
            </button>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f3e3a3]">
            Locations &amp; Delivery
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-white/80">
            Same-Day Delivery to {formatAddress(address)}. Gold Star membership
            required for member pricing.
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[11px] text-white/65 lg:px-6">
          <p>© 2026 Costco Wholesale Corporation</p>
          <p>Terms and Conditions · Privacy Policy · Your Privacy Rights</p>
        </div>
      </div>
    </footer>
  );
}
