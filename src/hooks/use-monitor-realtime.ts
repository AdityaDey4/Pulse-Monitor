"use client";

import { useEffect } from "react";

import { getSocket } from "@/lib/socket-client";

export function useMonitorRealtime(
  monitorId: string,
  refetch: () => Promise<void>,
) {

  useEffect(() => {

    const socket = getSocket();

    socket.emit(
      "join-monitor-room",
      monitorId
    );

    const handler = async () => {

      await refetch();
    };

    socket.on(
      "monitor:updated",
      handler
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

  }, [monitorId, refetch]);
}