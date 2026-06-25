import {
  Play,
  RotateCcw,
  CheckCircle2,
  Monitor,
  Cpu,
  Database,
  Zap,
  Target,
  Radio,
  AlertTriangle,
  Plug,
  TrendingUp,
  Mail,
  Bell,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

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

interface ArchEdge {
  from: string;
  to: string;
}

interface SimLogEntry {
  nodeId: string;
  color: string;
  message: string;
  time: string;
}
export const NODES: ArchNode[] = [
  // Col 1
  {
    id: "monitor",
    label: "Monitor",
    tech: "Next.js · Prisma",
    Icon: Monitor,
    color: "#00D4FF",
    rgb: "0,212,255",
    statusLabel: "Scheduling",
    logMessage: "Monitor config loaded — dispatching job #4821",
    cx: 75,
    cy: 240,
  },
  // Col 2
  {
    id: "worker",
    label: "Worker",
    tech: "Node.js BG Process",
    Icon: Cpu,
    color: "#a78bfa",
    rgb: "167,139,250",
    statusLabel: "Processing",
    logMessage: "Worker #3 picked up job #4821 from queue",
    cx: 240,
    cy: 90,
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    tech: "Prisma ORM",
    Icon: Database,
    color: "#60a5fa",
    rgb: "96,165,250",
    statusLabel: "Writing",
    logMessage: "INSERT check_results — latency:142ms status:200",
    cx: 240,
    cy: 390,
  },
  // Col 3
  {
    id: "http-check",
    label: "HTTP Check",
    tech: "fetch · 5s timeout",
    Icon: Zap,
    color: "#4ade80",
    rgb: "74,222,128",
    statusLabel: "Checking",
    logMessage: "GET /health → 200 OK (142ms)",
    cx: 415,
    cy: 90,
  },
  {
    id: "criteria",
    label: "Success Criteria",
    tech: "Rules Engine",
    Icon: Target,
    color: "#14b8a6",
    rgb: "20,184,166",
    statusLabel: "Evaluating",
    logMessage: "Rules matched: status=200, response<200ms",
    cx: 415,
    cy: 240,
  },
  {
    id: "redis",
    label: "Redis Pub/Sub",
    tech: "ioredis · PUBLISH",
    Icon: Radio,
    color: "#fb923c",
    rgb: "251,146,60",
    statusLabel: "Publishing",
    logMessage: "PUBLISH monitor:4821:result → 1 subscriber",
    cx: 415,
    cy: 390,
  },
  // Col 4
  {
    id: "alert-service",
    label: "Alert Service",
    tech: "Rule Trigger",
    Icon: AlertTriangle,
    color: "#ef4444",
    rgb: "239,68,68",
    statusLabel: "Triggering",
    logMessage: "Failure detected — creating alert",
    cx: 610,
    cy: 90,
  },
  {
    id: "socketio",
    label: "Socket.IO",
    tech: "Bi-directional WS",
    Icon: Plug,
    color: "#facc15",
    rgb: "250,204,21",
    statusLabel: "Emitting",
    logMessage: "emit('monitor:update') → 34 connected clients",
    cx: 610,
    cy: 240,
  },
  {
    id: "analytics",
    label: "Analytics",
    tech: "Trends · SLA Reports",
    Icon: TrendingUp,
    color: "#8b5cf6",
    rgb: "139,92,246",
    statusLabel: "Aggregating",
    logMessage: "Analytics updated from latest monitor results",
    cx: 610,
    cy: 390,
  },
  // Col 5
  {
    id: "email",
    label: "Email Service",
    tech: "AWS SES",
    Icon: Mail,
    color: "#f59e0b",
    rgb: "245,158,11",
    statusLabel: "Sending",
    logMessage: "Alert email delivered successfully",
    cx: 800,
    cy: 90,
  },
  {
    id: "notifications",
    label: "Webhooks",
    tech: "Email · Webhook",
    Icon: Bell,
    color: "#f87171",
    rgb: "248,113,113",
    statusLabel: "Alerting",
    logMessage: "Threshold OK — notification suppressed",
    cx: 800,
    cy: 240,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    tech: "Next.js · Recharts",
    Icon: LayoutDashboard,
    color: "#00D4FF",
    rgb: "0,212,255",
    statusLabel: "Updating",
    logMessage: "UI updated — monitor #4821 last checked 0s ago",
    cx: 800,
    cy: 390,
  },
];

export 
const SIM_ORDER = [
  "monitor",
  "worker",
  "http-check",
  "criteria",
  "alert-service",
  "postgres",
  "redis",
  "email",
  "socketio",
  "analytics",
  "notifications",
  "dashboard",
];

export const EDGES: ArchEdge[] = [
  { from: "monitor", to: "worker" },
  { from: "monitor", to: "postgres" },
  { from: "worker", to: "http-check" },
  { from: "http-check", to: "criteria" },
  { from: "criteria", to: "alert-service" },
  { from: "criteria", to: "redis" },
  { from: "postgres", to: "redis" },
  { from: "alert-service", to: "email" },
  { from: "redis", to: "socketio" },
  { from: "redis", to: "analytics" },
  { from: "socketio", to: "notifications" },
  { from: "socketio", to: "dashboard" },
  { from: "analytics", to: "dashboard" },
];

export const SIM_DELAY = 650;
export const VIRTUAL_W = 920;
export const VIRTUAL_H = 480;
export const NODE_W = 148;
export const NODE_H = 99;