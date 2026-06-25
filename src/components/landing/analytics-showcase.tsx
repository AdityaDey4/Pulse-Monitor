/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BarChart2, Calendar, TrendingUp, Zap } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CellStatus = "up" | "degraded" | "down";
const WEEKS = 32;
const DAYS = 7;

function seedCells(): CellStatus[] {
  return Array.from({ length: WEEKS * DAYS }, () => "up" as CellStatus);
}

function generateCells(): CellStatus[] {
  return Array.from({ length: WEEKS * DAYS }, () => {
    const r = Math.random();
    if (r > 0.985) return "down";
    if (r > 0.95) return "degraded";
    return "up";
  });
}

const cellColor: Record<CellStatus, string> = {
  up: "bg-emerald-500/70",
  degraded: "bg-amber-400/70",
  down: "bg-red-500/80",
};

function HeatmapPanel() {
  const [cells, setCells] = useState<CellStatus[]>(seedCells);
  const [uptime, setUptime] = useState("99.9");

  useEffect(() => {
    const generated = generateCells();
    setCells(generated);
    const downWeight = generated.filter((c) => c === "down").length * 1;
    const degradedWeight = generated.filter((c) => c === "degraded").length * 0.3;
    const pct = 100 - ((downWeight + degradedWeight) / generated.length) * 100;
    setUptime(pct.toFixed(2));
  }, []);

  return (
    <div className="relative flex flex-col h-[340px] rounded-2xl border border-white/8 bg-[#0a0f1e] p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#60a5fa]" />
          <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            Availability Heatmap
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-600">{WEEKS} weeks</span>
      </div>

      <div
        className="grid gap-[3px] flex-1"
        style={{
          gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
          gridTemplateRows: `repeat(${DAYS}, 1fr)`,
          gridAutoFlow: "column",
        }}
      >
        {cells.map((s, i) => (
          <div key={`hm-cell-${i}`} className={cn("rounded-[2px] min-h-[6px]", cellColor[s])} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-5 flex-shrink-0">
        <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/70 inline-block" />
            Up
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-400/70 inline-block" />
            Degraded
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-red-500/80 inline-block" />
            Down
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400">{uptime}% uptime</span>
      </div>
    </div>
  );
}

// ─── Response time area chart ─────────────────────────────────────────────────

interface Point {
  t: string;
  ms: number;
}

function seedSeries(): Point[] {
  return Array.from({ length: 24 }, (_, i) => ({ t: `${i}`, ms: 90 }));
}

function generateSeries(): Point[] {
  let prev = 90;
  return Array.from({ length: 24 }, (_, i) => {
    const drift = Math.round((Math.random() - 0.5) * 30);
    prev = Math.max(45, Math.min(260, prev + drift));
    return { t: `${i}:00`, ms: prev };
  });
}

function ResponseChartPanel() {
  const [series, setSeries] = useState<Point[]>(seedSeries);

  useEffect(() => {
    setSeries(generateSeries());
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1].ms;
        const drift = Math.round((Math.random() - 0.5) * 24);
        const next = Math.max(45, Math.min(260, last + drift));
        return [...prev.slice(1), { t: "now", ms: next }];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const avg = useMemo(
    () => Math.round(series.reduce((a, b) => a + b.ms, 0) / series.length),
    [series],
  );
  const latest = series[series.length - 1]?.ms ?? 0;

  return (
    <div className="relative flex flex-col h-[340px] rounded-2xl border border-white/8 bg-[#0a0f1e] p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#4ade80]" />
          <span className="text-[12px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            Response Time — 24h
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-600">api.pulse.sh</span>
      </div>

      <div className="flex items-end justify-between mb-2 flex-shrink-0">
        <div>
          <span className="text-3xl font-bold font-mono text-white tabular-nums">{latest}</span>
          <span className="text-sm text-slate-500 ml-1">ms</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-600">24h avg</div>
          <div className="text-[12px] font-mono text-slate-400">{avg}ms</div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="rt-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
            <Tooltip
              contentStyle={{
                background: "#0d1424",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "monospace",
              }}
              labelStyle={{ color: "#64748b" }}
              itemStyle={{ color: "#4ade80" }}
            />
            <Area
              type="monotone"
              dataKey="ms"
              stroke="#4ade80"
              strokeWidth={1.5}
              fill="url(#rt-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1 mt-2 flex-shrink-0">
        <Zap className="w-3 h-3 text-emerald-400" />
        <span className="text-[10px] text-emerald-400 font-mono">within SLA threshold</span>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AnalyticsShowcase() {
  return (
    <section className="relative py-24 bg-[#050816] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/8 bg-white/3 mb-5">
            <BarChart2 className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              Analytics
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
            History you can actually read.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Every check, stored and charted — 32 weeks of availability at a
            glance, and response time down to the minute.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HeatmapPanel />
          <ResponseChartPanel />
        </div>
      </div>
    </section>
  );
}