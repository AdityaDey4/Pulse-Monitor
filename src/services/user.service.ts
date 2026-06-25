import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  AppResponseWrapper,
  createErrorResponse,
  createSuccessResponse,
} from "@/types/common.type";

import { CurrentUser } from "@/types/user.type";

export async function getCurrentUser(): Promise<
  AppResponseWrapper<CurrentUser>
> {
  const session = await auth();

  if (!session?.user?.email) {
    return createErrorResponse("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    return createErrorResponse("User not found");
  }

  const provider = user.accounts[0]?.provider ?? "credentials";

  return createSuccessResponse("User fetched successfully", {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    provider: provider as "google" | "github" | "credentials",
    hasPassword: !!user.password,
    createdAt: user.createdAt,
  });
}

export async function updateProfile(
  name: string,
): Promise<AppResponseWrapper<null>> {
  const session = await auth();

  if (!session?.user?.email) {
    return createErrorResponse("Unauthorized");
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name,
    },
  });

  return createSuccessResponse("Profile updated successfully", null);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<AppResponseWrapper<null>> {
  const session = await auth();

  if (!session?.user?.email) {
    return createErrorResponse("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return createErrorResponse("User not found");
  }

  if (!user.password) {
    return createErrorResponse("No password exists for this account");
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isValidPassword) {
    return createErrorResponse("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return createSuccessResponse("Password updated successfully", null);
}

export async function createPassword(
  password: string,
): Promise<AppResponseWrapper<null>> {
  const session = await auth();

  if (!session?.user?.email) {
    return createErrorResponse("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return createErrorResponse("User not found");
  }

  if (user.password) {
    return createErrorResponse("Password already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return createSuccessResponse("Password created successfully", null);
}

export async function updateAvatar(
  image: string,
): Promise<AppResponseWrapper<string>> {
  const session = await auth();

  if (!session?.user?.email) {
    return createErrorResponse("Unauthorized");
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      image,
    },
  });

  return createSuccessResponse("Avatar updated successfully", image);
}
