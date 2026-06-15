"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  CreateMonitorSchema,
  CreateMonitorInput,
} from "@/validations/monitor.validation";

import {
  createMonitorAction,
} from "@/actions/monitor.action";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function CreateMonitorForm() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CreateMonitorInput>({
    resolver:
      zodResolver(CreateMonitorSchema),
    defaultValues: {
      method: "GET",
      intervalMinutes: 5,
    },
  });

  const onSubmit = (
    values: CreateMonitorInput
  ) => {
    startTransition(async () => {
      const result =
        await createMonitorAction(
          values
        );
        console.log(reset);

      if (
        result.status === "success"
      ) {
        reset();
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="mb-8 rounded-lg border p-4"
    >
      <h2 className="mb-4 font-semibold">
        Create Monitor
      </h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Input
          placeholder="Name"
          {...register("name")}
        />

        <Input
          placeholder="URL"
          {...register("url")}
        />

        <Input
          placeholder="GET"
          {...register("method")}
        />

        <Input
          type="number"
          {...register(
            "intervalMinutes",
            {
              valueAsNumber: true,
            }
          )}
        />
      </div>

      <Button
        className="mt-4"
        disabled={isPending}
      >
        {isPending
          ? "Creating..."
          : "Create"}
      </Button>
    </form>
  );
}