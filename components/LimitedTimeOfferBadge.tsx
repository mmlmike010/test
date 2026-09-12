/** costco.com Limited-Time Offers flag. UI only. */
export default function LimitedTimeOfferBadge({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      className={`absolute left-0 top-0 z-[1] bg-costco-red font-bold uppercase tracking-wide text-white ${
        compact ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-1 text-[10px]"
      }`}
    >
      Limited-Time Offers
    </span>
  );
}
