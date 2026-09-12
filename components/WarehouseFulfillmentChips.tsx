/** costco.com search fulfillment chips. UI only — does not change Kirk. */
export default function WarehouseFulfillmentChips({
  count,
}: {
  count: number;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="list"
      aria-label="Delivery method"
    >
      <span
        role="listitem"
        className="inline-flex items-center rounded-[3px] border-2 border-costco-blue bg-[#f7fbfe] px-2.5 py-1 text-[13px] font-bold text-costco-blue"
      >
        Same-Day Delivery
        <span className="ml-1.5 font-semibold text-[#72767E]">{count}</span>
      </span>
      <span
        role="listitem"
        className="inline-flex items-center rounded-[3px] border border-[#c4c4c4] bg-white px-2.5 py-1 text-[13px] font-bold text-[#555]"
      >
        2-Day Delivery
      </span>
      <span
        role="listitem"
        className="inline-flex items-center rounded-[3px] border border-[#c4c4c4] bg-white px-2.5 py-1 text-[13px] font-bold text-[#555]"
      >
        Warehouse Delivery
      </span>
    </div>
  );
}
