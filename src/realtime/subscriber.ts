import { subscriber } from "@/lib/redis";

import { getIO } from "./socket";

import { SOCKET_EVENTS } from "./events";

export async function startSubscriber() {

  console.log("Subscriber has been started");
  await subscriber.subscribe("realtime");

  subscriber.on(
    "message",
    (_, message) => {
      const io = getIO();

      const {
        event,
        payload,
      } = JSON.parse(message);
      
      switch (event) {
        case SOCKET_EVENTS
          .NOTIFICATION_CREATED:

          io.to(
            `user:${payload.userId}`
          ).emit(
            SOCKET_EVENTS.NOTIFICATION_CREATED,
            payload
          );

          break;

        case SOCKET_EVENTS
          .MONITOR_UPDATED:

          io.to(
            `monitor:${payload.monitorId}`
          ).emit(
            SOCKET_EVENTS.MONITOR_UPDATED,
            payload
          );

          break;
      }
    }
  );
}