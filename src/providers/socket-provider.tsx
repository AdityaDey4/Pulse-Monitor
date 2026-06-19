"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket-client";

export function SocketProvider({
  userId,
}: {
  userId: string;
}) {
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on("connect", () => {

      socket.emit(
        "join-user-room",
        userId
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null;
}