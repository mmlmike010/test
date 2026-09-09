/** Text reconstruction of the Costco Wholesale lockup (red wordmark, three blue rules, blue WHOLESALE). */
export default function CostcoLogo({
  height = 52,
  title = "Costco Wholesale",
}: {
  height?: number;
  title?: string;
}) {
  const width = Math.round(height * (220 / 72));
  return (
    <svg
      role="img"
      aria-label={title}
      width={width}
      height={height}
      viewBox="0 0 220 72"
      className="block"
    >
      <title>{title}</title>
      <text
        x="110"
        y="34"
        textAnchor="middle"
        fill="#E31837"
        fontFamily="Arial Black, Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="0.5"
      >
        COSTCO
      </text>
      <rect x="16" y="40" width="188" height="2.4" fill="#005DAA" />
      <rect x="16" y="45.2" width="188" height="2.4" fill="#005DAA" />
      <rect x="16" y="50.4" width="188" height="2.4" fill="#005DAA" />
      <text
        x="110"
        y="68"
        textAnchor="middle"
        fill="#005DAA"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="5.5"
      >
        WHOLESALE
      </text>
    </svg>
  );
}
