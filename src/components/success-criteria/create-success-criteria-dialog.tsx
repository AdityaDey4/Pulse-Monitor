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

import { SuccessCriteriaForm } from "./success-criteria-form";

interface Props {
  children: React.ReactNode;
}

export function CreateSuccessCriteriaDialog({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
<DialogContent
  className="sm:max-w-xl"  
  onInteractOutside={(e) => e.preventDefault()}
  onPointerDownOutside={(e) => e.preventDefault()}
  onFocusOutside={(e) => e.preventDefault()}
>
        <DialogHeader>
          <DialogTitle>Create Success Criteria</DialogTitle>

          <DialogDescription>
            Create a reusable success criteria.
          </DialogDescription>
        </DialogHeader>

        <SuccessCriteriaForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
