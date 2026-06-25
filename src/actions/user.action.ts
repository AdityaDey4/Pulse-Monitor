"use server";

import {
  getCurrentUser,
  updateProfile,
  changePassword,
  createPassword,
  updateAvatar,
} from "@/services/user.service";

import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  CreatePasswordSchema,
  UpdateProfileInput,
  ChangePasswordInput,
  CreatePasswordInput,
} from "@/validations/user.validation";

import { AppResponseWrapper, createErrorResponse } from "@/types/common.type";

import { CurrentUser } from "@/types/user.type";

export async function getCurrentUserAction(): Promise<
  AppResponseWrapper<CurrentUser>
> {
  return getCurrentUser();
}

export async function updateProfileAction(
  values: UpdateProfileInput,
): Promise<AppResponseWrapper<null>> {
  const parsed = UpdateProfileSchema.safeParse(values);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ?? "Validation failed",
    );
  }

  return updateProfile(parsed.data.name);
}

export async function changePasswordAction(
  values: ChangePasswordInput,
): Promise<AppResponseWrapper<null>> {
  const parsed = ChangePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ?? "Validation failed",
    );
  }

  return changePassword(parsed.data.currentPassword, parsed.data.newPassword);
}

export async function createPasswordAction(
  values: CreatePasswordInput,
): Promise<AppResponseWrapper<null>> {
  const parsed = CreatePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ?? "Validation failed",
    );
  }

  return createPassword(parsed.data.password);
}

export async function updateAvatarAction(
  imageUrl: string,
): Promise<AppResponseWrapper<string>> {
  if (!imageUrl) {
    return createErrorResponse("Image URL is required");
  }

  return updateAvatar(imageUrl);
}
