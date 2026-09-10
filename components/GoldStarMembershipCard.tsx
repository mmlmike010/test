import CostcoLogo from "@/components/CostcoLogo";
import GoldStarMark from "@/components/GoldStarMark";
import KirkIdPhoto from "@/components/KirkIdPhoto";
import MembershipBarcode from "@/components/MembershipBarcode";

/** Landscape Gold Star card at CR80 credit-card proportion. Visual only. */
export default function GoldStarMembershipCard() {
  return (
    <div className="aspect-[1.586] bg-[#f3ead0] border border-[#c9b27a] rounded-[8px] overflow-hidden shadow-[0_2px_10px_rgba(26,18,8,0.14)] flex flex-col">
      <div className="h-[5px] bg-costco-red shrink-0" />
      <div className="h-[2px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c] shrink-0" />
      <div className="flex-1 min-h-0 px-3 pt-2 pb-1.5 flex gap-2.5">
        <div className="min-w-0 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <CostcoLogo compact />
            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              <GoldStarMark size={16} />
              <div className="text-right leading-none">
                <p className="text-[8px] font-extrabold tracking-[0.18em] text-costco-red uppercase">
                  Gold Star
                </p>
                <p className="mt-0.5 text-[7px] font-bold tracking-[0.14em] text-costco-blue uppercase">
                  Membership
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-[18px] font-black tracking-tight text-[#1a1a1a] leading-none">
              KIRK
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-costco-red uppercase">
              Gold Star Member
            </p>
            <p className="mt-0.5 text-[12px] font-bold text-costco-blue tabular-nums tracking-[0.1em]">
              111 847 11217
            </p>
            <p className="text-[8px] font-semibold tracking-[0.08em] text-[#777] uppercase">
              Member Since 2019
            </p>
          </div>
        </div>
        <KirkIdPhoto className="w-[22%] max-w-[84px] self-stretch min-h-0 rounded-[2px] border-[3px] border-white shadow-[0_1px_2px_rgba(26,18,8,0.28)] shrink-0" />
      </div>
      <div className="px-3 pb-1.5 shrink-0">
        <MembershipBarcode className="h-5 w-full text-[#1a1a1a]" />
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="inline-flex h-4 items-center rounded-[2px] bg-costco-red px-1.5 text-[8px] font-black tracking-wide text-white">
            MEMBER
          </span>
          <p className="text-[9px] text-[#555] font-semibold tabular-nums tracking-wide">
            GS · 11217 · BROOKLYN
          </p>
        </div>
      </div>
      <div className="h-[5px] bg-costco-blue shrink-0" />
    </div>
  );
}
