"use client";

/** costco.com Qty dropdown. UI only — never sent to Kirk. */
export default function WarehouseQtySelect({
  value,
  onChange,
  max = 10,
  labelled = true,
  compact = false,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  labelled?: boolean;
  compact?: boolean;
}) {
  const top = Math.max(max, value, 1);
  const select = (
    <select
      aria-label="Quantity"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`min-w-[72px] rounded-[3px] border border-[#c4c4c4] bg-white px-2 font-bold text-[#1a1a1a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15 ${
        compact ? "h-9 text-[13px]" : "h-12 text-[15px]"
      }`}
    >
      {Array.from({ length: top }, (_, i) => i + 1).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );

  if (!labelled) return select;

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] font-bold text-[#555]">Qty</span>
      {select}
    </label>
  );
}
