"use server";

import { auth } from "@/lib/auth";
import { CheckResultsPagination, getCheckResults } from "@/services/check-result.service";
import { AppResponseWrapper, createErrorResponse } from "@/types/common.type";

export async function getCheckResultsAction(
  monitorId: number,
  cursor?: number,
): Promise<AppResponseWrapper<CheckResultsPagination>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse("Unauthorized");
  }

  return getCheckResults(
    monitorId,
    Number(session.user.id),
    cursor,
  );
}