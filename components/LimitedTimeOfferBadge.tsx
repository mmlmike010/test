/** costco.com Limited-Time Offers merch bar. UI only. */
export default function LimitedTimeOfferBadge({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <span
      className={`absolute inset-x-0 top-0 bg-costco-red text-center font-bold uppercase tracking-wide text-white ${
        compact ? "py-0.5 text-[9px]" : "py-1 text-[11px]"
      }`}
    >
      Limited-Time Offers
    </span>
  );
}
