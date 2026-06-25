"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import type { MonitorType } from "@/types/monitor.type";

import { getAllCriteriaAction } from "@/actions/success-criteria.action";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { MonitorForm } from "./monitor-form";
import { SuccessCriteriaType } from "@/types/success-criteria.type";

interface Props {
  monitor: MonitorType;
}

export function UpdateMonitorDialog({ monitor }: Props) {
  const [open, setOpen] = useState(false);

  const [successCriteriaList, setSuccessCriteriaList] = useState<
    SuccessCriteriaType[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen && successCriteriaList.length === 0) {
      try {
        setLoading(true);

        const result = await getAllCriteriaAction();

        if (result.data) {
          setSuccessCriteriaList(result.data);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update Monitor</DialogTitle>

          <DialogDescription>
            Update your monitor settings, including the name, endpoint URL, and
            check interval.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6 text-center">Loading success criteria...</div>
        ) : (
          <MonitorForm
            successCriteriaList={successCriteriaList}
            monitorId={monitor.id}
            defaultValues={{
              name: monitor.name,
              url: monitor.url,
              method: monitor.method,
              intervalMinutes: monitor.intervalMinutes,
              successCriteriaIds: monitor.successCriteriaIds,
            }}
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
