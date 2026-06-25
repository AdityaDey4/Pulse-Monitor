"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordInput, ChangePasswordSchema } from "@/validations/user.validation";
import { changePasswordAction } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: ChangePasswordInput) {
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (result.status === "error") { toast.error(result.message); return; }
      toast.success(result.message);
      form.reset();
    });
  }

  return (
    <div className="space-y-6">
      {/* Tip notice */}
      <div className="rounded-xl p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
        <p className="text-sm text-muted-foreground">
          Use a strong password you don&apos;t use elsewhere. At least 8 characters recommended.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="currentPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">Current password</FormLabel>
              <FormControl>
                <Input type="password" className="focus-visible:ring-amber-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="newPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">New password</FormLabel>
              <FormControl>
                <Input type="password" className="focus-visible:ring-amber-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">Confirm password</FormLabel>
              <FormControl>
                <Input type="password" className="focus-visible:ring-amber-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" disabled={isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}