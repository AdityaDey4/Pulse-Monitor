"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Ellipsis,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { deleteCriteriaAction } from "@/actions/success-criteria.action";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { UpdateSuccessCriteriaDialog } from "./update-success-criteria-dialog";
import { SuccessCriteriaType } from "@/types/success-criteria.type";

interface Props {
  criteria: SuccessCriteriaType;
}

export function SuccessCriteriaActions({
  criteria,
}: Props) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleDelete =
    async () => {
      try {
        setIsDeleting(true);

        const result =
          await deleteCriteriaAction(
            criteria.id,
          );

        if (
          result.status === "error"
        ) {
          toast.error(
            result.message,
          );

          return;
        }

        toast.success(
          result.message,
        );

        router.refresh();

        setDeleteDialogOpen(
          false,
        );
      } catch {
        toast.error(
          "Failed to delete criteria",
        );
      } finally {
        setIsDeleting(false);
      }
    };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56"
        >
          <UpdateSuccessCriteriaDialog
            criteria={criteria}
          />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() =>
              setDeleteDialogOpen(
                true,
              )
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />

            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={
          deleteDialogOpen
        }
        onOpenChange={
          setDeleteDialogOpen
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Success
              Criteria
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot
              be undone.

              <br />
              <br />

              A criteria can
              only be deleted
              when it is not
              assigned to any
              monitor.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={
                handleDelete
              }
              disabled={
                isDeleting
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}