"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Bell, LayoutDashboard, LogOut, Settings, User } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layouts/thems/theme-toggle";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { LogoutForm } from "@/components/auth/logout-form";
import { CurrentUser } from "@/types/user.type";

interface AppHeaderProps {
  user?: CurrentUser;
}
function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "dashboard");

  const crumbs = segments.map((segment, index) => ({
    href: "/dashboard/" + segments.slice(0, index + 1).join("/"),
    label: formatSegment(segment),
  }));

  useNotifications();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-6" />

        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              {crumbs.length === 0 ? (
                <BreadcrumbPage className="flex items-center gap-2 font-display text-base font-medium text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                  </span>
                  Dashboard
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                    </span>
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {crumbs.map((crumb, index) => (
              <Fragment key={crumb.href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === crumbs.length - 1 ? (
                    <BreadcrumbPage className="font-display text-base font-medium text-foreground">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={crumb.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />

        <Separator orientation="vertical" className="h-6" />
        <NotificationBell />

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0 transition-shadow hover:ring-2 hover:ring-ring/40 hover:ring-offset-2 hover:ring-offset-background"
            >
              <Avatar className="h-9 w-9 border border-border/60">
                <AvatarImage
                  src={user?.image ?? ""}
                  alt={user?.name ?? "User"}
                />

                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() ??
                    user?.email?.charAt(0).toUpperCase() ??
                    "U"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <div>
                <LogOut className="mr-2 h-4 w-4" />
                <LogoutForm />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
