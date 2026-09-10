/** Gold star used on Costco Gold Star membership cards. */
export default function GoldStarMark({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2.4 14.7 8l6.3.9-4.5 4.4 1.1 6.3L12 16.6 6.4 19.6l1.1-6.3L3 8.9 9.3 8 12 2.4Z"
        fill="#C9A227"
        stroke="#A3841C"
        strokeWidth="0.8"
      />
    </svg>
  );
}
