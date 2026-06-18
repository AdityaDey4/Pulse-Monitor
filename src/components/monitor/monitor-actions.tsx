"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, Trash2, Ellipsis } from "lucide-react";

import { toast } from "sonner";

import {
  changeMonitorStatusAction,
  deleteMonitorAction,
} from "@/actions/monitor.action";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
import type { MonitorType } from "@/types/monitor.type";
import { UpdateMonitorDialog } from "./update-monitor-dialog";
interface Props {
  monitor: MonitorType;
}

export function MonitorActions({ monitor }: Props) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id: monitorId, isActive } = monitor;
  const handleMonitorStatusToggle = async () => {
    if (isActive) {
      setDeactivateDialogOpen(true);
      return;
    }

    const result = await changeMonitorStatusAction({
      monitorId,
    });

    if (result.status === "error") {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    router.refresh();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteMonitorAction(monitorId);

      if (result.status === "error") {
        toast.error(result.message);

        return;
      }

      toast.success(result.message);

      router.refresh();

      setDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete monitor");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDeactivate = async () => {
    const result = await changeMonitorStatusAction({
      monitorId,
    });

    if (result.status === "error") {
      toast.error(result.message);

      return;
    }

    toast.success(result.message);

    setDeactivateDialogOpen(false);

    router.refresh();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <UpdateMonitorDialog monitor={monitor} />

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/monitor/${monitorId}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center justify-between"
            onSelect={(e) => e.preventDefault()}
          >
            <span>{isActive ? "Active" : "Inactive"}</span>

            <Switch
              checked={isActive}
              onCheckedChange={handleMonitorStatusToggle}
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Monitor</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              monitor and remove its scheduler.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Monitor</AlertDialogTitle>

            <AlertDialogDescription>
              This will stop all scheduled checks for this monitor. You can
              reactivate it later at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
