"use server";

import { auth } from "@/lib/auth";
import { getCheckResults } from "@/services/check-result.service";
import type { CheckResultType } from "@/types/monitor.type";

type GetCheckResultsResponse =
  | { status: "error"; message: string }
  | { status: "success"; data: CheckResultType[]; nextCursor: number | null };

export async function getCheckResultsAction(
  monitorId: number,
  cursor?: number,
): Promise<GetCheckResultsResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", message: "Unauthorized" };
  }

  const result = await getCheckResults(monitorId, cursor);

  return {
    status: "success",
    data: result.checkResults,
    nextCursor: result.nextCursor,
  };
}