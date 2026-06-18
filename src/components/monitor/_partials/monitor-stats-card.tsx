import { Activity, Timer, ShieldCheck, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
}

export function MonitorStatsCard({ title, value }: Props) {
  const getConfig = () => {
    switch (title) {
      case "Status":
        return {
          icon: Activity,
          iconClass: value === "UP" ? "text-emerald-500" : "text-red-500",
          bgClass: value === "UP" ? "bg-emerald-500/10" : "bg-red-500/10",
        };
      case "Average Response":
        return {
          icon: Timer,
          iconClass: "text-blue-500",
          bgClass: "bg-blue-500/10",
        };
      case "Successful Checks":
        return {
          icon: ShieldCheck,
          iconClass: "text-emerald-500",
          bgClass: "bg-emerald-500/10",
        };
      case "Total Checks":
        return {
          icon: BarChart3,
          iconClass: "text-orange-500",
          bgClass: "bg-orange-500/10",
        };
      default:
        return {
          icon: Activity,
          iconClass: "text-muted-foreground",
          bgClass: "bg-muted",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  // Format the display value
  const displayValue = () => {
    if (title === "Status") {
      const isUp = value === "UP";
      return (
        <div className="mt-3 flex items-center gap-2">
          {/* Pulse dot */}
          <span className="relative flex h-2.5 w-2.5">
            {isUp && (
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
              />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isUp ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </span>
          <span
            className={`text-2xl font-bold tracking-tight ${
              isUp ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {value}
          </span>
        </div>
      );
    }

    return (
      <h3 className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
        {value}
      </h3>
    );
  };

  return (
    <Card className="relative overflow-hidden border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Background glow */}
      <div
        className={`absolute right-0 top-0 h-20 w-20 rounded-full blur-3xl ${config.bgClass}`}
      />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {displayValue()}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.bgClass}`}
        >
          <Icon className={`h-6 w-6 ${config.iconClass}`} />
        </div>
      </div>
    </Card>
  );
}