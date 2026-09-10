/** Decorative Gold Star barcode. Visual only — not a real membership. */
export default function MembershipBarcode({
  className = "",
}: {
  className?: string;
}) {
  const bars = [
    2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 2,
    1, 3, 1, 2, 1, 1, 2, 1, 1, 3, 1, 1, 2, 1, 2,
  ];
  let x = 0;
  const rects = bars.map((w, i) => {
    const el = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="28" fill="#1a1a1a" /> : null;
    x += w + 1;
    return el;
  });
  return (
    <svg
      viewBox={`0 0 ${x} 28`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {rects}
    </svg>
  );
}