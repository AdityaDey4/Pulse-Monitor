"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateMonitorInput,
  CreateMonitorSchema,
} from "@/validations/monitor.validation";

import {
  createMonitorAction,
  updateMonitorAction,
} from "@/actions/monitor.action";

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
import { toast } from "sonner";
import { SuccessCriteriaType } from "@/types/success-criteria.type";
import { SuccessCriteriaCombobox } from "./_partials/success-criteris-combobox";

interface Props {
  successCriteriaList: SuccessCriteriaType[]
  defaultValues?: Partial<CreateMonitorInput>;
  monitorId?: number;
  onSuccess?: () => void;
}

export function MonitorForm({ successCriteriaList, defaultValues, monitorId, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<CreateMonitorInput>({
    resolver: zodResolver(CreateMonitorSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      url: defaultValues?.url ?? "",
      method: defaultValues?.method ?? "GET",
      intervalMinutes: defaultValues?.intervalMinutes ?? 5,
      successCriteriaIds: defaultValues?.successCriteriaIds ?? [],
    },
  });

  const onSubmit = async (values: CreateMonitorInput) => {

    const result = monitorId
      ? await updateMonitorAction({
          id: monitorId,
          ...values,
        })
      : await createMonitorAction(values);

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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Monitor Name <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input placeholder="Backend Health API" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                URL <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="https://api.example.com/health"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="successCriteriaIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Success Criteria
                <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <SuccessCriteriaCombobox
                  successCriteriaList={successCriteriaList}
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intervalMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Check Interval (Minutes) <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-red-500">
            {form.formState.errors.root?.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? monitorId
              ? "Updating..."
              : "Creating..."
            : monitorId
              ? "Update Monitor"
              : "Create Monitor"}
        </Button>
      </form>
    </Form>
  );
}
