export default function PromoBanner() {
  return (
    <div className="bg-costco-blue text-white shrink-0">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-[42px] flex items-center justify-between gap-4 text-[13px]">
        <p className="font-bold tracking-tight truncate">
          Costco favorites delivered in as fast as 1 hour
        </p>
        <p className="hidden sm:block text-white/90 shrink-0">
          <span className="font-bold">$10 monthly credit</span>
          <span className="text-white/75">
            {" "}
            · Executive members · $150 min spend
          </span>
        </p>
      </div>
    </div>
  );
}
