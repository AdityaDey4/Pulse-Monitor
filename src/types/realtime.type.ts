import { NotificationType } from "../../generated/prisma/client";

export interface NotificationPayload {
  userId: string;
  notificationId: string;
  type: NotificationType;
  message: string;
}

export interface MonitorUpdatedPayload {
  monitorId: string;
}