"use server";

import { AuthService } from "@/services/auth.service";
import { LoginSchema, RegisterInput, RegisterSchema } from "@/validations/auth.validation";

export async function registerAction(
  values: RegisterInput
) {
  const parsed =
    RegisterSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors:
        parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await AuthService.registerUser(
      parsed.data
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}


export async function loginAction(
  values: unknown
) {
  const parsed = LoginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Validation failed",
    };
  }

  return AuthService.validateCredentials(
    parsed.data.email,
    parsed.data.password
  );
}