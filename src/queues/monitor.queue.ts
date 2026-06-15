import { Queue } from "bullmq";

import { redis } from "@/lib/redis";

export const MONITOR_QUEUE =
  "monitor-checks";

export const monitorQueue = new Queue(MONITOR_QUEUE, {
    connection: redis as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
});