import { BellOff } from "lucide-react";

export function EmptyNotificationState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
        <BellOff className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">No notifications yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        You&apos;re all caught up. We&apos;ll notify you when something happens.
      </p>
    </div>
  );
}