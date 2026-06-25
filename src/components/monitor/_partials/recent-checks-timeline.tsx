import { CheckCircle2, XCircle } from "lucide-react";

import type { CheckResultType } from "@/types/monitor.type";
import { CheckResultsSheet } from "./check-results-sheet";

interface Props {
  monitorId: number;
  checkResults: CheckResultType[];
}

export function RecentChecksTimeline({ monitorId, checkResults }: Props) {
  const recentChecks = checkResults.slice(0, 5);
  const totalChecks = checkResults.length;

  return (
    <div
      className="flex flex-col rounded-xl border bg-card p-4"
      style={{ height: 450 }}
    >
      {/* Header — never shrinks */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Recent Checks</h2>
          <p className="text-xs text-muted-foreground">
            Latest monitoring results
          </p>
        </div>
        <div className="rounded-md bg-muted px-2 py-1 text-xs font-medium tabular-nums">
          {totalChecks.toLocaleString()}
        </div>
      </div>

      {/* Scrollable area — takes all remaining height */}
      <div
        className="
          min-h-0 flex-1 overflow-y-auto space-y-1.5 pr-1
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-border
          hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40
        "
      >
        {recentChecks.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No checks yet</p>
          </div>
        ) : (
          <>
            {recentChecks.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {result.success ? (
                    <div className="shrink-0 rounded-full bg-emerald-500/10 p-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="shrink-0 rounded-full bg-red-500/10 p-1">
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tabular-nums">
                      {result.statusCode ?? "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(result.checkedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p
                  className={`shrink-0 text-xs font-bold tabular-nums ${
                    result.success ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {result.responseTime != null
                    ? `${result.responseTime}ms`
                    : "—"}
                </p>
              </div>
            ))}

            <div className="mt-3 border-t pt-3">
              <CheckResultsSheet monitorId={monitorId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
