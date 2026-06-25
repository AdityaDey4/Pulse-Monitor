import { redis } from "@/lib/redis";
import {
  MonitorUpdatedPayload,
  NotificationSocketPayload,
} from "@/types/realtime.type";

export async function publishEvent(
  event: string,
  payload: NotificationSocketPayload | MonitorUpdatedPayload
) {
  console.log("Publishing event");

  await redis.publish(
    "realtime",
    JSON.stringify({
      event,
      payload,
    })
  );
}