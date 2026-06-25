"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import type { MonitorType } from "@/types/monitor.type";

import { MonitorTable } from "./monitor-table";
import { RefreshCw } from "lucide-react";

interface Props {
  monitors: MonitorType[];
}

export function MonitorList({
  monitors,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    return () =>
      clearInterval(interval);
  }, [router]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <MonitorTable
        monitors={monitors}
      />
    </div>
  );
}