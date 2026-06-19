import { redis } from "@/lib/redis";
import { MonitorUpdatedPayload, NotificationPayload } from "@/types/realtime.type";

export async function publishEvent(
  event: string,
  payload: NotificationPayload | MonitorUpdatedPayload
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