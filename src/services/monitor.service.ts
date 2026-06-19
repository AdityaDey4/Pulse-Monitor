import { prisma } from "@/lib/prisma";
import {
  CheckResult,
  Monitor,
  Notification,
} from "../../generated/prisma/client";

import {
  CreateMonitorInput,
  UpdateMonitorInput,
} from "@/validations/monitor.validation";

import {
  AppResponseWrapper,
  createErrorResponse,
  createSuccessResponse,
} from "@/types/common.type";
import {
  removeJobFromMonitorQueue,
  scheduleJobToMonitorQueue,
} from "./queue.service";

export interface MonitorDetails {
  monitor: Monitor;
  checkResults: CheckResult[];
}

export async function getMonitorDetails(
  monitorId: number,
  userId: number,
): Promise<AppResponseWrapper<MonitorDetails>> {
  try {
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId,
      },

      include: {
        checkResults: {
          orderBy: {
            checkedAt: "desc",
          },
          take: 50,
        },
      },
    });

    if (!monitor) {
      return createErrorResponse("Monitor not found");
    }

    return createSuccessResponse("Monitor fetched successfully", {
      monitor,
      checkResults: monitor.checkResults,
    });
  } catch(error) {
    console.error("Error fetching monitor details:", error);
    return createErrorResponse("Failed to fetch monitor");
  }
}

export async function createMonitor(
  userId: number,
  data: CreateMonitorInput,
): Promise<AppResponseWrapper<Monitor>> {
  try {
    const monitor = await prisma.monitor.create({
      data: {
        userId,
        name: data.name,
        url: data.url,
        method: data.method,
        intervalMinutes: data.intervalMinutes,
      },
    });

    await scheduleJobToMonitorQueue(
      {
        monitorId: monitor.id,
      },
      monitor.intervalMinutes,
    );

    return createSuccessResponse("Monitor created successfully", monitor);
  } catch {
    return createErrorResponse("Failed to create monitor");
  }
}

export async function getUserMonitors(
  userId: number,
): Promise<AppResponseWrapper<Monitor[]>> {
  try {
    const monitors = await prisma.monitor.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return createSuccessResponse("Monitors fetched successfully", monitors);
  } catch {
    return createErrorResponse("Failed to fetch monitors");
  }
}

export async function deleteMonitor(
  monitorId: number,
  userId: number,
): Promise<AppResponseWrapper<null>> {
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

    await prisma.monitor.delete({
      where: {
        id: monitorId,
      },
    });

    await removeJobFromMonitorQueue({
      monitorId,
    });

    return createSuccessResponse("Monitor deleted successfully", null);
  } catch {
    return createErrorResponse("Failed to delete monitor");
  }
}

export async function updateMonitor(
  userId: number,
  data: UpdateMonitorInput,
): Promise<AppResponseWrapper<Monitor>> {
  try {
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: data.id,
        userId,
      },
    });

    if (!monitor) {
      return createErrorResponse("Monitor not found");
    }

    const updatedMonitor = await prisma.monitor.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        url: data.url,
        method: data.method,
        intervalMinutes: data.intervalMinutes,
      },
    });

    await removeJobFromMonitorQueue({
      monitorId: data.id,
    });

    await scheduleJobToMonitorQueue(
      {
        monitorId: data.id,
      },
      data.intervalMinutes,
    );

    return createSuccessResponse(
      "Monitor updated successfully",
      updatedMonitor,
    );
  } catch {
    return createErrorResponse("Failed to update monitor");
  }
}

export async function changeMonitorStatus(
  monitorId: number,
  userId: number,
): Promise<AppResponseWrapper<Monitor>> {
  try {
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId,
      },
    });

    if (!monitor) {
      return createErrorResponse<Monitor>("Monitor not found");
    }

    const updatedMonitor = await prisma.monitor.update({
      where: {
        id: monitorId,
      },
      data: {
        isActive: !monitor.isActive,
      },
    });

    if (updatedMonitor.isActive) {
      await scheduleJobToMonitorQueue(
        {
          monitorId: updatedMonitor.id,
        },
        updatedMonitor.intervalMinutes,
      );
    } else {
      await removeJobFromMonitorQueue({
        monitorId: updatedMonitor.id,
      });
    }

    return createSuccessResponse(
      `Monitor ${
        updatedMonitor.isActive ? "enabled" : "disabled"
      } successfully`,
      updatedMonitor,
    );
  } catch {
    return createErrorResponse<Monitor>("Failed to update monitor status");
  }
}
