import CostcoLogo from "@/components/CostcoLogo";
import GoldStarMark from "@/components/GoldStarMark";
import KirkIdPhoto from "@/components/KirkIdPhoto";
import MembershipBarcode from "@/components/MembershipBarcode";

/** Landscape Gold Star card at CR80 credit-card proportion. Visual only. */
export default function GoldStarMembershipCard() {
  return (
    <div className="relative flex aspect-[1.586] w-full max-w-[340px] flex-col overflow-hidden rounded-[8px] border border-[#c9b27a] bg-[#f3ead0] shadow-[0_2px_10px_rgba(26,18,8,0.14)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kirk/card-stock.jpg?v=2"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative h-[5px] shrink-0 bg-costco-red" />
      <div className="relative h-[2px] shrink-0 bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
      <div className="relative flex min-h-0 flex-1 gap-2.5 px-3 pb-1.5 pt-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <CostcoLogo compact />
            <div className="flex shrink-0 items-center gap-1 pt-0.5">
              <GoldStarMark size={16} />
              <div className="text-right leading-none">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-costco-red">
                  Gold Star
                </p>
                <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.14em] text-costco-blue">
                  Membership
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-[18px] font-black leading-none tracking-tight text-[#1a1a1a]">
              KIRK
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-costco-red">
              Gold Star Member
            </p>
            <p className="mt-0.5 text-[12px] font-bold tabular-nums tracking-[0.1em] text-costco-blue">
              111 847 11217
            </p>
            <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#777]">
              Member Since 2019
            </p>
          </div>
        </div>
        <KirkIdPhoto className="mt-0.5 aspect-[3/4] w-[26%] max-w-[92px] shrink-0 self-start rounded-[2px] border-[3px] border-white shadow-[0_1px_2px_rgba(26,18,8,0.28)]" />
      </div>
      <div className="relative shrink-0 px-3 pb-1.5">
        <MembershipBarcode className="h-5 w-full text-[#1a1a1a]" />
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="inline-flex h-4 items-center rounded-[2px] bg-costco-red px-1.5 text-[8px] font-black tracking-wide text-white">
            MEMBER
          </span>
          <p className="text-[9px] font-semibold tabular-nums tracking-wide text-[#555]">
            GS · 11217 · BROOKLYN
          </p>
        </div>
      </div>
      <div className="relative h-[5px] shrink-0 bg-costco-blue" />
    </div>
  );
}
