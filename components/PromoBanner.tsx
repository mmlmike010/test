export default function PromoBanner() {
  return (
    <div className="bg-[#005DAA] text-white shrink-0">
      <div className="max-w-[1800px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px]">
        <p className="font-semibold tracking-tight">
          Costco favorites delivered in as fast as 1 hour
        </p>
        <p className="text-white/85">
          Executive members: $10 monthly credit{" "}
          <span className="text-white/70">· $150 min spend</span>
        </p>
      </div>
    </div>
  );
}
