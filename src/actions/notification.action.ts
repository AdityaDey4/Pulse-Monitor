"use server";

import { auth } from "@/lib/auth";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notification.service";

export async function getNotificationsAction(cursor?: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getNotifications(Number(session.user.id), cursor);
}

export async function getUnreadCountAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getUnreadCount(Number(session.user.id));
}

export async function markNotificationReadAction(notificationId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return markNotificationRead(notificationId, Number(session.user.id));
}

export async function markAllNotificationsReadAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return markAllNotificationsRead(Number(session.user.id));
}
