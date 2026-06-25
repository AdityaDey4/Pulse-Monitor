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

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Pencil } from "lucide-react";

import { SuccessCriteriaForm } from "./success-criteria-form";
import { SuccessCriteriaType } from "@/types/success-criteria.type";

interface Props {
  criteria: SuccessCriteriaType;
}

export function UpdateSuccessCriteriaDialog({ criteria }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setOpen(true)}
        >
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
          <DialogTitle>Update Success Criteria</DialogTitle>

          <DialogDescription>
            Update the criteria configuration, operator and expected value.
          </DialogDescription>
        </DialogHeader>

        <SuccessCriteriaForm
          criteriaId={criteria.id}
          defaultValues={{
            name: criteria.name,
            type: criteria.type,
            operator: criteria.operator,
            expectedValue: criteria.expectedValue,
            jsonPath: criteria.jsonPath ?? "",
          }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
