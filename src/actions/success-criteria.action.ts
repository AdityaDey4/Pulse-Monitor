"use server";

import { auth } from "@/lib/auth";

import {
  createCriteria,
  updateCriteria,
  deleteCriteria,
  getAllCriteria,
  getCriteriaById,
} from "@/services/success-criteria.service";

import {
  CreateSuccessCriteriaInput,
  UpdateSuccessCriteriaInput,
  CreateSuccessCriteriaSchema,
  UpdateSuccessCriteriaSchema,
} from "@/validations/success-criteria.validation";

import {
  AppResponseWrapper,
  createErrorResponse,
} from "@/types/common.type";

import { SuccessCriteria } from "../../generated/prisma/client";
import { SuccessCriteriaType } from "@/types/success-criteria.type";

export async function createCriteriaAction(
  data: CreateSuccessCriteriaInput,
): Promise<
  AppResponseWrapper<SuccessCriteria>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  const parsed =
    CreateSuccessCriteriaSchema.safeParse(
      data,
    );

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ??
        "Validation failed",
    );
  }

  return createCriteria(
    Number(session.user.id),
    parsed.data,
  );
}

export async function updateCriteriaAction(
  data: UpdateSuccessCriteriaInput,
): Promise<
  AppResponseWrapper<SuccessCriteria>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  const parsed =
    UpdateSuccessCriteriaSchema.safeParse(
      data,
    );

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ??
        "Validation failed",
    );
  }

  return updateCriteria(
    Number(session.user.id),
    parsed.data,
  );
}

export async function deleteCriteriaAction(
  criteriaId: number,
): Promise<AppResponseWrapper> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  return deleteCriteria(
    Number(session.user.id),
    criteriaId,
  );
}

export async function getAllCriteriaAction(): Promise<
  AppResponseWrapper<
    SuccessCriteriaType[]
  >
> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  return getAllCriteria(
    Number(session.user.id),
  );
}

export async function getCriteriaByIdAction(
  criteriaId: number,
): Promise<
  AppResponseWrapper<SuccessCriteria>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse(
      "Unauthorized",
    );
  }

  return getCriteriaById(
    Number(session.user.id),
    criteriaId,
  );
}