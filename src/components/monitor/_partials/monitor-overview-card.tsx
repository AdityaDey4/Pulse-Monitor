import {
  Activity,
  Globe,
  Wifi,
  WifiOff,
  ExternalLink,
  Timer,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MonitorType } from "@/types/monitor.type";

interface Props {
  monitor: MonitorType;
}

export function MonitorOverviewCard({ monitor }: Props) {
  const isUp = monitor.status === "UP";
  const isDown = monitor.status === "DOWN";
  const isUnknown = monitor.status === "UNKNOWN";

  return (
    <Card className="relative overflow-hidden border bg-card px-6 py-4">
      <div
        className={`pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full blur-3xl ${
          isUp
            ? "bg-emerald-400/10"
            : isDown
              ? "bg-red-400/10"
              : "bg-amber-400/10"
        }`}
      />

      <div className="relative flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isUp
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : isDown
                  ? "bg-red-500/10 text-red-500"
                  : "bg-amber-500/10 text-amber-500"
            }`}
          >
            {isUp ? (
              <Wifi className="h-4 w-4" />
            ) : isDown ? (
              <WifiOff className="h-4 w-4" />
            ) : (
              <HelpCircle className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight truncate">
                {monitor.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
                  isUp
                    ? "bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
                    : isDown
                      ? "bg-red-500/12 text-red-600 ring-1 ring-red-500/20 dark:text-red-400"
                      : "bg-amber-500/12 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400"
                }`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  {isUp && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  {isDown && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  )}
                  {isUnknown && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                      isUp
                        ? "bg-emerald-500"
                        : isDown
                          ? "bg-red-500"
                          : "bg-amber-500"
                    }`}
                  />
                </span>
                {monitor.status}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Endpoint Monitor
            </p>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground max-w-[420]"
            >
              <Globe className="h-3 w-3 shrink-0" />
              <span className="truncate">{monitor.url}</span>
              <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
            </a>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Method chip */}
          <div className="flex h-12 items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-3">
            <Activity className="h-3.5 w-3.5 text-blue-500" />
            <div className="leading-none">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Method
              </p>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {monitor.method}
              </p>
            </div>
          </div>

          <div className="flex h-12 items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3">
            <Timer className="h-3.5 w-3.5 text-violet-500" />
            <div className="leading-none">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Interval
              </p>
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                Every {monitor.intervalMinutes}m
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
