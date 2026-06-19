import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layouts/_partials/AppSidebar";
import { AppHeader } from "@/components/layouts/_partials/AppHeader";
import { SocketProvider } from "@/providers/socket-provider";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SocketProvider
        userId={session.user.id}
      />

      <SidebarInset className="flex h-screen flex-col">
        <AppHeader />

        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}