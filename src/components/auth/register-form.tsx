"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterInput, RegisterSchema } from "@/validations/auth.validation";

import { registerAction } from "@/actions/auth.action";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthCard } from "./auth-card";
import { AuthHeader } from "./auth-header";
import { OAuthButtons } from "./oauth-buttons";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();

  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    setAuthError("");
    const result = await registerAction(values);

    if (!result.success && result.message) {
      setAuthError(result.message);
      return;
    }

    /**
     * Auto Login
     */
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    router.push("/");
    router.refresh();
  };

  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthHeader title="Create Account" description="Create your account" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Name" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input placeholder="Email" {...register("email")} />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        {authError && <p className="text-sm text-red-500">{authError}</p>}

        <OAuthButtons />

        <p className="text-center text-sm">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </AuthCard>
  );
}
