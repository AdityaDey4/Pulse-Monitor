"use client";

import { useMemo, useState } from "react";
import type { CheckResultType } from "@/types/monitor.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateHeatmapData,
  HeatmapDay,
} from "@/lib/heatmap-metrics";

interface Props {
  monitorName: string;
  checkResults: CheckResultType[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getDayLevel(day: HeatmapDay): 0 | 1 | 2 | 3 | 4 | 5 {
  if (day.totalChecks === 0) return 0;
  if (day.successRate === 100) return 5;
  if (day.successRate >= 90) return 4;
  if (day.successRate >= 75) return 3;
  if (day.successRate >= 50) return 2;
  return 1;
}

const LEVEL_COLORS = {
  light: {
    0: "#ebedf0",   // no data
    1: "#fca5a5",   // <50% (red-300)
    2: "#fbbf24",   // 50-74% (amber-400)
    3: "#a3e635",   // 75-89% (lime-400)
    4: "#4ade80",   // 90-99% (green-400)
    5: "#16a34a",   // 100% (green-600)
  },
  dark: {
    0: "#161b22",
    1: "#b91c1c",
    2: "#d97706",
    3: "#65a30d",
    4: "#16a34a",
    5: "#15803d",
  },
};

function formatDisplayDate(dateStr: string): string {
  // dateStr is YYYY/MM/DD
  const [year, month, day] = dateStr.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AvailabilityHeatmap({ monitorName, checkResults }: Props) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const filteredResults = checkResults.filter(
    (check) => new Date(check.checkedAt).getFullYear() === selectedYear,
  );

  const heatmapData = generateHeatmapData(filteredResults, selectedYear);

  const dayMap = useMemo(
    () => new Map(heatmapData.map((day) => [day.date, day])),
    [heatmapData],
  );

  // Build week columns: each column = 7 days (Sun–Sat)
  // Pad beginning so Jan 1 lands on correct weekday
  const weeks = useMemo(() => {
    const jan1 = new Date(selectedYear, 0, 1);
    const startOffset = jan1.getDay(); // 0=Sun

    // Flatten into slots: null = padding
    const slots: (HeatmapDay | null)[] = [
      ...Array(startOffset).fill(null),
      ...heatmapData,
    ];

    // Group into weeks
    const cols: (HeatmapDay | null)[][] = [];
    for (let i = 0; i < slots.length; i += 7) {
      cols.push(slots.slice(i, i + 7));
    }
    return cols;
  }, [heatmapData, selectedYear]);

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    const jan1 = new Date(selectedYear, 0, 1);
    const startOffset = jan1.getDay();

    for (let m = 0; m < 12; m++) {
      const firstOfMonth = new Date(selectedYear, m, 1);
      const dayOfYear =
        Math.floor(
          (firstOfMonth.getTime() - new Date(selectedYear, 0, 0).getTime()) /
            86400000,
        ) - 1;
      const col = Math.floor((dayOfYear + startOffset) / 7);
      labels.push({ label: MONTHS[m], col });
    }
    return labels;
  }, [selectedYear]);

  const CELL = 13;
  const GAP = 3;
  const STEP = CELL + GAP;

  const svgWidth = weeks.length * STEP + 30; // 30 for day labels
  const svgHeight = 7 * STEP + 24; // 24 for month labels

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Availability History
          </h2>
          <p className="text-xs text-muted-foreground">
            Daily uptime heatmap — click any cell for details
          </p>
        </div>

        <Select
          value={String(selectedYear)}
          onValueChange={(value) => {
            setSelectedYear(Number(value));
            setSelectedDay(null);
          }}
        >
          <SelectTrigger className="h-9 w-[110px] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Heatmap */}
      <div className="relative overflow-x-auto rounded-xl border bg-muted/20 p-4">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="overflow-visible"
          style={{ display: "block", minWidth: svgWidth }}
        >
          {/* Day-of-week labels */}
          {[1, 3, 5].map((dayIdx) => (
            <text
              key={dayIdx}
              x={8}
              y={20 + dayIdx * STEP + CELL / 2 + 4}
              fontSize={10}
              fill="currentColor"
              className="text-muted-foreground"
              opacity={0.6}
            >
              {DAYS[dayIdx]}
            </text>
          ))}

          {/* Month labels */}
          {monthLabels.map(({ label, col }) => (
            <text
              key={label}
              x={30 + col * STEP}
              y={12}
              fontSize={11}
              fill="currentColor"
              className="text-muted-foreground"
              opacity={0.7}
            >
              {label}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wIdx) =>
            week.map((day, dIdx) => {
              if (!day) return null;
              const level = getDayLevel(day);
              const x = 30 + wIdx * STEP;
              const y = 20 + dIdx * STEP;
              const isSelected = selectedDay?.date === day.date;
              const isHovered = hoveredDay?.date === day.date;

              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  ry={2}
                  fill={LEVEL_COLORS.light[level]}
                  className="dark:fill-[var(--cell-dark-color)] transition-opacity cursor-pointer"
                  style={
                    {
                      "--cell-dark-color": LEVEL_COLORS.dark[level],
                      opacity: isHovered || isSelected ? 1 : 0.88,
                      outline: isSelected
                        ? "2px solid hsl(var(--primary))"
                        : undefined,
                      stroke: isSelected
                        ? "hsl(var(--primary))"
                        : isHovered
                          ? "rgba(0,0,0,0.3)"
                          : "none",
                      strokeWidth: isSelected ? 1.5 : 1,
                    } as React.CSSProperties
                  }
                  onClick={() =>
                    setSelectedDay((prev) =>
                      prev?.date === day.date ? null : day,
                    )
                  }
                  onMouseEnter={(e) => {
                    setHoveredDay(day);
                    const rect = (
                      e.currentTarget as SVGRectElement
                    ).getBoundingClientRect();
                    const containerRect = (
                      e.currentTarget.closest("svg") as SVGSVGElement
                    ).getBoundingClientRect();
                    setTooltipPos({
                      x: rect.left - containerRect.left + CELL / 2,
                      y: rect.top - containerRect.top,
                    });
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              );
            }),
          )}
        </svg>

        {/* Floating tooltip */}
        {hoveredDay && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg"
            style={{
              left: tooltipPos.x + 4,
              top: tooltipPos.y - 64,
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            <p className="font-medium text-popover-foreground">
              {formatDisplayDate(hoveredDay.date)}
            </p>
            {hoveredDay.totalChecks === 0 ? (
              <p className="text-muted-foreground">No data</p>
            ) : (
              <p className="text-muted-foreground">
                {hoveredDay.successRate}% uptime &middot;{" "}
                {hoveredDay.totalChecks} checks
              </p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="mr-1 font-medium">Uptime:</span>
        {[
          { color: LEVEL_COLORS.light[0], label: "No data" },
          { color: LEVEL_COLORS.light[1], label: "< 50%" },
          { color: LEVEL_COLORS.light[2], label: "50–74%" },
          { color: LEVEL_COLORS.light[3], label: "75–89%" },
          { color: LEVEL_COLORS.light[4], label: "90–99%" },
          { color: LEVEL_COLORS.light[5], label: "100%" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Selected day detail panel */}
      {selectedDay && (
        <div className="mt-5 rounded-2xl border bg-muted/20 p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold">{monitorName}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDisplayDate(selectedDay.date)}
              </p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </div>

          {selectedDay.totalChecks === 0 ? (
            <p className="text-sm text-muted-foreground">
              No monitoring data recorded for this day.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <StatBox
                label="Success Rate"
                value={`${selectedDay.successRate}%`}
                color="text-green-600"
              />
              <StatBox
                label="Failure Rate"
                value={`${selectedDay.failureRate}%`}
                color="text-red-500"
              />
              <StatBox
                label="Successful"
                value={String(selectedDay.successfulChecks)}
              />
              <StatBox
                label="Failed"
                value={String(selectedDay.failedChecks)}
                color={
                  selectedDay.failedChecks > 0 ? "text-red-500" : undefined
                }
              />
              <StatBox
                label="Total Checks"
                value={String(selectedDay.totalChecks)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${color ?? ""}`}>
        {value}
      </p>
    </div>
  );
}