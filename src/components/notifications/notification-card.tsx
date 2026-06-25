"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
  Clock,
  ArrowRight,
} from "lucide-react";

import { NotificationItem } from "@/types/realtime.type";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  notification: NotificationItem;
  onRead: (notificationId: number) => void;
  onRedirect: () => void;
}

const TYPE_CONFIG = {
  SUCCESS: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-500/5",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    label: "Success",
  },
  ALERT: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/5",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "Alert",
  },
  ERROR: {
    icon: XCircle,
    iconClass: "text-red-500",
    borderClass: "border-red-500/30",
    bgClass: "bg-red-500/5",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400",
    label: "Error",
  },
  REMINDER: {
    icon: Clock,
    iconClass: "text-blue-500",
    borderClass: "border-blue-500/30",
    bgClass: "bg-blue-500/5",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Reminder",
  },
  INFO: {
    icon: Bell,
    iconClass: "text-violet-500",
    borderClass: "border-violet-500/30",
    bgClass: "bg-violet-500/5",
    dotClass: "bg-violet-500",
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    label: "Info",
  },
} as const;

export function NotificationCard({
  notification,
  onRead,
  onRedirect,
}: NotificationCardProps) {
  const router = useRouter();

  const config =
    TYPE_CONFIG[notification.type as keyof typeof TYPE_CONFIG] ??
    TYPE_CONFIG.INFO;

  const Icon = config.icon;

  async function handleRedirect() {
    if (!notification.isRead) {
      await onRead(notification.id);
    }
    if (notification.redirectPath) {
      onRedirect();
      router.push(notification.redirectPath);
    }
  }

  return (
    <div
      className={`
        rounded-xl border p-4 transition-all
        ${
          !notification.isRead
            ? `${config.bgClass} ${config.borderClass}`
            : "border-border bg-transparent"
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
            ${!notification.isRead ? config.bgClass : "bg-muted"}
            border ${!notification.isRead ? config.borderClass : "border-border"}
          `}
        >
          <Icon className={`h-4 w-4 ${config.iconClass}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`
                inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium
                ${config.badgeClass}
              `}
            >
              {config.label}
            </span>
            {!notification.isRead && (
              <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
            )}
          </div>

          <p className="text-sm leading-snug">{notification.message}</p>

          <p className="mt-1.5 text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {notification.redirectPath && (
        <div className="mt-3 pl-11">
          <button
            onClick={handleRedirect}
            className={`
        inline-flex items-center gap-1 text-xs font-medium transition-colors
        ${config.iconClass} hover:opacity-70
      `}
          >
            View details
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
