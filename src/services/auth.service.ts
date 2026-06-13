import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/validations/auth.validation";

export class AuthService {
  
  static async registerUser(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new Error("Account already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
    });

    return user;
  }

  static async validateCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email",
      };
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

      return {
        success: false,
        message: `This account was created using ${providers.join(
          ", "
        )}. Please sign in with one of these providers first.`,
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    return {
      success: true,
      user,
    };
  }
}