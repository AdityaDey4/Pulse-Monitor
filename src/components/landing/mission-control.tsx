/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Globe2,
  Radio,
  ServerCog,
  XCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Mission Control — a large "operations center" section.
// Six fixed-height panels in a strict grid, none of which ever resize,
// scroll, or regenerate data during render (all randomness is client-only,
// generated in useEffect, never inline in JSX).
// ─────────────────────────────────────────────────────────────────────────────

const PANEL_HEIGHT = "h-[280px]";

// ─── Panel shell ──────────────────────────────────────────────────────────────

function Panel({
  title,
  icon,
  accent,
  badge,
  className,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-white/8 bg-[#0a0f1e] p-5 overflow-hidden",
        PANEL_HEIGHT,
        className,
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span style={{ color: accent }}>{icon}</span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            {title}
          </span>
        </div>
        {badge}
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

// ─── Panel 1: Active monitors grid ────────────────────────────────────────────

interface MonitorPulse {
  name: string;
  region: string;
  status: "up" | "down" | "degraded";
}

const MONITORS: MonitorPulse[] = [
  { name: "api.montu.sh", region: "iad1", status: "up" },
  { name: "dashboard.montu.sh", region: "iad1", status: "up" },
  { name: "webhooks.montu.sh", region: "fra1", status: "degraded" },
  { name: "auth.montu.sh", region: "iad1", status: "up" },
  { name: "worker.montu.sh", region: "sfo1", status: "down" },
  { name: "cdn.montu.sh", region: "fra1", status: "up" },
  { name: "status.montu.sh", region: "iad1", status: "up" },
  { name: "billing.montu.sh", region: "sfo1", status: "up" },
];

const dotColor: Record<MonitorPulse["status"], string> = {
  up: "#34d399",
  degraded: "#fbbf24",
  down: "#ef4444",
};

function ActiveMonitorsPanel() {
  const upCount = MONITORS.filter((m) => m.status === "up").length;

  return (
    <Panel
      title="Active Monitors"
      icon={<Globe2 className="w-4 h-4" />}
      accent="#00D4FF"
      badge={
        <span className="text-[10px] font-mono text-emerald-400">
          {upCount}/{MONITORS.length} healthy
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-2 h-full content-start">
        {MONITORS.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: dotColor[m.status],
                boxShadow: `0 0 6px ${dotColor[m.status]}`,
              }}
            />
            <div className="min-w-0">
              <div className="text-[10.5px] font-mono text-slate-300 truncate">{m.name}</div>
              <div className="text-[9px] text-slate-600 font-mono">{m.region}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Panel 2: Alerts feed ─────────────────────────────────────────────────────

interface AlertItem {
  id: number;
  level: "critical" | "warning" | "resolved";
  message: string;
}

const ALERT_POOL: Omit<AlertItem, "id">[] = [
  { level: "critical", message: "worker.montu.sh — connection refused" },
  { level: "warning", message: "webhooks.montu.sh — p95 latency 643ms" },
  { level: "resolved", message: "worker.montu.sh — back online" },
  { level: "warning", message: "cdn.montu.sh — elevated TTFB" },
  { level: "critical", message: "billing.montu.sh — SSL cert expiring in 4d" },
];

const levelStyle: Record<AlertItem["level"], { color: string; icon: React.ReactNode; label: string }> = {
  critical: { color: "#ef4444", icon: <XCircle className="w-3.5 h-3.5" />, label: "CRIT" },
  warning: { color: "#fbbf24", icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "WARN" },
  resolved: { color: "#34d399", icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "OK" },
};

function AlertsPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 0, ...ALERT_POOL[0] },
    { id: 1, ...ALERT_POOL[1] },
  ]);
  const idx = useRef(2);

  useEffect(() => {
    const id = setInterval(() => {
      const next = ALERT_POOL[idx.current % ALERT_POOL.length];
      const newId = idx.current;
      idx.current += 1;
      setAlerts((prev) => [{ id: newId, ...next }, ...prev].slice(0, 5));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const activeCount = alerts.filter((a) => a.level !== "resolved").length;

  return (
    <Panel
      title="Alerts"
      icon={<Bell className="w-4 h-4" />}
      accent="#fbbf24"
      badge={
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
          {activeCount} open
        </span>
      }
    >
      <div className="space-y-2 h-full overflow-hidden">
        {alerts.map((a) => {
          const s = levelStyle[a.level];
          return (
            <div
              key={a.id}
              className="flex items-start gap-2.5 px-3 py-2 rounded-lg border"
              style={{
                borderColor: `${s.color}33`,
                background: `${s.color}0d`,
              }}
            >
              <span style={{ color: s.color }} className="mt-0.5 flex-shrink-0">
                {s.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[9px] font-mono font-bold" style={{ color: s.color }}>
                  {s.label}
                </div>
                <div className="text-[10.5px] text-slate-400 truncate">{a.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ─── Panel 3: Response time gauges ────────────────────────────────────────────

interface ServiceLatency {
  name: string;
  base: number;
  color: string;
}

const SERVICES: ServiceLatency[] = [
  { name: "api.montu.sh", base: 84, color: "#4ade80" },
  { name: "dashboard.montu.sh", base: 121, color: "#60a5fa" },
  { name: "auth.montu.sh", base: 57, color: "#a78bfa" },
  { name: "webhooks.montu.sh", base: 480, color: "#fbbf24" },
];

function ResponseTimesPanel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <Panel
      title="Response Times"
      icon={<Gauge className="w-4 h-4" />}
      accent="#4ade80"
      badge={<span className="text-[10px] font-mono text-slate-600">live</span>}
    >
      <div className="flex flex-col gap-3.5 h-full justify-center">
        {SERVICES.map((s, i) => {
          const jitter = Math.floor(Math.sin(tick + i * 3) * (s.base * 0.15));
          const value = Math.max(8, s.base + jitter);
          const pct = Math.min(100, (value / 700) * 100);
          return (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10.5px] font-mono text-slate-400">{s.name}</span>
                <span className="text-[10.5px] font-mono tabular-nums" style={{ color: s.color }}>
                  {value}ms
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ─── Panel 4: Live events stream ──────────────────────────────────────────────

const EVENT_POOL = [
  "ws:connect → client #4821",
  "PUBLISH monitor:result → 1 subscriber",
  "check:complete api.montu.sh (84ms)",
  "ws:emit monitor:update → 34 clients",
  "queue:job worker_3 picked up task",
  "check:complete dashboard.montu.sh (121ms)",
  "PUBLISH notification:new → 2 subscribers",
];

function LiveEventsPanel() {
  const [mounted, setMounted] = useState(false);
  const [lines, setLines] = useState<{ id: number; time: string; text: string }[]>([
    { id: 0, time: "--:--:--", text: EVENT_POOL[0] },
    { id: 1, time: "--:--:--", text: EVENT_POOL[1] },
    { id: 2, time: "--:--:--", text: EVENT_POOL[2] },
  ]);
  const idx = useRef(3);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      const text = EVENT_POOL[idx.current % EVENT_POOL.length];
      const newId = idx.current;
      idx.current += 1;
      setLines((prev) =>
        [{ id: newId, time: new Date().toTimeString().slice(0, 8), text }, ...prev].slice(0, 8),
      );
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <Panel
      title="Live Events"
      icon={<Radio className="w-4 h-4" />}
      accent="#a78bfa"
      badge={
        <span className="flex items-center gap-1 text-[10px] font-mono text-[#a78bfa]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
          Socket.IO
        </span>
      }
    >
      <div className="space-y-1.5 h-full overflow-hidden font-mono">
        {lines.map((l, i) => (
          <div key={l.id} className="flex gap-2 text-[10px]" style={{ opacity: 1 - i * 0.1 }}>
            <span className="text-slate-700 tabular-nums shrink-0">
              {mounted ? l.time : "--:--:--"}
            </span>
            <span className="text-slate-400 truncate">{l.text}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Panel 5: System logs ─────────────────────────────────────────────────────

const LOG_LEVELS = ["INFO", "DEBUG", "WARN"] as const;
const LOG_POOL = [
  "worker_pool: 8 workers active, 0 idle",
  "db: connection pool 12/20 in use",
  "redis: pub/sub channel monitor:* stable",
  "scheduler: next batch in 14s",
  "cache: hit ratio 94.2% (last 5m)",
  "queue: 3 jobs pending, 0 failed",
];

function SystemLogsPanel() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<{ id: number; time: string; level: string; text: string }[]>([
    { id: 0, time: "--:--:--", level: "INFO", text: LOG_POOL[0] },
    { id: 1, time: "--:--:--", level: "INFO", text: LOG_POOL[1] },
  ]);
  const idx = useRef(2);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      const text = LOG_POOL[idx.current % LOG_POOL.length];
      const level = LOG_LEVELS[idx.current % LOG_LEVELS.length];
      const newId = idx.current;
      idx.current += 1;
      setLogs((prev) =>
        [{ id: newId, time: new Date().toTimeString().slice(0, 8), level, text }, ...prev].slice(0, 6),
      );
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const levelColor: Record<string, string> = {
    INFO: "#60a5fa",
    DEBUG: "#64748b",
    WARN: "#fbbf24",
  };

  return (
    <Panel
      title="System Logs"
      icon={<ServerCog className="w-4 h-4" />}
      accent="#60a5fa"
      badge={<span className="text-[10px] font-mono text-slate-600">background workers</span>}
    >
      <div className="space-y-1.5 h-full overflow-hidden font-mono">
        {logs.map((l) => (
          <div key={l.id} className="flex gap-2 text-[10px]">
            <span className="text-slate-700 tabular-nums shrink-0">
              {mounted ? l.time : "--:--:--"}
            </span>
            <span
              className="font-bold shrink-0 w-9"
              style={{ color: levelColor[l.level] }}
            >
              {l.level}
            </span>
            <span className="text-slate-500 truncate">{l.text}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Panel 6: Notification center ─────────────────────────────────────────────

interface MissionNotif {
  id: number;
  title: string;
  sub: string;
  color: string;
}

const NOTIF_POOL: Omit<MissionNotif, "id">[] = [
  { title: "worker.montu.sh is down", sub: "5 consecutive failed checks", color: "#ef4444" },
  { title: "webhooks.montu.sh degraded", sub: "Latency above SLA threshold", color: "#fbbf24" },
  { title: "worker.montu.sh recovered", sub: "Back online — 92ms response", color: "#34d399" },
];

function NotificationCenterPanel() {
  const [notifs, setNotifs] = useState<MissionNotif[]>([{ id: 0, ...NOTIF_POOL[0] }]);
  const idx = useRef(1);

  useEffect(() => {
    const id = setInterval(() => {
      const next = NOTIF_POOL[idx.current % NOTIF_POOL.length];
      const newId = idx.current;
      idx.current += 1;
      setNotifs((prev) => [{ id: newId, ...next }, ...prev].slice(0, 3));
    }, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <Panel
      title="Notification Center"
      icon={<Bell className="w-4 h-4" />}
      accent="#f59e0b"
      badge={<ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
    >
      <div className="space-y-2.5 h-full overflow-hidden">
        {notifs.map((n, i) => (
          <div
            key={n.id}
            className="flex items-start justify-between px-3 py-2.5 rounded-lg border"
            style={{
              borderColor: `${n.color}33`,
              background: `${n.color}0d`,
              opacity: 1 - i * 0.18,
            }}
          >
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white truncate">{n.title}</div>
              <div className="text-[10px] text-slate-500 truncate">{n.sub}</div>
            </div>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: n.color, boxShadow: `0 0 6px ${n.color}` }}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MissionControl() {
  return (
    <section className="relative py-24 bg-[#03040a] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-600/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/8 bg-white/3 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              Mission Control
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
            One screen. Every signal.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            This is what your team sees during an incident — monitors, alerts,
            latency, and the event stream, all in one operations view.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <ActiveMonitorsPanel />
          <AlertsPanel />
          <ResponseTimesPanel />
          <LiveEventsPanel />
          <SystemLogsPanel />
          <NotificationCenterPanel />
        </div>
      </div>
    </section>
  );
}