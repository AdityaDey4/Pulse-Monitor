"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Cpu,
  Database,
  Radio,
  Zap,
  Shield,
  CheckCircle2,
  Activity,
  Lock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeepDiveCard {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  eyebrow: string;
  problem: string;
  solution: string;
  tech: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CARDS: DeepDiveCard[] = [
  {
    id: "engine",
    icon: Activity,
    iconColor: "#00D4FF",
    eyebrow: "Monitoring Engine",
    problem:
      "Scheduling thousands of HTTP checks reliably without blocking the web server or losing jobs on restart.",
    solution:
      "A dedicated background worker process polls a persistent job queue, executes checks in isolation, and writes results directly to PostgreSQL — fully decoupled from the Next.js server lifecycle.",
    tech: ["Node.js", "Background Worker", "Prisma", "PostgreSQL"],
  },
  {
    id: "workers",
    icon: Cpu,
    iconColor: "#a78bfa",
    eyebrow: "Background Workers",
    problem:
      "Long-running tasks like HTTP checks cannot live inside HTTP request handlers — they time out, block event loops, and lose state on deploy.",
    solution:
      "Workers run as a separate process with their own lifecycle. Each check job is idempotent — retried up to 3 times on failure, with exponential backoff to avoid thundering herd.",
    tech: ["Node.js Process", "Job Queue", "Retry Logic", "Backoff"],
  },
  {
    id: "redis",
    icon: Radio,
    iconColor: "#fb923c",
    eyebrow: "Redis Pub/Sub",
    problem:
      "Pushing a check result to every connected browser client without polling, and without coupling the worker to the WebSocket layer.",
    solution:
      "The worker PUBLISHes to a Redis channel after every check. The Socket.IO server SUBSCRIBEs and fans out to all rooms — O(1) publish cost regardless of how many clients are connected.",
    tech: ["ioredis", "PUBLISH / SUBSCRIBE", "Channel Fan-out", "Decoupling"],
  },
  {
    id: "socketio",
    icon: Zap,
    iconColor: "#facc15",
    eyebrow: "Realtime Layer",
    problem:
      "Keeping dashboards in sync with check results as they happen, without clients polling the API on an interval.",
    solution:
      "Socket.IO subscribes to Redis on server startup and re-emits events to client rooms. Clients receive live updates via a persistent WebSocket connection — zero polling, sub-100ms delivery.",
    tech: ["Socket.IO Server", "WebSocket", "Rooms", "Reconnection"],
  },
  {
    id: "database",
    icon: Database,
    iconColor: "#60a5fa",
    eyebrow: "Database Layer",
    problem:
      "Storing every check result for every monitor without the table growing unbounded or queries slowing down over time.",
    solution:
      "Prisma ORM with PostgreSQL. The check_results table is indexed on (monitor_id, checked_at DESC) for fast range queries. Older records are archived via a scheduled cleanup worker.",
    tech: ["PostgreSQL", "Prisma ORM", "Indexed Queries", "Archival Worker"],
  },
  {
    id: "auth",
    icon: Lock,
    iconColor: "#4ade80",
    eyebrow: "Authentication",
    problem:
      "Securing the dashboard and API without building and maintaining a custom auth system from scratch.",
    solution:
      "Auth.js handles OAuth 2.0 (Google, GitHub) with server-side sessions persisted in PostgreSQL via the Prisma adapter. Server Actions validate session tokens at the boundary — no exposed REST layer.",
    tech: ["Auth.js", "OAuth 2.0", "Prisma Adapter", "Server Actions"],
  },
  {
    id: "validation",
    icon: CheckCircle2,
    iconColor: "#4ade80",
    eyebrow: "Validation",
    problem:
      "Ensuring untrusted data from forms and API calls never reaches the database in an invalid state.",
    solution:
      "Zod schemas are co-located with every form and Server Action. Input is parsed and validated at every trust boundary — client, server action, and database write — with descriptive error messages surfaced to the user.",
    tech: ["Zod", "React Hook Form", "Server Actions", "Type Safety"],
  },
  {
    id: "design",
    icon: Shield,
    iconColor: "#f87171",
    eyebrow: "System Design",
    problem:
      "Demonstrating a coherent, production-ready architecture that scales beyond a single monolith.",
    solution:
      "Montu Pilot separates concerns across three processes: the Next.js web server, the background worker, and the Socket.IO relay. Each has a single responsibility — independently deployable and replaceable.",
    tech: ["Separation of Concerns", "Event-Driven", "Independent Processes", "Scalable"],
  },
];

// ─── SpotlightCard ────────────────────────────────────────────────────────────

function SpotlightCard({ card }: { card: DeepDiveCard }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      className="relative rounded-2xl border border-white/6 bg-[#0d1424] p-5 overflow-hidden transition-all duration-300 group cursor-default"
      style={hovered ? { borderColor: `rgba(${hexToRgb(card.iconColor)},0.25)` } : undefined}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Spotlight radial gradient follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px at ${pos.x}px ${pos.y}px, rgba(${hexToRgb(card.iconColor)},0.07), transparent 80%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg,transparent,rgba(${hexToRgb(card.iconColor)},0.5),transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Icon + eyebrow */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0"
          style={{
            background: `rgba(${hexToRgb(card.iconColor)},0.1)`,
            borderColor: `rgba(${hexToRgb(card.iconColor)},0.2)`,
          }}
        >
          <Icon className="w-4 h-4" style={{ color: card.iconColor }} />
        </div>
        <span
          className="text-[11px] font-mono font-semibold uppercase tracking-widest"
          style={{ color: card.iconColor }}
        >
          {card.eyebrow}
        </span>
      </div>

      {/* Problem */}
      <div className="mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 block mb-1">
          Problem
        </span>
        <p className="text-[12px] text-slate-400 leading-relaxed">{card.problem}</p>
      </div>

      {/* Solution */}
      <div className="mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 block mb-1">
          Solution
        </span>
        <p className="text-[12px] text-slate-300 leading-relaxed">{card.solution}</p>
      </div>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {card.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-md text-[10px] font-mono border"
            style={{
              background: `rgba(${hexToRgb(card.iconColor)},0.06)`,
              borderColor: `rgba(${hexToRgb(card.iconColor)},0.15)`,
              color: card.iconColor,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── TechnicalDeepDive ────────────────────────────────────────────────────────

export function TechnicalDeepDive() {
  return (
    <section id="deep-dive" className="relative py-24 bg-[#050816] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-violet-600/3 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Engineering"
          title="Built with intention. Engineered for production."
          description="Every architectural decision has a reason. Here's the thinking behind the systems that power Montu Pilot."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CARDS.map((card) => (
            <SpotlightCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechnicalDeepDive;