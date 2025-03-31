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
  Globe,
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4 px-4 py-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="flex items-center gap-2 py-2 text-primary hover:text-primary/90"
          >
            <Link href="/">
              <Globe className="h-4 w-4" />
              <span>Return to Main Website</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Separator />
        <div className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rethinking Economics
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
