import type { CheckResultType } from "@/types/monitor.type";



export function calculateMonitorMetrics(checkResults: CheckResultType[]) {
  const totalChecks = checkResults.length;
  const latestCheck = checkResults[0];
  const successfulChecks = checkResults.filter(
    (result) => result.success,
  ).length;

  const uptimePercentage =
    totalChecks === 0 ? 0 : (successfulChecks / totalChecks) * 100;

  const responseTimes = checkResults
    .map((result) => result.responseTime)
    .filter((value): value is number => value !== null);

  const averageResponseTime = responseTimes.length
    ? Math.round(
        responseTimes.reduce((sum, value) => sum + value, 0) /
          responseTimes.length,
      )
    : 0;

  const failedChecks = checkResults.filter((result) => !result.success).length;

  const fastestResponse = responseTimes.length ? Math.min(...responseTimes) : 0;

  const slowestResponse = responseTimes.length ? Math.max(...responseTimes) : 0;

  const averageResponse = responseTimes.length
    ? Math.round(
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      )
    : 0;

  const latestResponse = latestCheck?.responseTime ?? 0;

  return {
    totalChecks,
    uptimePercentage,
    averageResponseTime,
    successfulChecks,
    failedChecks,
    fastestResponse,
    slowestResponse,
    averageResponse,
    latestResponse,
  };
}
