"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  Bell,
  HeartPulse,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const navigation = [
  {
    label: "Dashboard",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Monitoring",
    items: [
      { title: "Monitors", href: "/monitors", icon: Activity },
    ],
  },
  {
    label: "Success Criteria",
    items: [
      { title: "Custom Criteria's", href: "/success-criteria", icon: Activity },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isPathActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div
          className={cn(
            "flex flex-col items-center gap-3",
            collapsed ? "py-3" : "py-6"
          )}
        >
          {/* Logo with a resting-pulse ring — the literal "pulse" in Pulse Monitor */}
          <div className="relative flex h-12 w-12 items-center justify-center">
            <span className="absolute inset-0 rounded-2xl bg-sidebar-primary/30 animate-ping" />
            <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25">
              <HeartPulse
                className={cn("transition-all", collapsed ? "h-5 w-5" : "h-6 w-6")}
              />
            </div>
          </div>

          {!collapsed && (
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h2 className="font-display text-lg font-medium tracking-tight text-sidebar-foreground">
                Pulse Monitor
              </h2>
              <span className="rounded-full bg-sidebar-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-primary">
                Monitoring Platform
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {navigation.map((section, index) => (
          <SidebarGroup key={section.label} className={index === 0 ? undefined : "mt-2"}>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-sidebar-foreground/40">
                {section.label}
              </SidebarGroupLabel>
            )}

            <SidebarMenu className="gap-1">
              {section.items.map((item) => {
                const active = isPathActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild tooltip={item.title} className="h-10 rounded-xl">
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-2.5 text-[14px] font-medium transition-all duration-200",
                          active
                            ? "bg-sidebar-primary/10 text-sidebar-primary"
                            : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                            active
                              ? "bg-sidebar-primary/15 text-sidebar-primary"
                              : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                          )}
                        >
                          <item.icon className="h-[18px] w-[18px]" />
                        </span>

                        <span className="truncate">{item.title}</span>

                        {active && !collapsed && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-sidebar-accent/50 px-2.5 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-sidebar-foreground">
                All systems operational
              </span>
              <span className="font-mono text-[10px] text-sidebar-foreground/45">
                Last checked just now
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}