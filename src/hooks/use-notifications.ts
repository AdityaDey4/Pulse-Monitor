"use client";

import { useEffect } from "react";

import { getSocket } from "@/lib/socket-client";

import { toast } from "sonner";
import { NotificationPayload } from "@/types/realtime.type";

export function useNotifications() {
  const socket = getSocket();

  useEffect(() => {

    socket.on(
      "notification:created",
      (payload: NotificationPayload) => {

        payload.type == 'ERROR' &&
          toast.error(payload.message);
        
        payload.type === 'SUCCESS' &&
          toast.success(payload.message);
      }
    );

    return () => {

      socket.off(
        "notification:created"
      );
    };

  }, []);
}