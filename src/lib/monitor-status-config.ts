import { CheckResult, MonitorStatus } from "../../generated/prisma/client";

const FAILURE_THRESHOLD = 3;
const RECOVERY_THRESHOLD = 3;

export function determineMonitorStatus(
  currentStatus: MonitorStatus,
  results: CheckResult[],
): MonitorStatus {

  if (results.length === 0) {
    return MonitorStatus.UNKNOWN;
  }

  let consecutiveFailures = 0;
  let consecutiveSuccesses = 0;

  for (const result of results) {
    if (!result.success) {
      consecutiveFailures++;
    } else {
      break;
    }
  }

  for (const result of results) {
    if (result.success) {
      consecutiveSuccesses++;
    } else {
      break;
    }
  }

  switch (currentStatus) {
    case MonitorStatus.UNKNOWN:
      if (
        consecutiveSuccesses >=
        RECOVERY_THRESHOLD
      ) {
        return MonitorStatus.UP;
      }

      if (
        consecutiveFailures >=
        FAILURE_THRESHOLD
      ) {
        return MonitorStatus.DOWN;
      }

      return MonitorStatus.UNKNOWN;

    case MonitorStatus.UP:
      if (
        consecutiveFailures >=
        FAILURE_THRESHOLD
      ) {
        return MonitorStatus.DOWN;
      }

      return MonitorStatus.UP;

    case MonitorStatus.DOWN:
      if (
        consecutiveSuccesses >=
        RECOVERY_THRESHOLD
      ) {
        return MonitorStatus.UP;
      }

      return MonitorStatus.DOWN;

    default:
      return currentStatus;
  }
}