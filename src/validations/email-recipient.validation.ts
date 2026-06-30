import z from "zod";

export const CreateEmailRecipientSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email address"),

  consecutiveThreshold: z.number().int().min(1, "Threshold must be at least 1"),
});

export type CreateEmailRecipientInput = z.infer<
  typeof CreateEmailRecipientSchema
>;

export const UpdateEmailRecipientSchema = z.object({
  id: z.number(),

  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email address"),

  consecutiveThreshold: z.number().int().min(1, "Threshold must be at least 1"),
});

export type UpdateEmailRecipientInput = z.infer<
  typeof UpdateEmailRecipientSchema
>;

export const AssignEmailRecipientSchema = z.object({
  monitorId: z.number(),

  recipientIds: z.array(z.number()),
});

export type AssignEmailRecipientInput = z.infer<
  typeof AssignEmailRecipientSchema
>;
