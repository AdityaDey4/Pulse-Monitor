"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  deleteMonitorAction,
} from "@/actions/monitor.action";

import { Button } from "@/components/ui/button";
interface Props {
  monitorId: number;
}

export function DeleteMonitorButton({
  monitorId,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteMonitorAction(
        monitorId
      );

      router.refresh();
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}