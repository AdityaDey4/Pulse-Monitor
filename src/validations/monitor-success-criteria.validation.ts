import z from "zod";

export const AssignCriteriaSchema =
  z.object({
    monitorId: z.number(),

    successCriteriaIds: z.array(
      z.number(),
    ),
  });

export type AssignCriteriaInput =
  z.infer<
    typeof AssignCriteriaSchema
  >;