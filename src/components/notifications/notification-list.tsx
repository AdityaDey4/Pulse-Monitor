import { useEffect, useRef } from "react";
import { NotificationItem } from "@/types/realtime.type";
import { NotificationCard } from "./notification-card";

interface NotificationListProps {
  notifications: NotificationItem[];

  onRead: (notificationId: number) => void;

  onRedirect: () => void;

  hasMore: boolean;

  loadingMore: boolean;

  onLoadMore: () => void;
}

export function NotificationList({
  notifications,
  onRead,
  onRedirect,
  hasMore,
  loadingMore,
  onLoadMore,
}: NotificationListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
      },
    );

    const current = bottomRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [hasMore, onLoadMore]);
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRead={onRead}
          onRedirect={onRedirect}
        />
      ))}

      {loadingMore && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Loading more...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
