"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { ShieldCheck } from "lucide-react";

interface Props {
  successfulChecks: number;
  failedChecks: number;
}

export function SuccessFailureChart({ successfulChecks, failedChecks }: Props) {
  const totalChecks = successfulChecks + failedChecks;

  const successPct =
    totalChecks > 0 ? ((successfulChecks / totalChecks) * 100).toFixed(1) : "0";

  const data = [
    { name: "Success", value: successfulChecks, color: "#22c55e" },
    { name: "Failed", value: failedChecks, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  // If no data at all, show a grey empty ring
  const chartData =
    data.length > 0 ? data : [{ name: "No data", value: 1, color: "#e5e7eb" }];

  return (
    <div className="rounded-xl border bg-card p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="font-semibold">Success vs Failure</h2>
          <p className="text-xs text-muted-foreground">
            Monitor health overview
          </p>
        </div>
      </div>

      {/* Donut chart with center label */}
      <div className="relative h-55">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              stroke="transparent"
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                const value = Number(item.value);
                const pct =
                  totalChecks > 0
                    ? ((value / totalChecks) * 100).toFixed(1)
                    : "0";
                return (
                  <div className="min-w-[160px] rounded-xl border bg-popover p-3 shadow-lg text-popover-foreground">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.payload.color }}
                      />
                      <span className="text-sm font-medium">
                        {String(item.name)}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-6">
                        <span className="text-muted-foreground">Checks</span>
                        <span className="font-medium">
                          {value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="text-muted-foreground">Share</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none tabular-nums">
            {successPct}%
          </span>

          <span className="mt-1 text-xs text-muted-foreground">Uptime</span>
        </div>
      </div>

      {/* Summary row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border bg-muted/40 p-3 text-center">
          <p className="text-[11px] text-muted-foreground">Total</p>
          <p className="mt-1 text-xl font-bold tabular-nums">
            {totalChecks.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
          <p className="text-[11px] text-muted-foreground">Success</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-emerald-500">
            {successfulChecks.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center">
          <p className="text-[11px] text-muted-foreground">Failed</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-red-500">
            {failedChecks.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
