"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";

import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/notification.action";

import {
  NotificationItem,
  NotificationSocketPayload,
} from "@/types/realtime.type";

import { getSocket } from "@/lib/socket-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { NotificationList } from "./notification-list";
import { NotificationSkeleton } from "./notification-skeleton";
import { EmptyNotificationState } from "./empty-notification-state";

interface NotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnreadChanged: () => Promise<void>;
}

export function NotificationSheet({
  open,
  onOpenChange,
  onUnreadChanged,
}: NotificationSheetProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);

  const [hasMore, setHasMore] = useState(true);

  async function loadNotifications() {
    try {
      setLoading(true);

      const result = await getNotificationsAction();

      setNotifications(result.items);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);

      console.log({
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
        count: result.items.length,
      });
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreNotifications() {
    console.log("LOAD MORE TRIGGERED");
    if (!cursor) return;

    if (!hasMore) return;

    if (loadingMore) return;

    try {
      setLoadingMore(true);

      const result = await getNotificationsAction(cursor);

      setNotifications((prev) => [...prev, ...result.items]);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more notifications", error);
    } finally {
      setLoadingMore(false);
    }
  }
  useEffect(() => {
    if (!open || initialized) return;
    const initialize = async () => {
      await loadNotifications();
      setInitialized(true);
    };
    void initialize();
  }, [open, initialized]);

  useEffect(() => {
    const socket = getSocket();
    const handleNotificationCreated = (payload: NotificationSocketPayload) => {
      const notification: NotificationItem = {
        id: Number(payload.notificationId),
        message: payload.message,
        type: payload.type,
        isRead: false,
        readAt: null,
        createdAt: new Date(),
        redirectPath: payload.redirectPath ?? null,
      };
      setNotifications((prev) => [notification, ...prev]);
    };
    socket.on("notification:created", handleNotificationCreated);
    return () => {
      socket.off("notification:created", handleNotificationCreated);
    };
  }, []);

  async function handleMarkRead(notificationId: number) {
    try {
      await markNotificationReadAction(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
      await onUnreadChanged();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsReadAction();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await onUnreadChanged();
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[480px] p-0 flex flex-col"
      >
        {/* Sheet header — styled band */}
        <SheetHeader className="px-5 py-4 border-b bg-violet-600 dark:bg-violet-700 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <BellRing className="w-4 h-4 text-white" />
              </div>
              <div>
                <SheetTitle className="text-white text-sm font-semibold leading-none">
                  Notifications
                </SheetTitle>
                <SheetDescription className="text-violet-100 text-xs leading-none mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </SheetDescription>
              </div>
            </div>

            {notifications.length > 0 && (
              <Button
                size="sm"
                onClick={handleMarkAllRead}
                className="h-7 text-xs bg-white/15 hover:bg-white/25 text-white border-0"
              >
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <EmptyNotificationState />
          ) : (
            <NotificationList
              notifications={notifications}
              onRead={handleMarkRead}
              onRedirect={() => onOpenChange(false)}
              hasMore={hasMore}
              loadingMore={loadingMore}
              onLoadMore={loadMoreNotifications}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
