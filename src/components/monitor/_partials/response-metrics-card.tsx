import { Card } from "@/components/ui/card";
import { Zap, Gauge, Turtle, Clock3 } from "lucide-react";

interface Props {
  fastestResponse: number;
  averageResponse: number;
  slowestResponse: number;
  latestResponse: number;
}

interface MetricRowProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
  borderClass: string;
}

function MetricRow({
  label,
  value,
  icon: Icon,
  iconClass,
  bgClass,
  borderClass,
}: MetricRowProps) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3.5 ${borderClass} ${bgClass}`}>
      <div className={`rounded-lg p-2 ${bgClass}`}>
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className="text-base font-bold tabular-nums shrink-0">{value}ms</p>
      </div>
    </div>
  );
}

export function ResponseMetricsCard({
  fastestResponse,
  averageResponse,
  slowestResponse,
  latestResponse,
}: Props) {
  const metrics: MetricRowProps[] = [
    {
      label: "Fastest Response",
      value: fastestResponse,
      icon: Zap,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
    },
    {
      label: "Average Response",
      value: averageResponse,
      icon: Gauge,
      iconClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/20",
    },
    {
      label: "Slowest Response",
      value: slowestResponse,
      icon: Turtle,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/20",
    },
    {
      label: "Latest Response",
      value: latestResponse,
      icon: Clock3,
      iconClass: "text-violet-500",
      bgClass: "bg-violet-500/10",
      borderClass: "border-violet-500/20",
    },
  ];

  return (
    <Card className="flex flex-col p-5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/10 p-2">
          <Gauge className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h2 className="font-semibold">Response Metrics</h2>
          <p className="text-xs text-muted-foreground">Performance overview</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
        {metrics.map((m) => (
          <MetricRow key={m.label} {...m} />
        ))}
      </div>
    </Card>
  );
}