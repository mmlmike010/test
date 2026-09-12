/** Visual-only costco.com warehouse map. Does not geocode or change delivery. */
export default function WarehouseLocatorMap() {
  return (
    <div
      className="relative overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-[#9bb6c9]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 720 220" className="h-[220px] w-full">
        <rect width="720" height="220" fill="#8eadc2" />
        <path d="M0 0h720v78c-90 18-160 8-250 22-88 14-150-10-248-6C130 98 70 86 0 104V0z" fill="#7f9eb4" />
        <path d="M0 220c120-20 200 4 310-16 86-16 140 10 220 6 86-4 130-22 190-8v38H0z" fill="#7a9aaf" />
        <path
          d="M72 46l196-18 238 32 142 8v118l-128 22-246-16-202 10z"
          fill="#efe7d6"
        />
        <path
          d="M96 70h168M96 102h210M96 134h186M148 52v118M210 48v128M278 56v112M348 62l8 108M418 68v104M488 74v96"
          stroke="#d4c7b0"
          strokeWidth="3"
        />
        <path d="M72 118h510" stroke="#c4b79d" strokeWidth="5" />
        <path d="M318 46v152" stroke="#c4b79d" strokeWidth="5" />
        <path
          d="M404 102c0-18 14-32 32-32s32 14 32 32c0 24-32 52-32 52s-32-28-32-52z"
          fill="#E31837"
        />
        <circle cx="436" cy="102" r="9" fill="#fff" />
      </svg>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-[3px] bg-white px-2.5 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
        <p className="text-[13px] font-bold text-[#1a1a1a]">Brooklyn</p>
        <p className="text-[11px] text-[#555]">Warehouse #1847 · 2.4 mi</p>
      </div>
    </div>
  );
}
