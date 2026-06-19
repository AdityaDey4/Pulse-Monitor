import type { MonitorType } from "@/types/monitor.type";

import { DeleteMonitorButton } from "./delete-monitor-button";

interface Props {
  monitor: MonitorType;
}

export function MonitorCard({
  monitor,
}: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">
            {monitor.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {monitor.url}
          </p>

          <div className="mt-2 flex gap-4 text-sm">
            <span>
              {monitor.method}
            </span>

            <span>
              {monitor.intervalMinutes}
              min
            </span>

            <span>
              {monitor.status}
            </span>
          </div>
        </div>

        <DeleteMonitorButton
          monitorId={monitor.id}
        />
      </div>
    </div>
  );
}