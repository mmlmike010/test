import CostcoLogo from "@/components/CostcoLogo";
import GoldStarMark from "@/components/GoldStarMark";
import KirkIdPhoto from "@/components/KirkIdPhoto";
import MembershipBarcode from "@/components/MembershipBarcode";
import MembershipQr from "@/components/MembershipQr";

/** Warehouse Gold Star card. Visual only. */
export default function GoldStarMembershipCard() {
  return (
    <div className="relative bg-white border border-[#e5e5e5] rounded-[10px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <div className="h-[4px] bg-costco-red" />
      <div className="px-3 pt-2 flex items-start justify-between gap-2">
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
      <div className="px-3 pt-2 pb-1.5 flex gap-3 items-center">
        <KirkIdPhoto className="w-[72px] aspect-[3/4] rounded-[2px] border border-[#d0d0d0] shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_0_0_3px_#f7f6f2] shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-black tracking-tight text-[#1a1a1a] leading-none">
            KIRK
          </p>
          <p className="mt-1 text-[9px] font-bold tracking-[0.12em] text-costco-red uppercase">
            Gold Star Member
          </p>
          <p className="mt-1.5 text-[15px] font-bold text-costco-blue tabular-nums tracking-[0.1em]">
            111 847 11217
          </p>
          <p className="mt-1 text-[8px] font-semibold tracking-[0.08em] text-[#777] uppercase">
            Member Since 2019 · Expires 09/27
          </p>
        </div>
        <MembershipQr className="h-[72px] w-[72px] border border-[#ececec] bg-white p-1.5 shrink-0" />
      </div>
      <div className="px-3 pb-2">
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
      <div className="h-[4px] bg-costco-blue" />
    </div>
  );
}
