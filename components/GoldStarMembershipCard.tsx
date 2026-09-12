import GoldStarMark from "@/components/GoldStarMark";
import KirkIdPhoto from "@/components/KirkIdPhoto";
import MembershipBarcode from "@/components/MembershipBarcode";
import MembershipQr from "@/components/MembershipQr";

/** Compact warehouse Gold Star strip. Visual only. */
export default function GoldStarMembershipCard() {
  return (
    <div className="relative overflow-hidden rounded-[3px] border border-[#e5e5e5] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="h-[3px] bg-costco-red" />
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <KirkIdPhoto className="h-10 w-[30px] shrink-0 rounded-[2px] border border-[#d0d0d0] shadow-[inset_0_0_0_2px_#f7f6f2]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <GoldStarMark size={12} />
            <p className="text-[11px] font-black leading-none tracking-tight text-[#1a1a1a]">
              KIRK
            </p>
            <span className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-costco-red">
              Gold Star
            </span>
          </div>
          <p className="mt-0.5 text-[12px] font-bold tabular-nums tracking-[0.08em] text-costco-blue">
            111 847 11217
          </p>
          <MembershipBarcode className="mt-0.5 h-2.5 w-full text-[#1a1a1a]" />
        </div>
        <MembershipQr className="h-10 w-10 shrink-0 border border-[#ececec] bg-white p-0.5" />
      </div>
      <div className="h-[3px] bg-costco-blue" />
    </div>
  );
}
