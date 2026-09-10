export default function PromoBanner() {
  return (
    <div className="bg-[#eef5fb] border-b border-[#d4e3f0] text-[#1a1a1a] shrink-0">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-[40px] flex items-center justify-between gap-4 text-[13px]">
        <p className="font-bold tracking-tight truncate text-costco-blue">
          Costco favorites delivered in as fast as 1 hour
        </p>
        <p className="hidden sm:block text-[#555] shrink-0">
          <span className="font-bold text-[#1a1a1a]">$10 monthly credit</span>
          <span>
            {" "}
            · For Executive members ($150 min spend) · Same-Day requires a
            Costco membership
          </span>
        </p>
      </div>
    </div>
  );
}
