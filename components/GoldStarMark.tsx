import { useId } from "react";

/** Gold star used on Costco Gold Star membership cards. */
export default function GoldStarMark({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const uid = `gold-star-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={uid} x1="4" y1="2" x2="20" y2="22">
          <stop offset="0" stopColor="#F6E3A1" />
          <stop offset="0.45" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#8C6A14" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.4 14.7 8l6.3.9-4.5 4.4 1.1 6.3L12 16.6 6.4 19.6l1.1-6.3L3 8.9 9.3 8 12 2.4Z"
        fill={`url(#${uid})`}
        stroke="#A3841C"
        strokeWidth="0.8"
      />
    </svg>
  );
}
