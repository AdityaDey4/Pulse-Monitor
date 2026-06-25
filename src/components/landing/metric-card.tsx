/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrendDirection = "up" | "down" | "neutral";
export type MetricVariant  = "default" | "success" | "warning" | "danger" | "info";

// ─── Config ───────────────────────────────────────────────────────────────────

const variantConfig: Record<
  MetricVariant,
  { value: string; trend: string; border: string; accent: string }
> = {
  default: {
    value:  "text-white",
    trend:  "text-slate-400",
    border: "border-white/6",
    accent: "bg-white/4",
  },
  success: {
    value:  "text-emerald-400",
    trend:  "text-emerald-500",
    border: "border-emerald-500/15",
    accent: "bg-emerald-500/6",
  },
  warning: {
    value:  "text-amber-400",
    trend:  "text-amber-500",
    border: "border-amber-500/15",
    accent: "bg-amber-500/6",
  },
  danger: {
    value:  "text-red-400",
    trend:  "text-red-500",
    border: "border-red-500/15",
    accent: "bg-red-500/6",
  },
  info: {
    value:  "text-[#00D4FF]",
    trend:  "text-sky-500",
    border: "border-[#00D4FF]/15",
    accent: "bg-[#00D4FF]/5",
  },
};

// ─── useCountUp ───────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200, enabled = true) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setCurrent(target);
      return;
    }
    const start     = performance.now();
    const from      = 0;

    function step(now: number) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return current;
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;

  // Numeric value — will animate on mount if `animated` is true
  value: number | string;

  // Suffix displayed after the number e.g. "ms", "%", "/s"
  suffix?: string;

  // Prefix displayed before the number e.g. "$"
  prefix?: string;

  // Decimal places for numeric values (default 0)
  decimals?: number;

  // Trend display
  trend?: string;           // e.g. "+3" or "-12ms"
  trendDirection?: TrendDirection;

  // Whether to run the count-up animation on mount
  animated?: boolean;

  // If true, value slightly varies every few seconds (live feel)
  live?: boolean;
  liveRange?: [number, number]; // [min, max] for live variation

  variant?: MetricVariant;
  className?: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  trend,
  trendDirection = "neutral",
  animated = false,
  live = false,
  liveRange,
  variant = "default",
  className,
  icon,
}: MetricCardProps) {
  const cfg = variantConfig[variant];
  const isNumeric = typeof value === "number";

  // Live value state
  const [liveValue, setLiveValue] = useState<number>(isNumeric ? (value as number) : 0);

  // Count-up (only when animated + numeric)
  const counted = useCountUp(
    isNumeric ? (live ? liveValue : (value as number)) : 0,
    1200,
    animated && isNumeric
  );

  // Live variation interval
  useEffect(() => {
    if (!live || !liveRange || !isNumeric) return;
    const [min, max] = liveRange;
    const id = setInterval(() => {
      const next = parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
      setLiveValue(next);
    }, 2500 + Math.random() * 1000);
    return () => clearInterval(id);
  }, [live, liveRange, isNumeric, decimals]);

  // Displayed value
  const displayValue = isNumeric
    ? animated
      ? counted.toFixed(decimals)
      : live
      ? liveValue.toFixed(decimals)
      : (value as number).toFixed(decimals)
    : value;

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    trendDirection === "up"
      ? "text-emerald-400"
      : trendDirection === "down"
      ? "text-red-400"
      : "text-slate-500";

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 overflow-hidden",
        "bg-[#111827]",
        cfg.border,
        className
      )}
    >
      {/* Subtle top accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-px", cfg.accent)} />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-slate-600">{icon}</span>
        )}
        {live && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            live
          </span>
        )}
      </div>

      {/* Value */}
      <div className={cn("text-2xl font-semibold tabular-nums tracking-tight", cfg.value)}>
        {prefix}
        {displayValue}
        {suffix && (
          <span className="text-sm font-normal text-slate-500 ml-0.5">{suffix}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-mono", trendColor)}>
          <TrendIcon className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
  );
}

// ─── MetricCell (compact — used in widgets / tables) ─────────────────────────

interface MetricCellProps {
  label: string;
  value: string | number;
  suffix?: string;
  animated?: boolean;
  className?: string;
}

export function MetricCell({
  label,
  value,
  suffix = "",
  animated = false,
  className,
}: MetricCellProps) {
  const isNumeric = typeof value === "number";
  const counted   = useCountUp(isNumeric ? (value as number) : 0, 1000, animated && isNumeric);
  const display   = isNumeric && animated ? counted : value;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 border-t border-white/5 first:border-l-0",
        className
      )}
    >
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold font-mono text-white tabular-nums">
        {display}
        {suffix}
      </span>
    </div>
  );
}

// ─── MetricRow (horizontal layout) ───────────────────────────────────────────

interface MetricRowProps {
  metrics: Array<{
    label: string;
    value: number | string;
    suffix?: string;
    variant?: MetricVariant;
    trend?: string;
    trendDirection?: TrendDirection;
    animated?: boolean;
    live?: boolean;
    liveRange?: [number, number];
  }>;
  className?: string;
}

export function MetricRow({ metrics, className }: MetricRowProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        metrics.length === 2 && "grid-cols-2",
        metrics.length === 3 && "grid-cols-3",
        metrics.length === 4 && "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}