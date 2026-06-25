import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;

  // Layout
  centered?: boolean;
  className?: string;

  // Optional highlighted word inside title
  // e.g. title="Built for real systems" highlight="real systems"
  // → "Built for <span class=cyan>real systems</span>"
  highlight?: string;

  // Reduce bottom margin (e.g. when content follows tightly)
  compact?: boolean;

  // Eyebrow variant
  variant?: "default" | "pill";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
  className,
  highlight,
  compact = false,
  variant = "default",
}: SectionHeaderProps) {
  // Optionally wrap a word in cyan
  const renderedTitle = highlight
    ? title.split(highlight).map((part, i, arr) =>
        i < arr.length - 1 ? (
          <span key={i}>
            {part}
            <span className="text-[#00D4FF]">{highlight}</span>
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )
    : title;

  return (
    <div
      className={cn(
        compact ? "mb-10" : "mb-16",
        centered && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {/* ── Eyebrow ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-2 mb-4",
          centered && "justify-center"
        )}
      >
        {variant === "default" ? (
          <>
            <span className="w-4 h-px bg-[#00D4FF] shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]">
              {eyebrow}
            </span>
          </>
        ) : (
          /* pill variant */
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/6 text-[10px] font-mono uppercase tracking-[0.12em] text-[#00D4FF]">
            <span className="w-1 h-1 rounded-full bg-[#00D4FF] animate-pulse" />
            {eyebrow}
          </span>
        )}
      </div>

      {/* ── Title ───────────────────────────────────────────── */}
      <h2 className="text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight">
        {renderedTitle}
      </h2>

      {/* ── Description ─────────────────────────────────────── */}
      {description && (
        <p
          className={cn(
            "mt-4 text-slate-400 text-base leading-relaxed max-w-2xl",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}