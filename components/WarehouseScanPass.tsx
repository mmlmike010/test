import MembershipQr from "@/components/MembershipQr";

/** Costco-app warehouse-entry QR. Visual only. */
export default function WarehouseScanPass() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#c9b27a] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
      <div className="flex items-center gap-3 px-3 py-3">
        <MembershipQr className="h-[88px] w-[88px] shrink-0 border border-[#eee] bg-white p-1.5" />
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-costco-red uppercase">
            Gold Star
          </p>
          <p className="mt-1 text-[16px] font-black tracking-tight text-[#1a1a1a] leading-none">
            KIRK
          </p>
          <p className="mt-1.5 text-[13px] font-bold tabular-nums tracking-[0.1em] text-costco-blue">
            111 847 11217
          </p>
          <p className="mt-1 text-[11px] font-semibold text-[#555]">
            Scan at the warehouse
          </p>
        </div>
      </div>
      <div className="h-[4px] bg-costco-blue" />
    </div>
  );
}
