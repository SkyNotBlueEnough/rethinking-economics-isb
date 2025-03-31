"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Book,
  Calendar,
  FileText,
  Home,
  Mail,
  UserRound,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useState, useEffect } from "react";

interface AdminNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNavItems: AdminNavItem[] = [
  {
    title: "Overview",
    href: "/admin/about/overview",
    icon: Home,
  },
  {
    title: "Team",
    href: "/admin/about/team",
    icon: Users,
  },
  {
    title: "Partners",
    href: "/admin/about/partners",
    icon: Users,
  },
  {
    title: "Publications",
    href: "/admin/publications",
    icon: Book,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Initiatives",
    href: "/admin/events/initiatives",
    icon: Calendar,
  },
  {
    title: "Policy & Advocacy",
    href: "/admin/policy",
    icon: FileText,
  },
  {
    title: "Memberships",
    href: "/admin/memberships",
    icon: UserRound,
  },
  {
    title: "Contact Submissions",
    href: "/admin/contact",
    icon: Mail,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

// Add this array of fixed widths after adminNavItems
const skeletonWidths = [
  "55%",
  "70%",
  "85%",
  "60%",
  "75%",
  "65%",
  "80%",
  "50%",
  "90%",
  "72%",
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Sidebar
      className="border-r border-border"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="px-4 py-2">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <div className="text-sm text-muted-foreground">
          Manage website content and users
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <SidebarMenu>
                {Array.from({ length: 10 }).map((_, index) => (
                  <SidebarMenuItem key={`skeleton-${index + 1}`}>
                    <div className="flex h-8 items-center gap-2 rounded-md px-2">
                      <Skeleton className="h-4 w-4 rounded-md" />
                      <Skeleton
                        className="h-4 flex-1"
                        style={{ maxWidth: skeletonWidths[index] }}
                      />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      data-active={pathname === item.href}
                      className="flex items-center gap-2 py-2"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-2">
        <div className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rethinking Economics
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
