import { cn } from "@/lib/utils";
import { NODE_H, NODE_W } from "./architecture-data";
import { LucideIcon } from "lucide-react";

type NodeStatus = "idle" | "active" | "done";
interface ArchNode {
  id: string;
  label: string;
  tech: string;
  Icon: LucideIcon;
  color: string;
  rgb: string;
  statusLabel: string;
  logMessage: string;
  cx: number;
  cy: number;
}

export function NodeCard({
  node,
  status,
  index,
  scaleX,
  scaleY,
}: {
  node: ArchNode;
  status: NodeStatus;
  index: number;
  scaleX: number;
  scaleY: number;
}) {
  const isActive = status === "active";
  const isDone = status === "done";

  const w = NODE_W * scaleX;
  const h = NODE_H * scaleY;
  const left = node.cx * scaleX - w / 2;
  const top = node.cy * scaleY - h / 2;

  const { Icon } = node;

  return (
    <div
      className={cn(
        "absolute rounded-xl border overflow-hidden transition-all duration-400",
        isActive && "shadow-[0_0_0_1px_var(--nc),0_0_28px_rgba(var(--nr)/0.25)]",
        isDone && "border-emerald-500/30 bg-[#0a1a0f]",
        !isActive && !isDone && "border-white/6 bg-[#111827]",
      )}
      style={{
        left,
        top,
        width: w,
        height: h,
        ...(isActive
          ? ({
              "--nc": node.color,
              borderColor: node.color,
              backgroundColor: `rgba(${node.rgb},0.07)`,
            } as React.CSSProperties)
          : {}),
      }}
    >
      {/* Active shimmer top bar */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg,transparent,${node.color},transparent)`,
          }}
        />
      )}

      {/* Header row */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-white/5">
        {/* Icon badge */}
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center border flex-shrink-0 transition-all duration-300"
          style={
            isActive
              ? { background: `rgba(${node.rgb},0.18)`, borderColor: `rgba(${node.rgb},0.4)` }
              : isDone
              ? { background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.28)" }
              : { background: "#1e293b", borderColor: "rgba(255,255,255,0.07)" }
          }
        >
          <Icon
            className="w-3.5 h-3.5"
            style={{
              color: isActive ? node.color : isDone ? "#4ade80" : "#334155",
            }}
          />
        </div>

        {/* Label */}
        <span
          className={cn(
            "text-[11px] font-semibold flex-1 leading-tight transition-colors duration-300 truncate",
            isActive ? "text-white" : isDone ? "text-emerald-300" : "text-slate-500",
          )}
        >
          {node.label}
        </span>

        {/* Index badge */}
        <span
          className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-all duration-300 flex-shrink-0"
          style={
            isActive
              ? { background: node.color, color: "#050816", fontWeight: 700 }
              : isDone
              ? { background: "rgba(34,197,94,0.2)", color: "#4ade80" }
              : { background: "#1e293b", color: "#334155" }
          }
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5">
        <div
          className={cn(
            "text-[9px] font-mono mb-2 transition-colors duration-300 truncate",
            isActive ? "text-slate-400" : isDone ? "text-slate-600" : "text-[#1e293b]",
          )}
        >
          {node.tech}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300",
              isActive && "animate-pulse",
            )}
            style={{ background: isActive ? node.color : isDone ? "#22c55e" : "#1e293b" }}
          />
          <span
            className={cn(
              "text-[9px] font-mono transition-colors duration-300",
              isActive ? "text-[#00D4FF]" : isDone ? "text-emerald-400" : "text-[#1e293b]",
            )}
          >
            {isActive ? node.statusLabel : isDone ? "Complete" : "Idle"}
          </span>
        </div>
      </div>
    </div>
  );
}