"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Globe,
  Server,
  Database,
  Zap,
  Shield,
  BarChart2,
  Radio,
  Plug,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tech {
  name: string;
  role: string;           // one-line purpose
  layer: string;          // what layer it lives in
  color: string;          // accent hex
  rgb: string;
  icon: React.ReactNode;
  badge: string;          // tiny label e.g. "Frontend" "Runtime"
  facts: string[];        // 2 micro-facts shown on hover
}

interface Layer {
  id: string;
  label: string;
  description: string;
  techs: Tech[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAYERS: Layer[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "What users see and interact with",
    techs: [
      {
        name: "Next.js 15",
        role: "App Router · Server Actions · SSR",
        layer: "frontend",
        color: "#ffffff",
        rgb: "255,255,255",
        badge: "Framework",
        icon: <Globe className="w-4 h-4" />,
        facts: ["App Router with React Server Components", "Server Actions replace REST for mutations"],
      },
      {
        name: "TypeScript",
        role: "End-to-end type safety",
        layer: "frontend",
        color: "#3b82f6",
        rgb: "59,130,246",
        badge: "Language",
        icon: <Shield className="w-4 h-4" />,
        facts: ["Strict mode — zero any allowed", "Shared types across client and server"],
      },
      {
        name: "Tailwind CSS",
        role: "Utility-first design system",
        layer: "frontend",
        color: "#06b6d4",
        rgb: "6,182,212",
        badge: "Styling",
        icon: <Zap className="w-4 h-4" />,
        facts: ["Custom design tokens for brand palette", "Dark-first with zero runtime overhead"],
      },
      {
        name: "shadcn/ui",
        role: "Accessible, composable UI primitives",
        layer: "frontend",
        color: "#a78bfa",
        rgb: "167,139,250",
        badge: "Components",
        icon: <CheckCircle className="w-4 h-4" />,
        facts: ["Radix UI primitives under the hood", "Copy-and-own — no black-box dependencies"],
      },
      {
        name: "Recharts",
        role: "Response time graphs · Heatmaps",
        layer: "frontend",
        color: "#34d399",
        rgb: "52,211,153",
        badge: "Charts",
        icon: <BarChart2 className="w-4 h-4" />,
        facts: ["Custom tooltips for latency data", "Animated availability heatmap cells"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    description: "The engine running your monitors 24/7",
    techs: [
      {
        name: "Node.js Workers",
        role: "Background monitoring processes",
        layer: "backend",
        color: "#4ade80",
        rgb: "74,222,128",
        badge: "Runtime",
        icon: <Server className="w-4 h-4" />,
        facts: ["Dedicated workers — never blocks the HTTP layer", "Exponential back-off on retries"],
      },
      {
        name: "Prisma ORM",
        role: "Type-safe database access layer",
        layer: "backend",
        color: "#60a5fa",
        rgb: "96,165,250",
        badge: "ORM",
        icon: <Database className="w-4 h-4" />,
        facts: ["Schema-first with auto migrations", "Relation-aware query builder"],
      },
      {
        name: "Auth.js",
        role: "OAuth · Session management",
        layer: "backend",
        color: "#f59e0b",
        rgb: "245,158,11",
        badge: "Auth",
        icon: <Shield className="w-4 h-4" />,
        facts: ["Google + GitHub OAuth providers", "JWT sessions with server-side validation"],
      },
      {
        name: "Zod + RHF",
        role: "Runtime validation · Form state",
        layer: "backend",
        color: "#fb923c",
        rgb: "251,146,60",
        badge: "Validation",
        icon: <CheckCircle className="w-4 h-4" />,
        facts: ["Schemas shared between client and server", "Zero unvalidated input reaches the DB"],
      },
    ],
  },
  {
    id: "realtime",
    label: "Realtime",
    description: "Sub-second event propagation to every client",
    techs: [
      {
        name: "Redis Pub/Sub",
        role: "Event bus between workers and API",
        layer: "realtime",
        color: "#ef4444",
        rgb: "239,68,68",
        badge: "Message Bus",
        icon: <Radio className="w-4 h-4" />,
        facts: ["Workers PUBLISH; API server SUBSCRIBE", "Decoupled — zero direct DB polling"],
      },
      {
        name: "Socket.IO",
        role: "Live dashboard push · Client sync",
        layer: "realtime",
        color: "#facc15",
        rgb: "250,204,21",
        badge: "WebSocket",
        icon: <Plug className="w-4 h-4" />,
        facts: ["Bi-directional — server pushes without client polling", "Room-based isolation per user"],
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    description: "Persistent storage and fast retrieval",
    techs: [
      {
        name: "PostgreSQL",
        role: "Source of truth for all monitor data",
        layer: "data",
        color: "#60a5fa",
        rgb: "96,165,250",
        badge: "Database",
        icon: <Database className="w-4 h-4" />,
        facts: ["Relational model — monitors, checks, alerts", "Indexed on monitor_id + checked_at for fast history"],
      },
      {
        name: "Redis Cache",
        role: "Hot data · Rate limiting · Queues",
        layer: "data",
        color: "#ef4444",
        rgb: "239,68,68",
        badge: "Cache",
        icon: <Zap className="w-4 h-4" />,
        facts: ["TTL-based monitor config cache", "Atomic INCR for rate-limit counters"],
      },
    ],
  },
];

// Layer accent colours for the tab row
const LAYER_COLORS: Record<string, { color: string; rgb: string }> = {
  frontend: { color: "#a78bfa", rgb: "167,139,250" },
  backend:  { color: "#4ade80", rgb: "74,222,128" },
  realtime: { color: "#facc15", rgb: "250,204,21" },
  data:     { color: "#60a5fa", rgb: "96,165,250" },
};

// ─── Counter animation hook ───────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const ease = 1 - Math.pow(1 - p, 3);
            setValue(Math.floor(ease * target));
            if (p < 1) requestAnimationFrame(tick);
            else setValue(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

// ─── TechCard ────────────────────────────────────────────────────────────────

function TechCard({ tech }: { tech: Tech }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-xl border border-white/6 bg-[#111827] overflow-hidden cursor-default transition-all duration-300 group"
      style={
        hovered
          ? {
              borderColor: `rgba(${tech.rgb},0.4)`,
              backgroundColor: `rgba(${tech.rgb},0.05)`,
              boxShadow: `0 0 24px rgba(${tech.rgb},0.12)`,
            }
          : {}
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg,transparent,${tech.color},transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="p-4">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
            style={{
              background: hovered ? `rgba(${tech.rgb},0.15)` : "#1e293b",
              borderColor: hovered ? `rgba(${tech.rgb},0.35)` : "rgba(255,255,255,0.06)",
              color: hovered ? tech.color : "#475569",
            }}
          >
            {tech.icon}
          </div>
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all duration-300"
            style={{
              background: hovered ? `rgba(${tech.rgb},0.12)` : "rgba(255,255,255,0.03)",
              borderColor: hovered ? `rgba(${tech.rgb},0.3)` : "rgba(255,255,255,0.06)",
              color: hovered ? tech.color : "#475569",
            }}
          >
            {tech.badge}
          </span>
        </div>

        {/* Name */}
        <div
          className="text-[13px] font-semibold mb-1 transition-colors duration-300"
          style={{ color: hovered ? "#ffffff" : "#94a3b8" }}
        >
          {tech.name}
        </div>

        {/* Role */}
        <div className="text-[11px] text-slate-600 leading-relaxed mb-3">
          {tech.role}
        </div>

        {/* Hover facts */}
        <div
          className="space-y-1.5 overflow-hidden transition-all duration-300"
          style={{ maxHeight: hovered ? 80 : 0, opacity: hovered ? 1 : 0 }}
        >
          {tech.facts.map((f, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <ArrowRight
                className="w-3 h-3 flex-shrink-0 mt-0.5"
                style={{ color: tech.color }}
              />
              <span className="text-[10px] text-slate-400 leading-snug">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stat counter pill ────────────────────────────────────────────────────────

function StatPill({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const { value, ref } = useCountUp(target, 1400);
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl font-bold font-mono text-white tabular-nums">
        {value}
        <span className="text-[#00D4FF]">{suffix}</span>
      </div>
      <div className="text-[11px] text-slate-600 mt-0.5">{label}</div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function TechStack() {
  const [activeLayer, setActiveLayer] = useState<string>("frontend");

  const current = LAYERS.find((l) => l.id === activeLayer)!;
  const lc = LAYER_COLORS[activeLayer];

  return (
    <section
      id="tech-stack"
      className="relative py-24 bg-[#050816] overflow-hidden"
    >
      {/* Ambient glow behind section */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-40 transition-all duration-700"
          style={{ background: `radial-gradient(circle, rgba(${lc.rgb},0.08), transparent 70%)` }}
        />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl bg-indigo-600/4" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">

        {/* ── Section header ── */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/8 bg-white/3 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              Engineering Stack
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
                Every layer chosen
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#a78bfa]">
                  with intent.
                </span>
              </h2>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                No boilerplate padding. Each technology solves a specific
                problem in Montu Pilot&apos;s production pipeline.
              </p>
            </div>

            {/* Animated stat pills */}
            <div className="flex items-center gap-8 lg:gap-12">
              <StatPill target={13} suffix="+" label="Technologies" />
              <div className="w-px h-8 bg-white/6" />
              <StatPill target={4} suffix="" label="System Layers" />
              <div className="w-px h-8 bg-white/6" />
              <StatPill target={99} suffix="%" label="Type Coverage" />
            </div>
          </div>
        </div>

        {/* ── Layer selector tabs ── */}
        <div className="flex items-center gap-1 mb-8 p-1 rounded-xl border border-white/6 bg-[#0a0f1e] w-fit">
          {LAYERS.map((layer) => {
            const lColor = LAYER_COLORS[layer.id];
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-[12px] font-mono font-medium transition-all duration-200",
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-400",
                )}
                style={
                  isActive
                    ? {
                        background: `rgba(${lColor.rgb},0.1)`,
                        boxShadow: `inset 0 0 0 1px rgba(${lColor.rgb},0.25)`,
                        color: lColor.color,
                      }
                    : {}
                }
              >
                {layer.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px rounded-full"
                    style={{ background: lColor.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Layer description bar ── */}
        <div
          className="flex items-center gap-3 mb-6 px-4 py-2.5 rounded-lg border"
          style={{
            borderColor: `rgba(${lc.rgb},0.15)`,
            background: `rgba(${lc.rgb},0.04)`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: lc.color }}
          />
          <span className="text-[12px] font-mono text-slate-400">
            <span className="font-semibold" style={{ color: lc.color }}>
              {current.label}
            </span>{" "}
            — {current.description}
          </span>
        </div>

        {/* ── Tech cards grid ── */}
        <div
          className={cn(
            "grid gap-3",
            current.techs.length <= 2
              ? "grid-cols-1 sm:grid-cols-2"
              : current.techs.length <= 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          )}
        >
          {current.techs.map((tech) => (
            <TechCard key={tech.name} tech={tech} />
          ))}
        </div>

        {/* ── Full stack summary strip ── */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-[#0a0f1e] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">
              Full stack at a glance
            </span>
            <div className="flex-1 h-px bg-white/4" />
            <span className="text-[10px] font-mono text-slate-700">
              {LAYERS.reduce((acc, l) => acc + l.techs.length, 0)} technologies
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
            {LAYERS.map((layer) => {
              const lColor = LAYER_COLORS[layer.id];
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className="group p-5 text-left hover:bg-white/2 transition-colors duration-200"
                >
                  <div
                    className="text-[10px] font-mono uppercase tracking-widest mb-3 transition-colors duration-200"
                    style={{
                      color: activeLayer === layer.id ? lColor.color : "#475569",
                    }}
                  >
                    {layer.label}
                  </div>
                  <div className="space-y-1.5">
                    {layer.techs.map((t) => (
                      <div
                        key={t.name}
                        className="flex items-center gap-2"
                      >
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: t.color }}
                        />
                        <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                          {t.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}