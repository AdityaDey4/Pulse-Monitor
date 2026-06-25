import { prisma } from "@/lib/prisma";

import {
  createErrorResponse,
  createSuccessResponse,
  AppResponseWrapper,
} from "@/types/common.type";

import {
  CreateSuccessCriteriaInput,
  UpdateSuccessCriteriaInput,
} from "@/validations/success-criteria.validation";

import { SuccessCriteria } from "../../generated/prisma/client";
import { SuccessCriteriaType } from "@/types/success-criteria.type";


export async function createCriteria(
  userId: number,
  data: CreateSuccessCriteriaInput,
): Promise<
  AppResponseWrapper<SuccessCriteria>
> {
  try {
    const criteria =
      await prisma.successCriteria.create({
        data: {
          userId,

          name: data.name,

          type: data.type,

          jsonPath:
            data.type ===
              "RESPONSE_BODY"
              ? data.jsonPath
              : undefined,

          operator:
            data.operator,

          expectedValue:
            data.expectedValue,
        },
      });

    return createSuccessResponse(
      "Success criteria created successfully",
      criteria,
    );
  } catch {
    return createErrorResponse(
      "Failed to create success criteria",
    );
  }
}


export async function updateCriteria(
  userId: number,
  data: UpdateSuccessCriteriaInput,
): Promise<
  AppResponseWrapper<SuccessCriteria>
> {
  try {
    const existing =
      await prisma.successCriteria.findFirst({
        where: {
          id: data.id,
          userId,
        },
      });

    if (!existing) {
      return createErrorResponse(
        "Success criteria not found",
      );
    }

    const criteria =
      await prisma.successCriteria.update({
        where: {
          id: data.id,
        },

        data: {
          name: data.name,

          type: data.type,

          jsonPath:
            data.type ===
              "RESPONSE_BODY"
              ? data.jsonPath
              : undefined,

          operator:
            data.operator,

          expectedValue:
            data.expectedValue,
        },
      });

    return createSuccessResponse(
      "Success criteria updated successfully",
      criteria,
    );
  } catch {
    return createErrorResponse(
      "Failed to update success criteria",
    );
  }
}


export async function deleteCriteria(
  userId: number,
  criteriaId: number,
): Promise<AppResponseWrapper> {
  try {
    const criteria =
      await prisma.successCriteria.findFirst({
        where: {
          id: criteriaId,
          userId,
        },
      });

    if (!criteria) {
      return createErrorResponse(
        "Success criteria not found",
      );
    }

    const usageCount =
      await prisma.monitorSuccessCriteria.count({
        where: {
          successCriteriaId:
            criteriaId,
        },
      });

    if (usageCount > 0) {
      return createErrorResponse(
        "Cannot delete criteria because it is assigned to one or more monitors",
      );
    }

    await prisma.successCriteria.delete({
      where: {
        id: criteriaId,
      },
    });

    return createSuccessResponse(
      "Success criteria deleted successfully",
      null,
    );
  } catch {
    return createErrorResponse(
      "Failed to delete success criteria",
    );
  }
}


export async function getAllCriteria(
  userId: number,
): Promise<
  AppResponseWrapper<SuccessCriteriaType[]>
> {
  try {
    const criteria =
      await prisma.successCriteria.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return createSuccessResponse(
      "Success criteria fetched successfully",
      criteria as SuccessCriteriaType[],
    );
  } catch {
    return createErrorResponse(
      "Failed to fetch success criteria",
    );
  }
}


export async function getCriteriaById(
  userId: number,
  criteriaId: number,
): Promise<
  AppResponseWrapper<SuccessCriteria>
> {
  try {
    const criteria =
      await prisma.successCriteria.findFirst({
        where: {
          id: criteriaId,
          userId,
        },
      });

    if (!criteria) {
      return createErrorResponse(
        "Success criteria not found",
      );
    }

    return createSuccessResponse(
      "Success criteria fetched successfully",
      criteria,
    );
  } catch {
    return createErrorResponse(
      "Failed to fetch success criteria",
    );
  }
}