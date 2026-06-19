"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationSheet({
  open,
  onOpenChange,
}: NotificationSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[500px]"
      >
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>

          <SheetDescription>
            Monitor alerts and updates
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No notifications yet.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}