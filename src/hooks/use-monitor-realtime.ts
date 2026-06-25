"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getSocket } from "@/lib/socket-client";
import { MonitorUpdatedPayload } from "@/types/realtime.type";

export function useMonitorRealtime(
  monitorId: string
) {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();

    socket.emit(
      "join-monitor-room",
      monitorId
    );

    const handler = () => {
      router.refresh();
    };

    socket.on(
      "monitor:updated",
      (payload: MonitorUpdatedPayload) => {

        if (payload.monitorId === monitorId) {
          handler();
        }
      }
    );

    return () => {
      socket.emit(
        "leave-monitor-room",
        monitorId
      );

      socket.off(
        "monitor:updated",
        handler
      );
    };
  }, [monitorId, router]);
}