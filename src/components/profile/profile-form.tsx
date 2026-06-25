"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrentUser } from "@/types/user.type";
import { UpdateProfileInput, UpdateProfileSchema } from "@/validations/user.validation";
import { updateProfileAction } from "@/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AvatarUpload from "./avatar-upload";

type Props = { user: CurrentUser };

export default function ProfileForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { name: user.name ?? "" },
  });

  function onSubmit(values: UpdateProfileInput) {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      if (result.status === "error") { toast.error(result.message); return; }
      toast.success(result.message);
    });
  }

  return (
    <div className="space-y-5">
      {/* Avatar row — no background, just a border */}
      <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback className="bg-indigo-600 text-white font-semibold">
            {user.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
        </div>
        <AvatarUpload />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input value={user.email} disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Provider</FormLabel>
              <Input value={user.provider} disabled className="capitalize" />
            </div>
            <div className="space-y-2">
              <FormLabel>Joined</FormLabel>
              <Input value={new Date(user.createdAt).toLocaleDateString()} disabled />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}