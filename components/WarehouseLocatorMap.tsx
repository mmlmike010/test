/** Visual-only costco.com warehouse map. Does not geocode or change delivery. */
export default function WarehouseLocatorMap() {
  return (
    <div
      className="relative overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-[#d9e3ec]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 720 200" className="h-[200px] w-full">
        <rect width="720" height="200" fill="#d4e0ea" />
        <path d="M0 18h720M0 52h720M0 86h720M0 120h720M0 154h720M0 188h720" stroke="#c3d0da" strokeWidth="1" />
        <path d="M48 0v200M120 0v200M192 0v200M264 0v200M336 0v200M408 0v200M480 0v200M552 0v200M624 0v200M696 0v200" stroke="#c3d0da" strokeWidth="1" />
        <path d="M0 70c80 8 140-18 220-8 70 9 120 28 210 14 90-14 150-6 290 18V0H0z" fill="#cfe0ec" />
        <path d="M0 200c110-22 190-8 280-28 70-16 130 6 200 2 90-6 150-24 240-8v34H0z" fill="#c5d6e4" />
        <path d="M38 92h268M38 118h198M86 64v92M210 48v118" stroke="#b7c4ce" strokeWidth="2" />
        <path d="M310 40l210 28-24 96-198-22z" fill="#eef2f5" stroke="#d5dde3" strokeWidth="1" />
        <path d="M334 62h148M334 88h132M334 114h118M358 48v86M412 54v80" stroke="#d7dee4" strokeWidth="1.5" />
        <path d="M392 96c0-14 11-24 24-24s24 10 24 24c0 18-24 38-24 38s-24-20-24-38z" fill="#E31837" />
        <circle cx="416" cy="96" r="7" fill="#fff" />
      </svg>
      <div className="pointer-events-none absolute bottom-2 left-3 rounded-[3px] bg-white/95 px-2 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
        <p className="text-[12px] font-bold text-[#1a1a1a]">Brooklyn</p>
        <p className="text-[11px] text-[#555]">Warehouse #1847 · 2.4 mi</p>
      </div>
    </div>
  );
}
