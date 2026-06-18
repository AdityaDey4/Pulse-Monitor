import type { CheckResultType } from "@/types/monitor.type";

export interface HeatmapDay {
  date: string;
  successRate: number;
  failureRate: number;
  successfulChecks: number;
  failedChecks: number;
  totalChecks: number;
}

export function generateHeatmapData(
  checkResults: CheckResultType[],
  year: number,
): HeatmapDay[] {
  const result: HeatmapDay[] = [];

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const currentDate = new Date(date);

    currentDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(currentDate);

    nextDate.setDate(nextDate.getDate() + 1);

    const checksForDay = checkResults.filter((check) => {
      const checkedAt = new Date(check.checkedAt);

      return checkedAt >= currentDate && checkedAt < nextDate;
    });

    const formattedDate = currentDate
      .toISOString()
      .split("T")[0]
      .replaceAll("-", "/");

    if (checksForDay.length === 0) {
      result.push({
        date: formattedDate,
        successRate: -1,
        failureRate: -1,
        successfulChecks: 0,
        failedChecks: 0,
        totalChecks: 0,
      });

      continue;
    }

    const successfulChecks = checksForDay.filter(
      (check) => check.success,
    ).length;

    const failedChecks =
      checksForDay.length - successfulChecks;

    const successRate = Math.round(
      (successfulChecks / checksForDay.length) * 100,
    );

    result.push({
      date: formattedDate,
      successRate,
      failureRate: 100 - successRate,
      successfulChecks,
      failedChecks,
      totalChecks: checksForDay.length,
    });
  }

  return result;
}