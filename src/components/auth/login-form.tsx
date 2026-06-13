"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";
import { OAuthButtons } from "./oauth-buttons";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginInput, LoginSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/actions/auth.action";

export function LoginForm() {
  const router = useRouter();

  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setAuthError("");

    const validationResult = await loginAction(values);

    if (!validationResult.success && validationResult.message) {
      setAuthError(validationResult.message);
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setAuthError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthHeader
          title="Welcome Back"
          description="Sign in to your account"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input type="email" placeholder="Email" {...register("email")} />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {authError && <p className="text-sm text-red-500">{authError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <OAuthButtons />

        <p className="text-center text-sm">
          Don't have an account? {" "}
          <Link href="/register" className="font-medium underline">
            Register
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
