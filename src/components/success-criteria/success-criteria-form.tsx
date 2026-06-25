"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateSuccessCriteriaInput,
  CreateSuccessCriteriaSchema,
  CRITERIA_TYPES,
  OPERATORS,
} from "@/validations/success-criteria.validation";

import {
  createCriteriaAction,
  updateCriteriaAction,
} from "@/actions/success-criteria.action";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  criteriaId?: number;
  defaultValues?: Partial<CreateSuccessCriteriaInput>;
  onSuccess?: () => void;
}

export const OPERATORS_BY_TYPE = {
  [CRITERIA_TYPES.STATUS_CODE]: [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.GREATER_THAN,
    OPERATORS.GREATER_THAN_EQUAL,
    OPERATORS.LESS_THAN,
    OPERATORS.LESS_THAN_EQUAL,
  ],
  [CRITERIA_TYPES.RESPONSE_TIME]: [
    OPERATORS.GREATER_THAN,
    OPERATORS.GREATER_THAN_EQUAL,
    OPERATORS.LESS_THAN,
    OPERATORS.LESS_THAN_EQUAL,
  ],
  [CRITERIA_TYPES.RESPONSE_BODY]: [
    OPERATORS.CONTAINS,
  ],
} as const;

type OperatorsForType<T extends CRITERIA_TYPES> = (typeof OPERATORS_BY_TYPE)[T][number];

function isValidOperatorForType(
  operator: OPERATORS,
  type: CRITERIA_TYPES,
): operator is OperatorsForType<typeof type> {
  return (OPERATORS_BY_TYPE[type] as readonly OPERATORS[]).includes(operator);
}

export function SuccessCriteriaForm({
  criteriaId,
  defaultValues,
  onSuccess,
}: Props) {
  const router = useRouter();

  const form = useForm<CreateSuccessCriteriaInput>({
    resolver: zodResolver(CreateSuccessCriteriaSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? CRITERIA_TYPES.STATUS_CODE,
      operator: defaultValues?.operator ?? OPERATORS.EQUALS,
      expectedValue: defaultValues?.expectedValue ?? "",
      jsonPath: defaultValues?.jsonPath ?? "",
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    const currentOperator = form.getValues("operator");
    if (!isValidOperatorForType(currentOperator, selectedType)) {
      form.setValue("operator", OPERATORS_BY_TYPE[selectedType][0]);
    }
  }, [selectedType]);

  const onSubmit = async (values: CreateSuccessCriteriaInput) => {
    const result = criteriaId
      ? await updateCriteriaAction({ id: criteriaId, ...values })
      : await createCriteriaAction(values);

    if (result.status === "error") {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    form.reset();
    router.refresh();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Success 200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Criteria Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria Type <span className="text-red-500">*</span></FormLabel>
              <Select
                defaultValue={field.value}
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CRITERIA_TYPES).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Operator */}
        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => {
            const validOperator = isValidOperatorForType(field.value, selectedType)
              ? field.value
              : OPERATORS_BY_TYPE[selectedType][0];

            return (
              <FormItem>
                <FormLabel>Operator <span className="text-red-500">*</span></FormLabel>
                <Select
                  defaultValue={validOperator}
                  value={validOperator}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(OPERATORS_BY_TYPE[selectedType] as readonly OPERATORS[]).map((operator) => (
                      <SelectItem key={operator} value={operator}>
                        {operator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* JSON Path - Response Body only */}
        {selectedType === CRITERIA_TYPES.RESPONSE_BODY && (
          <FormField
            control={form.control}
            name="jsonPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>JSON Path (res.) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="status" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Expected Value */}
        <FormField
          control={form.control}
          name="expectedValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Value <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    selectedType === CRITERIA_TYPES.STATUS_CODE
                      ? "200"
                      : selectedType === CRITERIA_TYPES.RESPONSE_TIME
                        ? "1000"
                        : "UP"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? criteriaId ? "Updating..." : "Creating..."
            : criteriaId ? "Update Criteria" : "Create Criteria"}
        </Button>
      </form>
    </Form>
  );
}