import type { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Link from "next/link";

export default function AboutLayout({ children }: { children: ReactNode }) {
  const aboutTabs = [
    { title: "Overview", href: "/about/overview" },
    { title: "Team", href: "/about/team" },
    { title: "Partnerships", href: "/about/partnerships" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/about">About Us</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">About Us</div>
        <div className="mt-2 text-muted-foreground">
          Learn about our mission, team, and partnerships
        </div>
      </div>

      {/* About Section Tabs */}
      <div className="mb-8 overflow-x-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            {aboutTabs.map((tab) => (
              <Link href={tab.href} key={tab.href}>
                <TabsTrigger
                  value={tab.href.split("/").pop() || ""}
                  className="min-w-max"
                >
                  {tab.title}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  );
}
