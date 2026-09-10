"use client";

export type SuggestedActionChipTone = "blue" | "red";

export interface SuggestedActionChipProps {
  label: string;
  tone?: SuggestedActionChipTone;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Suggested action chip for the Ask Costco membership assistant.
 * Use for Buy Again, Member-Only Savings, and occasion planners.
 */
export default function SuggestedActionChip({
  label,
  tone = "blue",
  onClick,
  disabled = false,
}: SuggestedActionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] w-full shrink-0 items-center gap-3 rounded-full border border-costco-ci-border bg-costco-chip py-3 pr-4 pl-3.5 text-left transition-colors hover:bg-costco-chip-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue"
    >
      <span
        aria-hidden="true"
        className={`relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[14px] text-[12px] leading-none font-bold text-white ${
          tone === "red" ? "bg-costco-red" : "bg-costco-blue"
        }`}
      >
        ★
      </span>
      <span className="min-w-0 flex-1 text-[14px] leading-normal font-semibold text-costco-text">
        {label}
      </span>
    </button>
  );
}
