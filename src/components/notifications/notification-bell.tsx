"use client";

import { useEffect, useState } from "react";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { NotificationSheet } from "./notification-sheet";

import { getUnreadCountAction } from "@/actions/notification.action";

import { getSocket } from "@/lib/socket-client";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  async function loadUnreadCount() {
    try {
      const count =
        await getUnreadCountAction();

      setUnreadCount(count);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const socket = getSocket();

    socket.on(
      "notification:created",
      () => {
        setUnreadCount(
          (prev) => prev + 1
        );
      }
    );

    return () => {
      socket.off(
        "notification:created"
      );
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <Badge
            className="
              absolute
              -right-1
              -top-1
              h-5
              min-w-5
              rounded-full
              px-1
            "
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationSheet
        open={open}
        onOpenChange={setOpen}
        onUnreadChanged={
          loadUnreadCount
        }
      />
    </>
  );
}