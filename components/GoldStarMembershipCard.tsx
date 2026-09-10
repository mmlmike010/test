import CostcoLogo from "@/components/CostcoLogo";
import GoldStarMark from "@/components/GoldStarMark";
import KirkMark from "@/components/KirkMark";
import MembershipBarcode from "@/components/MembershipBarcode";

/** Landscape Gold Star card. Visual only — not a real membership. */
export default function GoldStarMembershipCard() {
  return (
    <div className="bg-[#f7f1de] border border-[#d4c194] rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(26,18,8,0.12)]">
      <div className="h-[6px] bg-costco-red" />
      <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <CostcoLogo compact />
          <div className="flex items-center gap-1.5 pt-0.5">
            <GoldStarMark size={20} />
            <div className="text-right leading-none">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-costco-red uppercase">
                Gold Star
              </p>
              <p className="mt-1 text-[8px] font-bold tracking-[0.16em] text-costco-blue uppercase">
                Membership
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <div className="w-[52px] h-[64px] rounded-[3px] border border-[#c9b27a] bg-[#efe6c8] flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
            <KirkMark size={34} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-black tracking-tight text-[#1a1a1a] leading-none">
              KIRK
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.14em] text-costco-red uppercase">
              Gold Star Member
            </p>
            <p className="mt-1 text-[13px] font-bold text-costco-blue tabular-nums tracking-[0.12em]">
              111 847 11217
            </p>
            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.08em] text-[#777] uppercase">
              Member Since 2019
            </p>
          </div>
        </div>
        <div className="mt-2.5">
          <MembershipBarcode className="h-6 w-full text-[#1a1a1a]" />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="inline-flex h-5 items-center rounded-[2px] bg-costco-red px-1.5 text-[9px] font-black tracking-wide text-white">
              MEMBER
            </span>
            <p className="text-[10px] text-[#555] font-semibold tabular-nums tracking-wide">
              GS · 11217 · BROOKLYN
            </p>
          </div>
        </div>
      </div>
      <div className="h-[6px] bg-costco-blue" />
    </div>
  );
}
