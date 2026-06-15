"use server";

import { registerUser, validateCredentials } from "@/services/auth.service";
import { AppResponseWrapper, createErrorResponse } from "@/types/common.type";
import { LoginInput, LoginSchema, RegisterInput, RegisterSchema } from "@/validations/auth.validation";
import { User } from "../../generated/prisma/client";

export async function registerAction(
  values: RegisterInput
) : Promise<AppResponseWrapper<User | null>> {
  const parsed =
    RegisterSchema.safeParse(values);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ??
        "Validation failed",
    );
  }

  return registerUser(
    parsed.data,
  );
}


export async function loginAction(
  values: LoginInput
): Promise<AppResponseWrapper<User>> {
  const parsed = LoginSchema.safeParse(values);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ??
        "Validation failed",
    );
  }

  return validateCredentials(
    parsed.data.email,
    parsed.data.password,
  );
}