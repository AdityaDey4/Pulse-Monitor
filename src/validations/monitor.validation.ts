import { z } from "zod";

export const CreateMonitorSchema =
  z.object({
    name: z
      .string()
      .min(3, "Name is required")
      .max(100),

    url: z
      .string()
      .url("Invalid URL"),

    method: z.enum([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ]),

    intervalMinutes: z
      .number()
      .int()
      .min(1)
      .max(1440),
  });

export const UpdateMonitorSchema =
  CreateMonitorSchema.extend({
    id: z.number(),
  });


export type CreateMonitorInput =
  z.infer<typeof CreateMonitorSchema>;

export type UpdateMonitorInput =
  z.infer<typeof UpdateMonitorSchema>;