import { auth } from "@/lib/auth";

import { getUserMonitors } from "@/services/monitor.service";

import { Button } from "@/components/ui/button";

import { CreateMonitorDialog } from "@/components/monitor/create-monitor-dialog";
import { MonitorTable } from "@/components/monitor/monitor-table";

export default async function MonitorsPage() {
  const session = await auth();

  const result =
    await getUserMonitors(
      Number(session?.user.id)
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Monitors
          </h1>

          <p className="text-muted-foreground">
            Manage all monitored
            endpoints
          </p>
        </div>

        <CreateMonitorDialog>
          <Button>
            Create Monitor
          </Button>
        </CreateMonitorDialog>
      </div>

      <MonitorTable
        monitors={result.data ?? []}
      />
    </div>
  );
}