"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotificationSheet } from "./NotificationSheet";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
      </Button>

      <NotificationSheet
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}