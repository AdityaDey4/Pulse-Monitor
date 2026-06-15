"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function OAuthButtons() {
  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          signIn("github", {
            callbackUrl: "/",
          })
        }
      >
        Continue with GitHub
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          signIn("google", {
            callbackUrl: "/",
          })
        }
      >
        Continue with Google
      </Button>
    </div>
  );
}