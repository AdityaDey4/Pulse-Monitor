import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16",
        centered && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {/* Eyebrow — hairline rule + label */}
      <div
        className={cn(
          "flex items-center gap-2 mb-4",
          centered && "justify-center"
        )}
      >
        <span className="w-4 h-px bg-[#00D4FF] shrink-0" />
        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]">
          {eyebrow}
        </span>
      </div>

      {/* Title */}
      <h2
        className={cn(
          "text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight"
        )}
      >
        {title}
      </h2>

      {/* Description */}
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