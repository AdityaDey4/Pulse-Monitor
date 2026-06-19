"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MonitorForm } from "./monitor-form";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import type { MonitorType } from "@/types/monitor.type";
import { Pencil } from "lucide-react";

interface Props {
  monitor: MonitorType;
}

export function UpdateMonitorDialog({ monitor }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Monitor</DialogTitle>
          <DialogDescription>
            Update your monitor settings, including the name, endpoint URL, and
            check interval.
          </DialogDescription>
        </DialogHeader>

        <MonitorForm
          monitorId={monitor.id}
          defaultValues={{
            name: monitor.name,
            url: monitor.url,
            method: monitor.method,
            intervalMinutes: monitor.intervalMinutes,
          }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
