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
import { SuccessCriteriaType } from "@/types/success-criteria.type";

interface Props {
  children: React.ReactNode;
  successCriteriaList: SuccessCriteriaType[]
}

export function CreateMonitorDialog({
  children,
  successCriteriaList,
}: Props) {
  const [open, setOpen] =
    useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}

    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

<DialogContent
  className="sm:max-w-xl" 
  onInteractOutside={(e) => e.preventDefault()}
  onPointerDownOutside={(e) => e.preventDefault()}
  onFocusOutside={(e) => e.preventDefault()}
>
        <DialogHeader>
          <DialogTitle>
            Create Monitor
          </DialogTitle>

          <DialogDescription>
            Add a new API or website to monitor.
          </DialogDescription>
        </DialogHeader>

        <MonitorForm
          successCriteriaList={successCriteriaList}
          onSuccess={() =>
            setOpen(false)
          }
        />
      </DialogContent>
    </Dialog>
  );
}