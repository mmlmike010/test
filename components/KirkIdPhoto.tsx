import KirkMark from "@/components/KirkMark";

/** Warehouse-style ID portrait for the Gold Star card. Visual only. */
export default function KirkIdPhoto({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2px] ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#c9d2db] via-[#8f9ba8] to-[#5f6b78]" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" />
      <div className="absolute inset-0 flex items-end justify-center pb-[10%]">
        <KirkMark size={44} className="shadow-[0_1px_3px_rgba(20,24,32,0.35)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_14px_rgba(20,24,32,0.28)]" />
    </div>
  );
}
