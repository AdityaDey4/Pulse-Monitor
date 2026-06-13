import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}