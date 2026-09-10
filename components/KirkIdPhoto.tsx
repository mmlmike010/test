/** Warehouse-desk ID portrait for the Gold Star card. Visual only. */
export default function KirkIdPhoto({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#c5d0da] ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kirk/id-portrait.jpg?v=10"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_10px_rgba(20,24,32,0.22)]" />
    </div>
  );
}
