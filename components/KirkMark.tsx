/** Kirkland-inspired mark for the Ask Kirk assistant. Visual only. */
export default function KirkMark({
  size = 40,
  className = "",
  tone = "default",
}: {
  size?: number;
  className?: string;
  tone?: "default" | "onRed";
}) {
  const onRed = tone === "onRed";
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full shadow-sm ${
        onRed ? "bg-white text-[#E31837]" : "bg-[#E31837] text-white"
      } ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="font-semibold leading-none"
        style={{
          fontFamily: "var(--font-kirkland), Georgia, serif",
          fontSize: size * 0.52,
          marginTop: size * 0.08,
        }}
      >
        K
      </span>
    </span>
  );
}
