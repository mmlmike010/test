/** Costco Wholesale lockup: red COSTCO, three blue rules, blue WHOLESALE. */
export default function CostcoLogo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      className="inline-flex flex-col items-center leading-none"
      aria-label="Costco Wholesale"
    >
      <span
        className={`font-black tracking-tight text-[#E31837] ${
          compact ? "text-[26px]" : "text-[32px]"
        }`}
        style={{ fontFamily: "Arial Black, Arial, Helvetica, sans-serif" }}
      >
        COSTCO
      </span>
      <span className={`flex flex-col w-full ${compact ? "gap-[2px] my-[3px]" : "gap-[2.5px] my-1"}`}>
        <span className="block h-[2.5px] bg-[#005DAA]" />
        <span className="block h-[2.5px] bg-[#005DAA]" />
        <span className="block h-[2.5px] bg-[#005DAA]" />
      </span>
      <span
        className={`font-bold text-[#005DAA] ${
          compact ? "text-[8px] tracking-[0.38em]" : "text-[9px] tracking-[0.42em]"
        }`}
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        WHOLESALE
      </span>
    </span>
  );
}
