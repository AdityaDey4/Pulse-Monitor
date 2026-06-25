import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
});

export type UpdateProfileInput =
  z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(
    (data) =>
      data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    },
  );

export type ChangePasswordInput =
  z.infer<typeof ChangePasswordSchema>;

export const CreatePasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    },
  );

export type CreatePasswordInput =
  z.infer<typeof CreatePasswordSchema>;