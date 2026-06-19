import { prisma } from "@/lib/prisma";
import { Monitor, NotificationType } from "../../generated/prisma/client";
import { determineMonitorStatus } from "@/lib/monitor-status-config";
import { CheckResultType } from "@/types/monitor.type";
import {
  AppResponseWrapper,
  createErrorResponse,
  createSuccessResponse,
} from "@/types/common.type";
import { SOCKET_EVENTS } from "@/realtime/events";
import { publishEvent } from "@/realtime/publisher";
import { NotificationPayload } from "@/types/realtime.type";
export interface CheckResultsPagination {
  checkResults: CheckResultType[];
  nextCursor: number | null;
}


export async function applyCheckResult(monitorId: number): Promise<void> {
  const monitor = await prisma.monitor.findUnique({
    where: {
      id: monitorId,
    },
  });

  if (!monitor) {
    return;
  }

  const startedAt = Date.now();

  try {
    const response = await fetch(monitor.url, {
      method: monitor.method,
      signal: AbortSignal.timeout(10000),
    });

    const responseTime = Date.now() - startedAt;

    await prisma.checkResult.create({
      data: {
        monitorId,
        success: response.ok,
        statusCode: response.status,
        responseTime,
      },
    });
    console.log(
  "Running check for monitor:",
  monitorId
);
  } catch (error) {
    const responseTime = Date.now() - startedAt;

    await prisma.checkResult.create({
      data: {
        monitorId,
        success: false,
        responseTime,
        errorMessage: error instanceof Error ? error.message : "Unknown Error",
      },
    });
  } finally {
    await changeMonitorStatus(monitor);
    await prisma.monitor.update({
      where: {
        id: monitorId,
      },
      data: {
        lastCheckedAt: new Date(),
      },
    });
  }
}

async function getConsecutiveCheckResults(monitorId: number, limit = 10) {
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
  const checkResults = await getConsecutiveCheckResults(monitor.id);

  const nextStatus = determineMonitorStatus(monitor.status, checkResults);


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
        
    const notification =
      await prisma.notification.create({
        data: {
          userId: monitor.userId,
          type: nextStatus === "DOWN" ? NotificationType.ERROR : NotificationType.SUCCESS,
          message: `Monitor "${monitor.name}" is now ${nextStatus}`,
          redirectPath: `/monitors/${monitor.id}`,
        },
      });

    await publishEvent(
      SOCKET_EVENTS.NOTIFICATION_CREATED,
      {
        userId: monitor.userId.toString(),
        notificationId: notification.id.toString(),
        type: notification.type,
        message: notification.message,
      } as NotificationPayload
    );
  }
}

export async function getCheckResults(
  monitorId: number,
  userId: number,
  cursor?: number,
): Promise<AppResponseWrapper<CheckResultsPagination>> {
  try {
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId,
      },
    });

    if (!monitor) {
      return createErrorResponse("Monitor not found");
    }

    const checkResults = await prisma.checkResult.findMany({
      where: {
        monitorId,
      },

      take: 20,

      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),

      orderBy: {
        checkedAt: "desc",
      },
    });

    const lastItem = checkResults[checkResults.length - 1];

    return createSuccessResponse("Check results fetched successfully", {
      checkResults,
      nextCursor: lastItem?.id ?? null,
    });
  } catch {
    return createErrorResponse("Failed to fetch check results");
  }
}
