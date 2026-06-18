import type { MonitorType } from "@/types/monitor.type";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MonitorActions } from "./monitor-actions";

interface Props {
  monitors: MonitorType[];
}

export function MonitorTable({ monitors }: Props) {
  if (!monitors.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border bg-card">
        <p className="text-sm text-muted-foreground">No monitors found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Monitor Name</TableHead>

            <TableHead>URL</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Active</TableHead>

            <TableHead>Interval</TableHead>

            <TableHead>Last Checked</TableHead>

            <TableHead className="w-20 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {monitors.map((monitor) => (
            <TableRow key={monitor.id}>
              <TableCell className="font-medium">{monitor.name}</TableCell>

              <TableCell className="max-w-75 truncate">
                {monitor.url}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    monitor.status === "UP"
                      ? "default"
                      : monitor.status === "DOWN"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {monitor.status}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge variant={monitor.isActive ? "default" : "secondary"}>
                  {monitor.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>{monitor.intervalMinutes} min</TableCell>

              <TableCell>
                {monitor.lastCheckedAt
                  ? new Date(monitor.lastCheckedAt).toLocaleString()
                  : "Never"}
              </TableCell>

              <TableCell className="text-right">
                <MonitorActions
                  monitor={monitor}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
