"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePasswordInput, CreatePasswordSchema } from "@/validations/user.validation";
import { createPasswordAction } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = { provider: string };

export default function CreatePasswordForm({ provider }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePasswordInput>({
    resolver: zodResolver(CreatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: CreatePasswordInput) {
    startTransition(async () => {
      const result = await createPasswordAction(values);
      if (result.status === "error") { toast.error(result.message); return; }
      toast.success(result.message);
      form.reset();
    });
  }

  return (
    <div className="space-y-6">
      {/* OAuth notice */}
      <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1 capitalize">
          Signed in via {provider}
        </p>
        <p className="text-sm text-muted-foreground">
          No password set. Adding one lets you sign in with either Google or email + password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">Password</FormLabel>
              <FormControl>
                <Input type="password" className="focus-visible:ring-emerald-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">Confirm password</FormLabel>
              <FormControl>
                <Input type="password" className="focus-visible:ring-emerald-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <LockKeyhole className="w-3.5 h-3.5 mr-1.5" />
            {isPending ? "Creating..." : "Create password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}