/** Instacart carrot used on live Same-Day "Powered by Instacart" lockups. */
export default function InstacartMark({
  size = 12,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8.2 3.1c.4-.8 1.1-1.4 2-1.7.15.9-.05 1.8-.6 2.5-.5.6-1.2 1-2 .9-.15-.85.1-1.7.6-1.7Z"
        fill="#0AAD0A"
      />
      <path
        d="M4.1 6.2c.7-1.6 2.2-2.6 3.9-2.6 1.8 0 3.3 1 4 2.6.4.9.4 1.9.1 2.8-.6 1.8-2.2 4.2-4.1 5.4-1.9-1.2-3.5-3.6-4.1-5.4-.3-.9-.3-1.9.2-2.8Z"
        fill="#FF7009"
      />
    </svg>
  );
}
