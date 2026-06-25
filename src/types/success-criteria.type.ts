import { CRITERIA_TYPES, OPERATORS } from "@/validations/success-criteria.validation";

export interface SuccessCriteriaType {
  id: number;

  name: string;

  type: CRITERIA_TYPES;

  jsonPath: string | null;

  operator: OPERATORS;

  expectedValue: string;

  createdAt: Date;
  updatedAt: Date;
};