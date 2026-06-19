import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { getMonitorDetailsAction } from "@/actions/monitor.action";

import { Button } from "@/components/ui/button";

import { MonitorOverviewCard } from "@/components/monitor/_partials/monitor-overview-card";
import { MonitorStatsCard } from "@/components/monitor/_partials/monitor-stats-card";
import { ResponseTimeChart } from "@/components/monitor/_partials/response-time-chart";
import { RecentChecksTimeline } from "@/components/monitor/_partials/recent-checks-timeline";

import { calculateMonitorMetrics } from "@/lib/monitor-metrics";
import { SuccessFailureChart } from "@/components/monitor/_partials/monitor-analytics-section";
import { ResponseMetricsCard } from "@/components/monitor/_partials/response-metrics-card";
import { AvailabilityHeatmap } from "@/components/monitor/_partials/availability-heatmap";
import { CheckResultsSheet } from "@/components/monitor/_partials/check-results-sheet";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MonitorDetailsPage({ params }: Props) {
  const { id } = await params;

  const result = await getMonitorDetailsAction(Number(id));

  if (result.status === "error" || !result.data) {
    return <div>{result.message}</div>;
  }

  const { monitor, checkResults } = result.data;

  const metrics = calculateMonitorMetrics(checkResults);
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/monitors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Monitors
          </Link>
        </Button>
      </div>

      <MonitorOverviewCard monitor={monitor} />

      <div className="grid gap-4 md:grid-cols-4">
        <MonitorStatsCard title="Status" value={monitor.status} />

        <MonitorStatsCard
          title="Average Response"
          value={`${metrics.averageResponseTime}ms`}
        />

        <MonitorStatsCard
          title="Successful Checks"
          value={String(metrics.successfulChecks)}
        />

        <MonitorStatsCard
          title="Total Checks"
          value={String(checkResults.length)}
        />
      </div>
      {/* In monitor-details page — add items-stretch to this grid */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-4">
          <ResponseTimeChart checkResults={checkResults} />
        </div>

        <div className="lg:col-span-1">
          <RecentChecksTimeline
            monitorId={monitor.id}
            checkResults={checkResults}
          />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ResponseMetricsCard
          fastestResponse={metrics.fastestResponse}
          averageResponse={metrics.averageResponseTime}
          slowestResponse={metrics.slowestResponse}
          latestResponse={metrics.latestResponse}
        />
        <SuccessFailureChart
          successfulChecks={metrics.successfulChecks}
          failedChecks={metrics.failedChecks}
        />
      </div>

      <AvailabilityHeatmap
        monitorName={monitor.name}
        checkResults={checkResults}
      />
      {/* <CheckHistoryTable
        checkResults={
          checkResults
        }
      /> */}
    </div>
  );
}
