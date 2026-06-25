import z from "zod";

export enum CRITERIA_TYPES {
  STATUS_CODE = "STATUS_CODE",
  RESPONSE_TIME = "RESPONSE_TIME",
  RESPONSE_BODY = "RESPONSE_BODY",
}

export enum OPERATORS {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
  CONTAINS = "CONTAINS",
};

export const CreateSuccessCriteriaSchema =
  z.object({
    name: z.string().min(1),

    type: z.nativeEnum(
      CRITERIA_TYPES
    ),

    jsonPath: z
      .string()
      .optional(),

    operator: z.nativeEnum(
      OPERATORS
    ),

    expectedValue:
      z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (
      data.operator === OPERATORS.CONTAINS &&
      !data.jsonPath?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jsonPath"],
        message:
          "JSON Path is required when operator is CONTAINS",
      });
    }

    // expectedValue must be numeric for non-CONTAINS operators
    if (
      data.operator !== OPERATORS.CONTAINS &&
      Number.isNaN(Number(data.expectedValue))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expectedValue"],
        message: "Expected value must be a number",
      });
    }
  });

export type CreateSuccessCriteriaInput =
  z.infer<
    typeof CreateSuccessCriteriaSchema
  >;


export const UpdateSuccessCriteriaSchema =
  z.object({
    id: z.number(),

    name: z.string().min(1),

    type: z.nativeEnum(
      CRITERIA_TYPES
    ),

    jsonPath: z
      .string()
      .optional(),

    operator: z.nativeEnum(
      OPERATORS
    ),

    expectedValue:
      z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (
      data.operator === OPERATORS.CONTAINS &&
      !data.jsonPath?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jsonPath"],
        message:
          "JSON Path is required when operator is CONTAINS",
      });
    }

    // expectedValue must be numeric for non-CONTAINS operators
    if (
      data.operator !== OPERATORS.CONTAINS &&
      Number.isNaN(Number(data.expectedValue))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expectedValue"],
        message: "Expected value must be a number",
      });
    }
  });

export type UpdateSuccessCriteriaInput =
  z.infer<
    typeof UpdateSuccessCriteriaSchema
  >;