import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { AuthService } from "@/services/auth.service";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [

    GitHub,
    Google,

    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const parsed = CredentialsSchema.safeParse(credentials);

          if (!parsed.success) {
            return null;
          }

          const result = await AuthService.validateCredentials(
            parsed.data.email,
            parsed.data.password,
          );

          if (!result.success || !result.user) {
            return null;
          }

          return {
            id: String(result.user.id),
            email: result.user.email,
            name: result.user.name,
          };
        } catch (error) {
          console.error("Credentials Auth Error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      /**
       * OAuth Login Handling
       */
      if (account?.provider === "github" || account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        /**
         * CASE 1:
         * User already exists
         * (credentials signup happened first)
         */
        if (existingUser) {
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                userId: existingUser.id,
              },
            });
          }

          return true;
        }

        /**
         * CASE 2:
         * First login through GitHub or Google
         */
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });

        await prisma.account.create({
          data: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            userId: newUser.id,
          },
        });

        return true;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (dbUser) {
          token.id = dbUser.id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.image;
        }
      }

      return token;

    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
