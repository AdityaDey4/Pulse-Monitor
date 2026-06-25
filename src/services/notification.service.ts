import { prisma } from "@/lib/prisma";

import {
  NotificationItem,
  NotificationPaginationResponse,
} from "@/types/realtime.type";

export async function getNotifications(
  userId: number,
  cursor?: number,
  limit: number = 20,
): Promise<NotificationPaginationResponse> {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      id: "desc",
    },

    take: limit + 1,

    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
  });

  let nextCursor: number | null = null;

  if (notifications.length > limit) {
    const nextItem = notifications.pop();

    nextCursor = nextItem?.id ?? null;
  }

  const items: NotificationItem[] = notifications.map((notification) => ({
    id: notification.id,

    message: notification.message,

    type: notification.type,

    isRead: notification.isRead,

    readAt: notification.readAt,

    createdAt: notification.createdAt,

    redirectPath: notification.redirectPath,
  }));

  return {
    items,
    nextCursor,
    hasMore: !!nextCursor,
  };
}

export async function getUnreadCount(userId: number): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

export async function markNotificationRead(
  notificationId: number,
  userId: number,
) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
      isRead: false,
    },

    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function markAllNotificationsRead(userId: number) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },

    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}
