"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAvatarAction } from "@/actions/upload.action";

export default function AvatarUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() { inputRef.current?.click(); }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadAvatarAction(formData);
      if (result.status === "error") { toast.error(result.message); return; }
      toast.success(result.message);
      window.location.reload();
    });
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
      <Button type="button" disabled={isPending} onClick={handleClick}
        className="border border-indigo-400 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/40 dark:border-indigo-700">
        <Upload className="w-3.5 h-3.5 mr-1.5" />
        {isPending ? "Uploading..." : "Upload photo"}
      </Button>
    </>
  );
}