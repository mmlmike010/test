import KirkMark from "@/components/KirkMark";

/** Warehouse-desk ID portrait well for the Gold Star card. Visual only. */
export default function KirkIdPhoto({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#8f9ba8] ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kirk/id-backdrop.jpg?v=1"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#3d4752]/40" />
      <div className="absolute inset-0 flex items-end justify-center pb-[10%]">
        <KirkMark size={44} className="shadow-[0_1px_3px_rgba(20,24,32,0.35)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_14px_rgba(20,24,32,0.28)]" />
    </div>
  );
}
