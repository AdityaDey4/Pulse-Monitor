import { prisma } from "@/lib/prisma";
import { Monitor } from "../../generated/prisma/client";

import {
  CreateMonitorInput,
  UpdateMonitorInput,
} from "@/validations/monitor.validation";

import {
  AppResponseWrapper,
  createErrorResponse,
  createSuccessResponse,
} from "@/types/common.type";
import { removeMonitor, scheduleMonitor } from "./queue.service";

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

      await scheduleMonitor(
        {
          monitorId: monitor.id,
        },
        monitor.intervalMinutes,
      );

      console.log(
        `Scheduled monitor ${monitor.id} with interval ${monitor.intervalMinutes} minutes`,
      );
      return createSuccessResponse(
        "Monitor created successfully",
        monitor,
      );
    } catch {
      return createErrorResponse(
        "Failed to create monitor",
      );
    }
  }

  export async function getUserMonitors(
    userId: number,
  ): Promise<
    AppResponseWrapper<Monitor[]>
  > {
    try {
      const monitors =
        await prisma.monitor.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return createSuccessResponse(
        "Monitors fetched successfully",
        monitors,
      );
    } catch {
      return createErrorResponse(
        "Failed to fetch monitors",
      );
    }
  }

  export async function deleteMonitor(
    monitorId: number,
    userId: number,
  ): Promise<
    AppResponseWrapper<null>
  > {
    try {
      const monitor =
        await prisma.monitor.findFirst({
          where: {
            id: monitorId,
            userId,
          },
        });

      if (!monitor) {
        return createErrorResponse(
          "Monitor not found",
        );
      }

      await prisma.monitor.delete({
        where: {
          id: monitorId,
        },
      });

      await removeMonitor({
        monitorId,
      });

      console.log(
        `Removed monitor ${monitorId} from queue`,
      );

      return createSuccessResponse(
        "Monitor deleted successfully",
        null,
      );
    } catch {
      return createErrorResponse(
        "Failed to delete monitor",
      );
    }
  }

  export async function updateMonitor(
    userId: number,
    data: UpdateMonitorInput,
  ): Promise<AppResponseWrapper<Monitor>> {
    try {
      const monitor =
        await prisma.monitor.findFirst({
          where: {
            id: data.id,
            userId,
          },
        });

      if (!monitor) {
        return createErrorResponse(
          "Monitor not found",
        );
      }

      const updatedMonitor =
        await prisma.monitor.update({
          where: {
            id: data.id,
          },
          data: {
            name: data.name,
            url: data.url,
            method: data.method,
            intervalMinutes:
              data.intervalMinutes,
          },
        });

        await removeMonitor({
          monitorId: data.id,
        });

        await scheduleMonitor(
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
      return createErrorResponse(
        "Failed to update monitor",
      );
    }
  }