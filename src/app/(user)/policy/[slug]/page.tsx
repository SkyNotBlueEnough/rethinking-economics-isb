"use client";

import { api } from "~/trpc/react";
import { notFound } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function PolicyBriefPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch policy data using the slug
  const {
    data: policy,
    isLoading,
    error,
  } = api.policy.getPolicyBySlug.useQuery(slug);

  // Format date
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return format(date, "MMMM d, yyyy");
  };

  // Check for loading state
  if (isLoading) {
    return <PolicyBriefSkeleton />;
  }

  // If policy not found
  if (!policy) {
    return notFound();
  }

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
            <BreadcrumbLink href="/policy">Policy and Advocacy</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{policy.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-2"
        asChild
      >
        <a href="/policy">
          <ArrowLeft className="h-4 w-4" />
          <div>Back to Policy Briefs</div>
        </a>
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col gap-2">
            <div className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {policy.category.charAt(0).toUpperCase() +
                policy.category.slice(1)}
            </div>
            {policy.publishedAt && (
              <div className="text-sm text-muted-foreground">
                {formatDate(policy.publishedAt)}
              </div>
            )}
          </div>

          <div className="mb-4 text-3xl font-bold">{policy.title}</div>

          {policy.summary && (
            <div className="mb-6 text-lg text-muted-foreground">
              {policy.summary}
            </div>
          )}

          {/* Feature Image - only shown on mobile */}
          {policy.thumbnailUrl && (
            <div className="mb-6 lg:hidden">
              <Image
                src={policy.thumbnailUrl}
                alt={policy.title}
                width={800}
                height={400}
                className="rounded-lg object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1607944024060-0450380ddd33?q=80&w=600&auto=format&fit=crop";
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="text-foreground">{policy.content}</div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Feature Image - hidden on mobile */}
          {policy.thumbnailUrl && (
            <div className="hidden lg:block">
              <Image
                src={policy.thumbnailUrl}
                alt={policy.title}
                width={600}
                height={400}
                className="rounded-lg object-cover"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1607944024060-0450380ddd33?q=80&w=600&auto=format&fit=crop";
                }}
              />
            </div>
          )}

          {/* Related Policies Section can be added here if needed */}
        </div>
      </div>
    </div>
  );
}

function PolicyBriefSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-4" />
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-6 w-4" />
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Back Button Skeleton */}
      <Skeleton className="mb-6 h-9 w-40" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area Skeleton */}
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-3/4" />

          {/* Mobile Image Skeleton */}
          <Skeleton className="aspect-[2/1] w-full rounded-lg lg:hidden" />

          {/* Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Desktop Image Skeleton */}
          <Skeleton className="hidden aspect-[3/2] w-full rounded-lg lg:block" />
        </div>
      </div>
    </div>
  );
}
