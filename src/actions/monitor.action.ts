"use server";

import { auth } from "@/lib/auth";

import { createMonitor, getUserMonitors, deleteMonitor, updateMonitor } from "@/services/monitor.service";

import {
  CreateMonitorInput,
  UpdateMonitorInput,
  CreateMonitorSchema,
  UpdateMonitorSchema,
} from "@/validations/monitor.validation";

import { AppResponseWrapper, createErrorResponse } from "@/types/common.type";
import { Monitor } from "../../generated/prisma/client";

export async function createMonitorAction(
  data: CreateMonitorInput,
) : Promise<AppResponseWrapper<Monitor>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  const parsed = CreateMonitorSchema.safeParse(data);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ??
        "Validation failed",
    );
  }

  return createMonitor(
    Number(session.user.id),
    parsed.data,
  );
}

export async function getUserMonitorsAction() : Promise<AppResponseWrapper<Monitor[]>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  return getUserMonitors(
    Number(session.user.id),
  );
}

export async function deleteMonitorAction(
  monitorId: number,
) : Promise<AppResponseWrapper<null>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  return deleteMonitor(
    monitorId,
    Number(session.user.id),
  );
}

export async function updateMonitorAction(
  data: UpdateMonitorInput,
) : Promise<AppResponseWrapper<Monitor>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  const parsed = UpdateMonitorSchema.safeParse(data);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ??
        "Validation failed",
    );
  }

  return updateMonitor(
    Number(session.user.id),
    parsed.data,
  );
}