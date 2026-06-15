import { auth } from "@/lib/auth";
import { getUserMonitors } from "@/services/monitor.service";

import { CreateMonitorForm } from "@/components/monitor/create-monitor-form";
import { MonitorList } from "@/components/monitor/monitor-list";

export default async function MonitorsPage() {
  const session = await auth();

  const result = await getUserMonitors(
    Number(session?.user.id)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Monitors
        </h1>

        <p className="text-muted-foreground">
          Manage all monitored endpoints
        </p>
      </div>

      <CreateMonitorForm />

      <MonitorList
        monitors={result.data ?? []}
      />
    </div>
  );
}