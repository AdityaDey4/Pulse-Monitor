import { Monitor } from "../../../generated/prisma/client";
import { MonitorCard } from "./monitor-card";

interface Props {
  monitors: Monitor[];
}

export function MonitorList({
  monitors,
}: Props) {
  if (!monitors.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        No monitors found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
        />
      ))}
    </div>
  );
}