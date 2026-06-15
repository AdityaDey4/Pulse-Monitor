import { monitorQueue } from "@/queues/monitor.queue";
import { MonitorJobData } from "@/types/job.type";

export async function scheduleMonitor(
  data: MonitorJobData,
  intervalMinutes: number,
) {
  await monitorQueue.upsertJobScheduler(
    `monitor-${data.monitorId}`,

    {
      every: intervalMinutes * 60 * 1000,
    },

    {
      name: "check-monitor",

      data: data
    },
  );
}

export async function removeMonitor(data: MonitorJobData,) {
  await monitorQueue.removeJobScheduler(`monitor-${data.monitorId}`);
}
