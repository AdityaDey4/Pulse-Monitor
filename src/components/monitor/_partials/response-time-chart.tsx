"use client";

import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

import { Clock3 } from "lucide-react";

import type { CheckResultType } from "@/types/monitor.type";

interface Props {
  checkResults: CheckResultType[];
}

// Chart area height = card height (450) - header (~80px) - card padding (40px)
const CHART_HEIGHT = 330;

export function ResponseTimeChart({ checkResults }: Props) {
  const data = [...checkResults].reverse().map((result) => ({
    time: new Date(result.checkedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    responseTime: result.responseTime ?? 0,
    success: result.success,
  }));

  const avgResponseTime =
    data.length > 0
      ? Math.round(data.reduce((s, d) => s + d.responseTime, 0) / data.length)
      : 0;

  return (
    <div className="rounded-xl border bg-card p-5" style={{ height: 450 }}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <Clock3 className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h2 className="font-semibold">Response Time History</h2>
            <p className="text-xs text-muted-foreground">
              Response latency over time
            </p>
          </div>
        </div>

        {avgResponseTime > 0 && (
          <div className="rounded-lg border bg-muted/40 px-3 py-1.5 text-right">
            <p className="text-[11px] text-muted-foreground">Avg</p>
            <p className="text-sm font-bold tabular-nums">
              {avgResponseTime}ms
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height: CHART_HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.15}
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              minTickGap={50}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11 }}
              tickMargin={10}
              unit="ms"
              axisLine={false}
              tickLine={false}
              width={52}
            />

            {avgResponseTime > 0 && (
              <ReferenceLine
                y={avgResponseTime}
                stroke="#3b82f6"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
            )}

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload;
                return (
                  <div className="rounded-xl border bg-popover px-3 py-2 shadow-lg text-popover-foreground">
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          point.success ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      <span className="font-semibold tabular-nums">
                        {point.responseTime}ms
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {point.success ? "Success" : "Failed"}
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="none"
              fill="url(#responseGradient)"
            />

            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
