"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import {
  NODES,
  SIM_ORDER,
  SIM_DELAY,
  VIRTUAL_W,
  VIRTUAL_H,
} from "./architecture/architecture-data";
import { NodeCard } from "./architecture/architecture-node";
import { SimLog } from "./architecture/simulation-log";
import { drawEdges } from "./architecture/canvas-utils";
// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = "idle" | "active" | "done";

interface SimLogEntry {
  nodeId: string;
  color: string;
  message: string;
  time: string;
}

function getTimestamp(): string {
  return new Date().toTimeString().slice(0, 8);
}

export function ArchitectureFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>(() =>
    Object.fromEntries(NODES.map((n) => [n.id, "idle" as NodeStatus])),
  );
  const [simLog, setSimLog] = useState<SimLogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  // Responsive scale
  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const cw = wrapRef.current.clientWidth;
      const ch = wrapRef.current.clientHeight;
      setScaleX(cw / VIRTUAL_W);
      setScaleY(ch / VIRTUAL_H);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Redraw edges
  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) return;
    canvasRef.current.width = wrapRef.current.clientWidth;
    canvasRef.current.height = wrapRef.current.clientHeight;
    drawEdges(canvasRef.current, statuses, scaleX, scaleY);
  }, [statuses, scaleX, scaleY]);

  const doneCount = Object.values(statuses).filter((s) => s === "done").length;
  const progress = Math.round((doneCount / NODES.length) * 100);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatuses(Object.fromEntries(NODES.map((n) => [n.id, "idle"])));
    setSimLog([]);
    setRunning(false);
    setDone(false);
  }, []);

  const runSim = useCallback(async () => {
    if (running) return;
    abortRef.current = false;
    setStatuses(Object.fromEntries(NODES.map((n) => [n.id, "idle"])));
    setSimLog([]);
    setDone(false);
    setRunning(true);

    await new Promise((r) => setTimeout(r, 80));

    for (const id of SIM_ORDER) {
      if (abortRef.current) break;
      const node = NODES.find((n) => n.id === id)!;
      setStatuses((p) => ({ ...p, [id]: "active" }));
      setSimLog((p) => [
        ...p,
        {
          nodeId: id,
          color: node.color,
          message: node.logMessage,
          time: getTimestamp(),
        },
      ]);
      await new Promise((r) => setTimeout(r, SIM_DELAY));
      if (abortRef.current) break;
      setStatuses((p) => ({ ...p, [id]: "done" }));
    }

    if (!abortRef.current) {
      setRunning(false);
      setDone(true);
    }
  }, [running]);

  return (
    <section
      id="architecture"
      className="relative py-20 bg-[#050816] overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-indigo-600/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="EVENT-DRIVEN ARCHITECTURE"
          title="Built for Real-Time Monitoring"
          description="Every monitor check travels through a resilient event-driven pipeline powered by background workers, PostgreSQL, Redis Pub/Sub, Socket.IO, and intelligent alerting."
        />
        {/* Main card */}
        <div className="rounded-2xl border border-white/8 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-black/60">
          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#070c1a]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex gap-1.5 flex-shrink-0">
                {["bg-red-500/50", "bg-amber-500/50", "bg-emerald-500/50"].map(
                  (c) => (
                    <span
                      key={c}
                      className={cn("w-2.5 h-2.5 rounded-full", c)}
                    />
                  ),
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-600 hidden sm:inline">
                PULSE MONITOR
              </span>
              <span className="text-slate-700 hidden sm:inline">/</span>
              <span className="text-[11px] font-mono text-slate-600 hidden sm:inline">
                architecture
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/6 text-[10px] font-mono text-[#00D4FF] flex-shrink-0">
                event-driven
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {(done || simLog.length > 0) && (
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/3 text-slate-400 hover:text-white text-[11px] font-mono transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
              <button
                onClick={runSim}
                disabled={running}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all duration-150",
                  running
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-[#00D4FF] text-[#050816] hover:bg-[#00bfe8] shadow-lg shadow-[#00D4FF]/20",
                )}
              >
                <Play className="w-3 h-3" />
                {running ? "Running…" : done ? "Run Again" : "Run Simulation"}
              </button>
            </div>
          </div>

          {/* ── Body: canvas left + log right ── */}
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px]">
            {/* Architecture canvas — taller, no scroll */}
            <div
              ref={wrapRef}
              className="relative w-full"
              style={{ height: 520 }}
            >
              {/* Figma-style dot grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                }}
              />
              {/* Subtle radial centre glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,212,255,0.05), transparent)",
                }}
              />

              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />

              {NODES.map((node) => {
                const simIndex = SIM_ORDER.indexOf(node.id);
                return (
                  <NodeCard
                    key={node.id}
                    node={node}
                    status={statuses[node.id]}
                    index={simIndex >= 0 ? simIndex : 0}
                    scaleX={scaleX}
                    scaleY={scaleY}
                  />
                );
              })}
            </div>

            {/* ── Simulation Log — NO internal scroll, grows naturally ── */}
            <div
              className="border-t lg:border-t-0 lg:border-l border-white/5 bg-[#070c1a] flex flex-col"
              style={{ height: 520 }}
            >
              {/* Log header + progress */}
              <div className="p-4 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Simulation Log
                  </span>
                  <span className="text-[10px] font-mono text-slate-700">
                    {simLog.length} event{simLog.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#00D4FF] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Log entries — NO overflow-y-auto, just padding */}
              <div className="flex-1 p-4">
                <SimLog entries={simLog} />
              </div>

              {/* Pipeline complete badge */}
              {done && (
                <div className="m-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-mono text-emerald-400">
                      Pipeline Complete
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            {
              label: "Nodes in pipeline",
              value: "12",
              sub: "Monitor → Dashboard",
            },
            {
              label: "Avg end-to-end",
              value: "<200ms",
              sub: "check to UI update",
            },
            {
              label: "Event transport",
              value: "Pub / Sub",
              sub: "Redis channels",
            },
            {
              label: "Realtime layer",
              value: "Socket.IO",
              sub: "bi-directional WS",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/6 bg-[#111827] p-4"
            >
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1">
                {s.label}
              </div>
              <div className="text-base font-semibold text-white font-mono">
                {s.value}
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchitectureFlow;
