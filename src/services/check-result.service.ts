import { prisma } from "@/lib/prisma";
import { Monitor } from "../../generated/prisma/client";
import { determineMonitorStatus } from "@/lib/monitor-status-config";

export async function checkMonitor(
    monitorId: number
): Promise<void> {
    const monitor =
        await prisma.monitor.findUnique({
            where: {
                id: monitorId,
            },
        });

    if (!monitor) {
        return;
    }

    const startedAt = Date.now();

    try {
        const response = await fetch(
            monitor.url,
            {
                method: monitor.method,
                signal:
                    AbortSignal.timeout(10000),
            },
        );

        const responseTime =
            Date.now() - startedAt;

        await prisma.checkResult.create({
            data: {
                monitorId,
                success: response.ok,
                statusCode:
                    response.status,
                responseTime,
            },
        });
    } catch (error) {
        const responseTime =
            Date.now() - startedAt;

        await prisma.checkResult.create({
            data: {
                monitorId,
                success: false,
                responseTime,
                errorMessage:
                    error instanceof Error
                        ? error.message
                        : "Unknown Error",
            },
        });
    } finally {
        await changeMonitorStatus(monitor);
        await prisma.monitor.update({
            where: {
                id: monitorId,
            },
            data: {
                lastCheckedAt:
                    new Date(),
            },
        });
    }
}

async function getConsecutiveResults(
  monitorId: number,
  limit = 10,
) {
  return prisma.checkResult.findMany({
    where: {
      monitorId,
    },
    orderBy: {
      checkedAt: "desc",
    },
    take: limit,
  });
}

async function changeMonitorStatus(monitor: Monitor) {

  const checkResults = await getConsecutiveResults(
    monitor.id,
  );

  const nextStatus =
    determineMonitorStatus(
      monitor.status,
      checkResults
    );

    console.log("Next status : ", nextStatus);

  if (
    nextStatus !== monitor.status
  ) {
    await prisma.monitor.update({
      where: {
        id: monitor.id,
      },
      data: {
        status: nextStatus,
      },
    });
  }
}
