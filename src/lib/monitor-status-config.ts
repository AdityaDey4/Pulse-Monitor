import {
  MonitorStatus,
  SuccessCriteria,
  CriteriaType,
  Operator,
} from "../../generated/prisma/client";

export interface EvaluationInput {
  responseStatusCode: number;
  responseTime: number;
  responseBody: unknown;
}

export function determineMonitorStatus(
  result: EvaluationInput,
  criteria: SuccessCriteria[],
): MonitorStatus {
  if (criteria.length === 0) {
    return MonitorStatus.UP;
  }

  const allPassed = criteria.every((criterion) =>
    evaluateCriteria(
      criterion,
      result,
    ),
  );

  return allPassed
    ? MonitorStatus.UP
    : MonitorStatus.DOWN;
}


function evaluateCriteria(
  criterion: SuccessCriteria,
  result: EvaluationInput,
): boolean {
  switch (criterion.type) {
    case CriteriaType.STATUS_CODE:
      return compare(
        result.responseStatusCode,
        Number(
          criterion.expectedValue,
        ),
        criterion.operator,
      );

    case CriteriaType.RESPONSE_TIME:
      return compare(
        result.responseTime,
        Number(
          criterion.expectedValue,
        ),
        criterion.operator,
      );

    case CriteriaType.RESPONSE_BODY: {
      const value =
        getJsonPathValue(
          result.responseBody,
          criterion.jsonPath ?? "",
        );

      return String(value)
        .toLowerCase()
        .includes(
          criterion.expectedValue.toLowerCase(),
        );
    }

    default:
      return false;
  }
}


function compare(
  actual: number,
  expected: number,
  operator: Operator,
): boolean {
  switch (operator) {
    case Operator.EQUALS:
      return actual === expected;

    case Operator.NOT_EQUALS:
      return actual !== expected;

    case Operator.GREATER_THAN:
      return actual > expected;

    case Operator.GREATER_THAN_EQUAL:
      return actual >= expected;

    case Operator.LESS_THAN:
      return actual < expected;

    case Operator.LESS_THAN_EQUAL:
      return actual <= expected;

    default:
      return false;
  }
}

function getJsonPathValue(
  obj: unknown,
  path: string,
): unknown {
  if (!path) {
    return obj;
  }

  return path
    .split(".")
    .reduce<any>(
      (current, key) =>
        current?.[key],
      obj,
    );
}