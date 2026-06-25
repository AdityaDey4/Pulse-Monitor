"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  //   Github,
  Activity,
  Zap,
  Clock,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, StatusRow, MetricCell } from "@/components/shared";

// ─── Types ────────────────────────────────────────────────────────────────────

type SystemStatus = "healthy" | "degraded" | "error" | "connecting";

interface SystemService {
  label: string;
  value: string;
  status: SystemStatus;
}

interface LiveMetric {
  label: string;
  value: string;
  raw: number;
  range: [number, number];
  decimals: number;
  suffix: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SERVICES: SystemService[] = [
  { label: "API Health", value: "Healthy", status: "healthy" },
  { label: "Redis", value: "Connected", status: "healthy" },
  { label: "Worker", value: "Running", status: "healthy" },
  { label: "Socket.IO", value: "Active", status: "healthy" },
];

const HERO_METRICS = [
  { icon: Shield, value: "99.98%", label: "Availability" },
  { icon: Clock, value: "<200ms", label: "Response Time" },
  { icon: Zap, value: "Real-time", label: "Event Streaming" },
  { icon: Activity, value: "24 / 7", label: "Monitoring" },
];

const INITIAL_LIVE: LiveMetric[] = [
  {
    label: "Uptime",
    value: "99.98%",
    raw: 99.98,
    range: [99.94, 99.99],
    decimals: 2,
    suffix: "%",
  },
  {
    label: "Events / min",
    value: "1,247",
    raw: 1247,
    range: [900, 1600],
    decimals: 0,
    suffix: "",
  },
  {
    label: "Active Clients",
    value: "34",
    raw: 34,
    range: [28, 48],
    decimals: 0,
    suffix: "",
  },
  {
    label: "Checks / sec",
    value: "8.3",
    raw: 8.3,
    range: [6, 12],
    decimals: 1,
    suffix: "",
  },
];

// ─── Small helpers ────────────────────────────────────────────────────────────

function formatValue(raw: number, decimals: number, suffix: string): string {
  const n = raw.toFixed(decimals);
  const formatted = decimals === 0 ? Number(n).toLocaleString() : n;
  return `${formatted}${suffix}`;
}

// ─── LiveMetricsGrid ─────────────────────────────────────────────────────────

function LiveMetricsGrid() {
  const [metrics, setMetrics] = useState<LiveMetric[]>(INITIAL_LIVE);

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          const [min, max] = m.range;
          const raw = parseFloat(
            (min + Math.random() * (max - min)).toFixed(m.decimals),
          );
          return { ...m, raw, value: formatValue(raw, m.decimals, m.suffix) };
        }),
      );
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 border-t border-white/6">
      {metrics.map((m) => (
        <MetricCell
          key={m.label}
          label={m.label}
          value={m.value}
          className="border-r border-white/6 last:border-r-0 [&:nth-child(2)]:border-r-0"
        />
      ))}
    </div>
  );
}

// ─── StatusWidget ─────────────────────────────────────────────────────────────

function StatusWidget() {
  const [tick, setTick] = useState(0);

  // Subtle tick to show the widget is alive
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const [timestamp, setTimestamp] = useState("--:--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTimestamp(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
      );
    };

    updateTime();

    const id = setInterval(updateTime, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-white/8 bg-[#111827] overflow-hidden shadow-2xl shadow-black/40">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-[#0d1420]">
        <div className="flex items-center gap-2">
          {/* Traffic-light dots */}
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          pulse-monitor / prod
        </span>
        <span className="text-[11px] font-mono text-slate-600 tabular-nums">
          {timestamp}
        </span>
      </div>

      {/* Overall status pill */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-xs font-mono text-slate-400">system status</span>
        <StatusBadge
          status="healthy"
          label="All Systems Operational"
          size="sm"
        />
      </div>

      {/* Service rows */}
      <div className="px-4 py-3 space-y-2.5 border-b border-white/5">
        {SERVICES.map((svc) => (
          <StatusRow
            key={svc.label}
            label={svc.label}
            value={svc.value}
            status={svc.status}
          />
        ))}
      </div>

      {/* Live metrics */}
      <LiveMetricsGrid />
    </div>
  );
}

// ─── CTA Buttons ─────────────────────────────────────────────────────────────

function CTAButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary — View Demo */}
      <Link
        href="#mission-control"
        className={cn(
          "group inline-flex items-center gap-2 rounded-lg px-5 py-2.5",
          "bg-[#00D4FF] text-[#050816] text-sm font-semibold",
          "hover:bg-[#00bfe8] transition-colors duration-150",
          "shadow-lg shadow-[#00D4FF]/20",
        )}
      >
        View Demo
        <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>

      {/* Secondary — Architecture */}
      <Link
        href="#architecture"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-5 py-2.5",
          "border border-white/10 bg-white/4 text-white text-sm font-medium",
          "hover:bg-white/8 hover:border-white/16 transition-all duration-150",
        )}
      >
        View Architecture
      </Link>

      {/* Ghost — GitHub */}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2.5",
          "text-slate-400 text-sm font-medium",
          "hover:text-white transition-colors duration-150",
        )}
      >
        {/* <Github className="w-4 h-4" /> */}
        Source
      </a>
    </div>
  );
}

// ─── Hero Metrics Row ─────────────────────────────────────────────────────────

function HeroMetrics() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
      {HERO_METRICS.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-[#00D4FF] shrink-0" />
          <span className="text-sm font-semibold text-white tabular-nums">
            {value}
          </span>
          <span className="text-sm text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Background grid ─────────────────────────────────────────────────────────

function BackgroundGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #334155 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Cyan glow — top left */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00D4FF]/4 blur-3xl" />
      {/* Indigo glow — bottom right */}
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-3xl" />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-[#050816] pt-20 pb-16 overflow-hidden"
    >
      <BackgroundGrid />

      <div className="relative mx-auto max-w-7xl w-full px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left column ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="w-fit">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1",
                  "border border-[#00D4FF]/20 bg-[#00D4FF]/6",
                  "text-[11px] font-mono uppercase tracking-widest text-[#00D4FF]",
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                Production-Grade Monitoring
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white leading-[1.1] tracking-tight">
              Monitoring <span className="text-[#00D4FF]">Infrastructure.</span>
              <br />
              Built For <span className="text-slate-400">Real Systems.</span>
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-base lg:text-lg leading-relaxed max-w-xl">
              Monitor websites, APIs, and services with real-time event
              streaming powered by{" "}
              <span className="text-slate-300 font-medium">Redis Pub/Sub</span>,{" "}
              <span className="text-slate-300 font-medium">Socket.IO</span>,{" "}
              <span className="text-slate-300 font-medium">PostgreSQL</span>,
              and background workers.
            </p>

            {/* CTA buttons */}
            <CTAButtons />

            {/* Metrics row */}
            <HeroMetrics />

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Next.js 15",
                "TypeScript",
                "Redis Pub/Sub",
                "Socket.IO",
                "PostgreSQL",
                "Prisma",
                "Background Workers",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md border border-white/6 bg-white/3 text-[11px] font-mono text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right column — Status Widget ─────────────────────── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <StatusWidget />

              {/* Below widget — mini event log */}
              <EventLogPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── EventLogPreview ─────────────────────────────────────────────────────────
// Small live log that appears below the status widget — adds credibility

const LOG_SEED = [
  { level: "success", msg: "GET /health → 200 OK", ms: "142ms" },
  { level: "info", msg: "Worker #3 dispatched job #4821", ms: "" },
  { level: "success", msg: "Redis PUBLISH monitor:result", ms: "" },
  { level: "success", msg: "Socket.IO emit → 34 clients", ms: "" },
  { level: "warning", msg: "GET /api/users → 503", ms: "5012ms" },
  { level: "success", msg: "Recovery confirmed — 200 OK", ms: "138ms" },
  { level: "info", msg: "Notification dispatched", ms: "" },
  { level: "success", msg: "GET /api/products → 200 OK", ms: "91ms" },
];

const levelColor: Record<string, string> = {
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
  info: "text-slate-500",
};

function EventLogPreview() {
  const [lines, setLines] = useState(LOG_SEED.slice(0, 3));
  const [cursor, setCursor] = useState(true);
  const logRef = useRef(3);

  // Rotate a new log entry in every 1.8s
  useEffect(() => {
    const id = setInterval(() => {
      const next = LOG_SEED[logRef.current % LOG_SEED.length];
      logRef.current += 1;
      setLines((prev) => [...prev.slice(-3), next]);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);
  const [ts, setTs] = useState("--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTs(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes(),
        ).padStart(2, "0")}`,
      );
    };

    updateTime();

    const id = setInterval(updateTime, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-3 rounded-xl border border-white/6 bg-[#0d1117] p-3 font-mono text-[11px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-600">live logs</span>
        <span className="text-slate-700 tabular-nums">{ts}</span>
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-500">
            <span className="text-slate-700 shrink-0 tabular-nums">›</span>
            <span className={cn("truncate", levelColor[line.level])}>
              {line.msg}
            </span>
            {line.ms && (
              <span className="ml-auto shrink-0 text-slate-600">{line.ms}</span>
            )}
          </div>
        ))}
        {/* Blinking cursor */}
        <div className="flex items-center gap-2 text-slate-600">
          <span>›</span>
          <span
            className={cn(
              "w-1.5 h-3 bg-[#00D4FF]/60 transition-opacity duration-100",
              cursor ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>
    </div>
  );
}
