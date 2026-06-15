import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/validations/auth.validation";
import { AppResponseWrapper, createErrorResponse, createSuccessResponse } from "@/types/common.type";
import { User } from "../../generated/prisma/client";

  
  export async function registerUser(input: RegisterInput): Promise<AppResponseWrapper<User>> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      return createErrorResponse("Account already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    return createSuccessResponse(
      "User registered successfully",
      user
    );
  }

  export async function validateCredentials(email: string, password: string): Promise<AppResponseWrapper<User>> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return createErrorResponse("Email is not registered yet, please register first");
    }

    if (!user.password) {
      const accounts = await prisma.account.findMany({
        where: {
          userId: user.id,
        },
        select: {
          provider: true,
        },
      });

      const providers = [...new Set(accounts.map((a) => a.provider))];

      return createErrorResponse(
        `This account was created using ${providers.join(
          ", "
        )}. Please sign in with one of these providers first.`
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return createErrorResponse("Invalid password");
    }

    return createSuccessResponse("Login successful", user);
  }