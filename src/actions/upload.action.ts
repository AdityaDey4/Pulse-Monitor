"use server";

import {
  createErrorResponse,
  createSuccessResponse,
  AppResponseWrapper,
} from "@/types/common.type";

import { uploadAvatarToCloudinary } from "@/services/upload.service";

import { updateAvatar } from "@/services/user.service";

export async function uploadAvatarAction(
  formData: FormData,
): Promise<AppResponseWrapper<string>> {
  const file = formData.get("file") as File;

  if (!file) {
    return createErrorResponse("Please select a file");
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return createErrorResponse("Only jpg, png and webp are allowed");
  }

  if (file.size > 5 * 1024 * 1024) {
    return createErrorResponse("Maximum file size is 5MB");
  }

  const imageUrl = await uploadAvatarToCloudinary(file);

  await updateAvatar(imageUrl);

  return createSuccessResponse("Avatar updated successfully", imageUrl);
}
