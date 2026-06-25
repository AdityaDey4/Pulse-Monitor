"use client";

import { useMonitorRealtime } from "@/hooks/use-monitor-realtime";

export function MonitorRealtime({
  monitorId,
}: {
  monitorId: string;
}) {
  useMonitorRealtime(
    monitorId
  );

  return null;
}