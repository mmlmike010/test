import GoldStarMembershipCard from "@/components/GoldStarMembershipCard";

/** costco.com Gold Star campaign. Card stays compact. UI only. */
export default function WarehouseMembershipBanner({
  onShop,
}: {
  onShop: () => void;
}) {
  return (
    <section className="overflow-hidden bg-costco-blue">
      <div className="grid items-stretch lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="px-8 py-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/80">
            Gold Star
          </p>
          <p className="mt-2 text-[36px] font-bold leading-[1.05] text-white">
            Membership
          </p>
          <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-white/85">
            Member pricing on Kirkland Signature. Prices higher than warehouse.
          </p>
          <button
            type="button"
            onClick={onShop}
            className="mt-5 inline-flex h-10 items-center bg-white px-4 text-[14px] font-bold text-costco-blue"
          >
            Shop member savings ›
          </button>
        </div>
        <div className="flex items-center justify-center bg-white px-5 py-6">
          <GoldStarMembershipCard />
        </div>
      </div>
    </section>
  );
}
