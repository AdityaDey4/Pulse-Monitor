"use client";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CheckCircle2, XCircle } from "lucide-react";

import type { CheckResultType } from "@/types/monitor.type";

interface Props {
  checkResults: CheckResultType[];
}

export function CheckResultsTable({ checkResults }: Props) {
  return (
    <div className="mx-auto overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="w-32.5">Status</TableHead>

            <TableHead className="w-22.5">Code</TableHead>

            <TableHead className="w-30">Response</TableHead>

            <TableHead className="w-45">Checked At</TableHead>

            <TableHead>Error Message</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {checkResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell>
                {result.success ? (
                  <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Success
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </TableCell>

              <TableCell>{result.statusCode ?? "-"}</TableCell>

              <TableCell>
                {result.responseTime != null ? `${result.responseTime}ms` : "-"}
              </TableCell>

              <TableCell className="text-xs">
                {new Date(result.checkedAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>

              <TableCell>
                <div
                  className="max-w-55 truncate text-muted-foreground"
                  title={result.errorMessage ?? ""}
                >
                  {result.errorMessage ?? "-"}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
