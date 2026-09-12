/** Visual-only Park Slope locator. Does not geocode or change delivery. */
export default function WarehouseLocatorMap() {
  return (
    <div className="relative overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-[#d7e4c8]">
      <svg
        viewBox="0 0 720 280"
        className="h-[280px] w-full"
        aria-label="Map of Brooklyn warehouse"
      >
        <rect width="720" height="280" fill="#e7e2d6" />
        <path d="M0 0h118v280H0z" fill="#9fb7c8" />
        <path d="M118 0c28 40 22 90 8 140 16 48 10 90-6 140H0V0z" fill="#8eabc0" />
        <path d="M548 0h172v280H548z" fill="#b7c99a" />
        <path d="M548 18c40 20 86 16 140 28v80c-46-8-90 10-140 6V18z" fill="#9db57f" />
        <path d="M548 148c48 8 96-6 140 10v70c-50-10-88 8-140 0v-80z" fill="#a6bc88" />

        <g stroke="#f4f0e6" strokeWidth="10">
          <path d="M150 0v280M230 0v280M310 0v280M390 0v280M470 0v280" />
          <path d="M118 36h430M118 84h430M118 132h430M118 180h430M118 228h430" />
        </g>
        <g stroke="#d9d1c0" strokeWidth="2">
          <path d="M190 0v280M270 0v280M350 0v280M430 0v280" />
          <path d="M118 60h430M118 108h430M118 156h430M118 204h430M118 252h430" />
        </g>
        <path d="M310 0v280" stroke="#c4b79d" strokeWidth="7" />
        <path d="M118 132h430" stroke="#c4b79d" strokeWidth="6" />

        <text x="302" y="20" fill="#7a7264" fontSize="11" fontFamily="Arial, Helvetica, sans-serif">
          5th Ave
        </text>
        <text x="382" y="20" fill="#7a7264" fontSize="11" fontFamily="Arial, Helvetica, sans-serif">
          6th Ave
        </text>
        <text x="462" y="20" fill="#7a7264" fontSize="11" fontFamily="Arial, Helvetica, sans-serif">
          7th Ave
        </text>
        <text x="124" y="128" fill="#7a7264" fontSize="11" fontFamily="Arial, Helvetica, sans-serif">
          Union St
        </text>
        <text x="560" y="150" fill="#5f6d48" fontSize="12" fontFamily="Arial, Helvetica, sans-serif">
          Prospect Park
        </text>
        <text x="16" y="150" fill="#35566a" fontSize="11" fontFamily="Arial, Helvetica, sans-serif">
          Gowanus
        </text>

        <path
          d="M382 124c0-16 12-28 28-28s28 12 28 28c0 22-28 46-28 46s-28-24-28-46z"
          fill="#E31837"
        />
        <circle cx="410" cy="124" r="8" fill="#fff" />
      </svg>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-[3px] bg-white px-2.5 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
        <p className="text-[13px] font-bold text-[#1a1a1a]">Brooklyn</p>
        <p className="text-[11px] text-[#555]">184 6th Ave · 2.4 mi</p>
      </div>
    </div>
  );
}
