/** Costco Wholesale lockup: red COSTCO, three blue rules, blue WHOLESALE. */
export default function CostcoLogo({
  compact = false,
  tone = "default",
  wordmark = false,
}: {
  compact?: boolean;
  tone?: "default" | "onRed";
  /** Single COSTCO word — costco.com red utility bar. */
  wordmark?: boolean;
}) {
  const onRed = tone === "onRed";
  if (wordmark) {
    return (
      <span
        className={`inline-block font-black tracking-tight leading-none ${
          onRed ? "text-white" : "text-[#E31837]"
        } ${compact ? "text-[28px]" : "text-[32px]"}`}
        style={{ fontFamily: "Arial Black, Arial, Helvetica, sans-serif" }}
        aria-label="Costco"
      >
        COSTCO
      </span>
    );
  }
  return (
    <span
      className="inline-flex flex-col items-center leading-none"
      aria-label="Costco Wholesale"
    >
      <span
        className={`font-black tracking-tight ${
          onRed ? "text-white" : "text-[#E31837]"
        } ${compact ? "text-[26px]" : "text-[32px]"}`}
        style={{ fontFamily: "Arial Black, Arial, Helvetica, sans-serif" }}
      >
        COSTCO
      </span>
      <span className={`flex flex-col w-full ${compact ? "gap-[2px] my-[3px]" : "gap-[2.5px] my-1"}`}>
        <span className={`block h-[2.5px] ${onRed ? "bg-white" : "bg-[#005DAA]"}`} />
        <span className={`block h-[2.5px] ${onRed ? "bg-white" : "bg-[#005DAA]"}`} />
        <span className={`block h-[2.5px] ${onRed ? "bg-white" : "bg-[#005DAA]"}`} />
      </span>
      <span
        className={`font-bold ${onRed ? "text-white" : "text-[#005DAA]"} ${
          compact ? "text-[8px] tracking-[0.38em]" : "text-[9px] tracking-[0.42em]"
        }`}
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        WHOLESALE
      </span>
    </span>
  );
}
