/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Activity,
  Bell,
  Clock,
  Globe,
  Radio,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// ─── Shared ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── BentoCell ────────────────────────────────────────────────────────────────

function BentoCell({
  children,
  className,
  accent = "#00D4FF",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = hexToRgb(accent);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/6 bg-[#0d1424] p-5 overflow-hidden transition-all duration-300",
        hovered && "border-white/10",
        className
      )}
      style={
        hovered
          ? { boxShadow: `0 0 32px rgba(${rgb},0.06)` }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg,transparent,rgba(${rgb},0.5),transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}

// Card label row — consistent across all cards
function CardLabel({
  icon,
  label,
  right,
  color = "#00D4FF",
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[12px] font-mono font-semibold text-white">{label}</span>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ─── Card A — Live monitor list ───────────────────────────────────────────────

const MONITORS = [
  { name: "api.pulse-monitor.sh",       status: "up",       latency: 84  },
  { name: "dashboard.pulse-monitor.sh", status: "up",       latency: 121 },
  { name: "webhooks.pulse-monitor.sh",  status: "degraded", latency: 643 },
  { name: "auth.pulse-monitor.sh",      status: "up",       latency: 57  },
  { name: "worker.pulse-monitor.sh",    status: "down",     latency: 0   },
];

const statusColor = {
  up:       { dot: "#4ade80", text: "text-emerald-400" },
  degraded: { dot: "#fbbf24", text: "text-amber-400"   },
  down:     { dot: "#ef4444", text: "text-red-400"     },
};

function MonitorCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const jitter = (base: number) =>
    base === 0 ? 0 : base + Math.floor(Math.sin(tick + base) * 10);

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Activity className="w-4 h-4" />}
        label="Live Monitors"
        right={
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Watching
          </span>
        }
      />
      <div className="space-y-2 flex-1 overflow-hidden">
        {MONITORS.map((m) => {
          const sc = statusColor[m.status as keyof typeof statusColor];
          return (
            <div
              key={m.name}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/3 border border-white/5"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: sc.dot }}
              />
              <span className="text-[11px] font-mono text-slate-300 flex-1 truncate">
                {m.name}
              </span>
              <span className={cn("text-[11px] font-mono tabular-nums flex-shrink-0", sc.text)}>
                {m.status === "down" ? "—" : `${jitter(m.latency)}ms`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card B — Uptime % + SLA bar ─────────────────────────────────────────────

function UptimeCard() {
  return (
    <div className="flex flex-col justify-between h-full">
      <CardLabel
        icon={<Globe className="w-4 h-4" />}
        label="Global Uptime"
        color="#00D4FF"
      />
      {/* Big number */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-[52px] font-bold font-mono text-white tracking-tight leading-none">
          99<span className="text-[#00D4FF]">.98</span>
          <span className="text-xl text-slate-600 ml-1">%</span>
        </div>
        <div className="text-[11px] font-mono text-slate-600 mt-2">
          last 30 days · all monitors
        </div>
      </div>
      {/* SLA bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1.5">
          <span>SLA threshold</span>
          <span className="text-emerald-400">99.9% ✓</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.98%" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Card C — Sparkline response time ────────────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 260;
  const H = 52;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = data[data.length - 1];
  const lx = W;
  const ly = H - ((last - min) / range) * (H - 6) - 3;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <polyline points={pts} fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="#4ade80" />
    </svg>
  );
}

function ResponseCard() {
  const [series, setSeries] = useState([84, 91, 78, 102, 88, 76, 95, 84, 88, 93, 79, 85, 90]);
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((p) => [...p.slice(1), 65 + Math.floor(Math.random() * 90)]);
    }, 1300);
    return () => clearInterval(id);
  }, []);
  const latest = series[series.length - 1];
  const avg = Math.round(series.reduce((a, b) => a + b, 0) / series.length);

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Clock className="w-4 h-4" />}
        label="Response Time"
        color="#4ade80"
        right={
          <span className="text-[10px] font-mono text-slate-600">api.pulse-monitor.sh</span>
        }
      />
      <div className="flex items-end gap-4 mb-3">
        <div>
          <span className="text-4xl font-bold font-mono text-white tabular-nums">{latest}</span>
          <span className="text-sm text-slate-500 ml-1">ms</span>
        </div>
        <div className="text-right pb-1">
          <div className="text-[10px] text-slate-600 font-mono">avg</div>
          <div className="text-[13px] font-mono text-slate-400">{avg}ms</div>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <Sparkline data={series} />
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span className="text-[10px] font-mono text-emerald-400">within SLA threshold</span>
      </div>
    </div>
  );
}

// ─── Card D — Heatmap ─────────────────────────────────────────────────────────

type CellStatus = "up" | "degraded" | "down";

function HeatmapCard() {
  const WEEKS = 24;
  const DAYS  = 7;
  const [cells, setCells] = useState<CellStatus[]>(() =>
    Array.from({ length: WEEKS * DAYS }, () => "up" as CellStatus)
  );
  useEffect(() => {
    setCells(
      Array.from({ length: WEEKS * DAYS }, () => {
        const r = Math.random();
        if (r > 0.98) return "down";
        if (r > 0.94) return "degraded";
        return "up";
      })
    );
  }, []);

  const cellColor: Record<CellStatus, string> = {
    up:       "rgba(74,222,128,0.6)",
    degraded: "rgba(251,191,36,0.6)",
    down:     "rgba(239,68,68,0.8)",
  };

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Activity className="w-4 h-4" />}
        label="Availability Heatmap"
        color="#60a5fa"
        right={<span className="text-[10px] font-mono text-slate-600">24 weeks</span>}
      />
      <div
        className="flex-1"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${WEEKS}, 1fr)`,
          gridTemplateRows:    `repeat(${DAYS}, 1fr)`,
          gridAutoFlow: "column",
          gap: "2px",
        }}
      >
        {cells.map((s, i) => (
          <div
            key={i}
            className="rounded-[2px]"
            style={{ background: cellColor[s] }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 flex-shrink-0">
        <div className="flex items-center gap-3 text-[9px] font-mono text-slate-600">
          {(["up", "degraded", "down"] as CellStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-[2px] inline-block" style={{ background: cellColor[s] }} />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-mono text-emerald-400">99.7%</span>
      </div>
    </div>
  );
}

// ─── Card E — Notifications ───────────────────────────────────────────────────

interface Notif {
  id: number;
  icon: React.ReactNode;
  title: string;
  sub: string;
  color: string;
}

const NOTIF_QUEUE: Omit<Notif, "id">[] = [
  { icon: <XCircle className="w-4 h-4" />,       title: "worker.pulse-monitor.sh is DOWN",     sub: "No response after 5 retries",    color: "#ef4444" },
  { icon: <CheckCircle2 className="w-4 h-4" />,   title: "worker.pulse-monitor.sh recovered",   sub: "Latency back to 92ms",           color: "#4ade80" },
  { icon: <AlertTriangle className="w-4 h-4" />,  title: "webhooks.pulse-monitor.sh degraded",  sub: "P95 latency exceeded 500ms",     color: "#f59e0b" },
];

function NotificationCard() {
  const [notifs, setNotifs] = useState<Notif[]>([{ id: 0, ...NOTIF_QUEUE[0] }]);
  const idx = useRef(1);

  useEffect(() => {
    const id = setInterval(() => {
      const next = NOTIF_QUEUE[idx.current % NOTIF_QUEUE.length];
      idx.current += 1;
      setNotifs((prev) => [{ id: idx.current, ...next }, ...prev].slice(0, 3));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Bell className="w-4 h-4" />}
        label="Notifications"
        color="#f59e0b"
        right={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/15">
            {notifs.length} active
          </span>
        }
      />
      <div className="space-y-2.5 flex-1 overflow-hidden">
        {notifs.map((n, i) => (
          <div
            key={n.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-400"
            style={{
              borderColor: `rgba(${hexToRgb(n.color)},0.2)`,
              background:  `rgba(${hexToRgb(n.color)},0.05)`,
              opacity: 1 - i * 0.25,
            }}
          >
            <span style={{ color: n.color }} className="flex-shrink-0">{n.icon}</span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-white truncate">{n.title}</div>
              <div className="text-[10px] text-slate-500 truncate">{n.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card F — Redis Pub/Sub event stream ─────────────────────────────────────

const LOG_POOL = [
  { type: "CHK", color: "#4ade80", msg: "GET api.mpulse-monitorontu.sh/health → 200 OK (84ms)"         },
  { type: "PUB", color: "#a78bfa", msg: "PUBLISH monitor:4821:result → 1 subscriber"       },
  { type: "ERR", color: "#ef4444", msg: "worker.pulse-monitor.sh timeout — 5000ms exceeded"        },
  { type: "OK",  color: "#00D4FF", msg: "emit('monitor:update') → 34 connected clients"    },
  { type: "CHK", color: "#4ade80", msg: "GET auth.pulse-monitor.sh/session → 200 OK (57ms)"        },
  { type: "PUB", color: "#a78bfa", msg: "PUBLISH monitor:1042:result → 2 subscribers"      },
];

interface LogLine { id: number; type: string; color: string; msg: string; ts: string }

function EventStreamCard() {
  const [mounted, setMounted] = useState(false);
  const [lines, setLines] = useState<LogLine[]>([
    { id: 0, ...LOG_POOL[0], ts: "00:00:00" },
    { id: 1, ...LOG_POOL[1], ts: "00:00:00" },
    { id: 2, ...LOG_POOL[2], ts: "00:00:00" },
  ]);
  const idx = useRef(3);

  useEffect(() => {
    setMounted(true);
    setLines((p) => p.map((l) => ({ ...l, ts: new Date().toTimeString().slice(0, 8) })));
    const id = setInterval(() => {
      const next = LOG_POOL[idx.current % LOG_POOL.length];
      idx.current += 1;
      setLines((p) => [
        { id: idx.current, ...next, ts: new Date().toTimeString().slice(0, 8) },
        ...p,
      ].slice(0, 6));
    }, 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Radio className="w-4 h-4" />}
        label="Event Stream"
        color="#a78bfa"
        right={<span className="text-[10px] font-mono text-slate-600">Redis Pub/Sub</span>}
      />
      <div className="space-y-1.5 flex-1 overflow-hidden font-mono">
        {lines.map((l, i) => (
          <div
            key={l.id}
            className="flex items-center gap-2 text-[10px] transition-opacity duration-300"
            style={{ opacity: Math.max(0.2, 1 - i * 0.14) }}
          >
            <span className="text-slate-700 tabular-nums shrink-0">{mounted ? l.ts : "--:--:--"}</span>
            <span className="font-bold w-7 shrink-0" style={{ color: l.color }}>{l.type}</span>
            <span className="text-slate-400 truncate">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card G — Check interval selector ────────────────────────────────────────

function CheckIntervalCard() {
  const [active, setActive] = useState(1);
  const opts = [
    { label: "Every 30s",  sub: "Intensive"  },
    { label: "Every 60s",  sub: "Standard"   },
    { label: "Every 2min", sub: "Balanced"   },
    { label: "Every 5min", sub: "Light"      },
  ];

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Zap className="w-4 h-4" />}
        label="Check Interval"
        color="#fb923c"
      />
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {opts.map((o, i) => (
          <button
            key={o.label}
            onClick={() => setActive(i)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all duration-200",
              active === i
                ? "border-[#fb923c]/40 bg-[#fb923c]/8"
                : "border-white/5 bg-white/2 hover:border-white/8"
            )}
          >
            <span className={cn("text-[11px] font-mono", active === i ? "text-white" : "text-slate-500")}>
              {o.label}
            </span>
            <span className={cn("text-[10px] font-mono", active === i ? "text-[#fb923c]" : "text-slate-700")}>
              {o.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Card H — Monitor types ───────────────────────────────────────────────────

function MonitorTypesCard() {
  const types = [
    { label: "HTTP / HTTPS", icon: <Globe className="w-4 h-4" />,  color: "#4ade80", desc: "Status + latency checks"   },
    { label: "SSL / TLS",    icon: <Shield className="w-4 h-4" />, color: "#a78bfa", desc: "Certificate expiry alerts" },
    { label: "TCP Port",     icon: <Radio className="w-4 h-4" />,  color: "#60a5fa", desc: "Port reachability probe"   },
    { label: "Keyword",      icon: <Zap className="w-4 h-4" />,    color: "#fb923c", desc: "Body content assertions"   },
  ];

  return (
    <div className="flex flex-col h-full">
      <CardLabel
        icon={<Shield className="w-4 h-4" />}
        label="Monitor Types"
        color="#a78bfa"
      />
      <div className="grid grid-cols-2 gap-2 flex-1 content-start">
        {types.map((t) => (
          <div
            key={t.label}
            className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-colors"
          >
            <span style={{ color: t.color }}>{t.icon}</span>
            <div>
              <div className="text-[11px] font-mono font-semibold text-white">{t.label}</div>
              <div className="text-[9px] text-slate-600 mt-0.5">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FeatureBento() {
  return (
    <section id="features" className="relative py-24 bg-[#050816] overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/4 blur-3xl" />
        <div className="absolute bottom-0 right-0  w-[400px] h-[400px] rounded-full bg-cyan-600/3  blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Platform Features"
          title="Everything you need to monitor with confidence."
          description="From sub-second alerting to a 6-month availability heatmap — a complete operational picture in one place."
          highlight="monitor with confidence."
        />

        {/* 
          Bento grid — 4 columns on desktop, 2 on tablet, 1 on mobile.
          Row heights are explicit so every cell aligns cleanly.
        */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          style={{ gridAutoRows: "280px" }}
        >
          {/* Row 1 */}
          <BentoCell className="lg:col-span-1" accent="#00D4FF">
            <MonitorCard />
          </BentoCell>

          <BentoCell className="lg:col-span-1" accent="#00D4FF">
            <UptimeCard />
          </BentoCell>

          <BentoCell className="lg:col-span-2" accent="#4ade80">
            <ResponseCard />
          </BentoCell>

          {/* Row 2 */}
          <BentoCell className="lg:col-span-2" accent="#60a5fa">
            <HeatmapCard />
          </BentoCell>

          <BentoCell className="lg:col-span-1" accent="#f59e0b">
            <NotificationCard />
          </BentoCell>

          <BentoCell className="lg:col-span-1" accent="#a78bfa">
            <EventStreamCard />
          </BentoCell>

          {/* Row 3 */}
          <BentoCell className="lg:col-span-2" accent="#a78bfa">
            <MonitorTypesCard />
          </BentoCell>

          <BentoCell className="lg:col-span-2" accent="#fb923c">
            <CheckIntervalCard />
          </BentoCell>
        </div>
      </div>
    </section>
  );
}