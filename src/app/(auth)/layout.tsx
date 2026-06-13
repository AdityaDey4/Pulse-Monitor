import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({
  children,
}: PublicLayoutProps) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}