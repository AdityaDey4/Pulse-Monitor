import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeStatus = "healthy" | "degraded" | "error" | "connecting" | "paused" | "unknown";
export type BadgeSize   = "sm" | "md" | "lg";

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<
  BadgeStatus,
  { dot: string; text: string; border: string; bg: string; label: string }
> = {
  healthy: {
    dot:    "bg-emerald-400",
    text:   "text-emerald-400",
    border: "border-emerald-500/25",
    bg:     "bg-emerald-500/8",
    label:  "Healthy",
  },
  degraded: {
    dot:    "bg-amber-400",
    text:   "text-amber-400",
    border: "border-amber-500/25",
    bg:     "bg-amber-500/8",
    label:  "Degraded",
  },
  error: {
    dot:    "bg-red-400",
    text:   "text-red-400",
    border: "border-red-500/25",
    bg:     "bg-red-500/8",
    label:  "Error",
  },
  connecting: {
    dot:    "bg-sky-400",
    text:   "text-sky-400",
    border: "border-sky-500/25",
    bg:     "bg-sky-500/8",
    label:  "Connecting",
  },
  paused: {
    dot:    "bg-slate-400",
    text:   "text-slate-400",
    border: "border-slate-500/25",
    bg:     "bg-slate-500/8",
    label:  "Paused",
  },
  unknown: {
    dot:    "bg-slate-500",
    text:   "text-slate-500",
    border: "border-slate-600/25",
    bg:     "bg-slate-600/8",
    label:  "Unknown",
  },
};

const sizeConfig: Record<BadgeSize, { badge: string; dot: string; text: string }> = {
  sm: { badge: "px-2 py-0.5 gap-1.5",   dot: "w-1.5 h-1.5", text: "text-[11px]" },
  md: { badge: "px-2.5 py-1 gap-1.5",   dot: "w-1.5 h-1.5", text: "text-xs"     },
  lg: { badge: "px-3 py-1.5 gap-2",     dot: "w-2 h-2",     text: "text-sm"     },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;       // override default label e.g. "Redis Connected"
  size?: BadgeSize;
  pulse?: boolean;      // animate the dot (default true for healthy/connecting)
  className?: string;
}

export function StatusBadge({
  status,
  label,
  size = "md",
  pulse,
  className,
}: StatusBadgeProps) {
  const cfg  = statusConfig[status];
  const sz   = sizeConfig[size];

  // Default pulse behaviour: healthy and connecting pulse by default
  const shouldPulse = pulse ?? (status === "healthy" || status === "connecting");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono",
        cfg.bg,
        cfg.border,
        cfg.text,
        sz.badge,
        sz.text,
        className
      )}
    >
      {/* Status dot */}
      <span className="relative flex shrink-0">
        {shouldPulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              cfg.dot
            )}
          />
        )}
        <span className={cn("relative inline-flex rounded-full", cfg.dot, sz.dot)} />
      </span>

      {label ?? cfg.label}
    </span>
  );
}

// ─── StatusDot (icon-only, no label) ─────────────────────────────────────────

interface StatusDotProps {
  status: BadgeStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusDot({ status, size = "md", className }: StatusDotProps) {
  const cfg = statusConfig[status];
  const sz  = sizeConfig[size];
  const shouldPulse = status === "healthy" || status === "connecting";

  return (
    <span className={cn("relative flex shrink-0", className)}>
      {shouldPulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            cfg.dot
          )}
        />
      )}
      <span className={cn("relative inline-flex rounded-full", cfg.dot, sz.dot)} />
    </span>
  );
}

// ─── StatusRow (label + value + dot, used in widgets) ─────────────────────────

interface StatusRowProps {
  label: string;
  value: string;
  status: BadgeStatus;
  className?: string;
}

export function StatusRow({ label, value, status, className }: StatusRowProps) {
  const cfg = statusConfig[status];

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-xs text-slate-400 font-mono">{label}</span>
      <span className={cn("flex items-center gap-1.5 text-xs font-mono", cfg.text)}>
        <StatusDot status={status} size="sm" />
        {value}
      </span>
    </div>
  );
}