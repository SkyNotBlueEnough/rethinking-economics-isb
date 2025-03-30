"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { AdvocacyCampaign } from "~/lib/types/policy";
import { format } from "date-fns";

// Define policy brief type with category field that may not be in the database yet
interface PolicyBrief {
  id: number;
  title: string;
  summary?: string | null;
  category: "economic" | "social" | "environmental";
  publishedAt?: Date | null;
  thumbnailUrl?: string | null;
  slug: string;
}

export default function PolicyPage() {
  // Fetch data from API
  const { data: economicPolicies, isLoading: economicLoading } =
    api.policy.getPoliciesByCategory.useQuery("economic");

  const { data: socialPolicies, isLoading: socialLoading } =
    api.policy.getPoliciesByCategory.useQuery("social");

  const { data: environmentalPolicies, isLoading: environmentalLoading } =
    api.policy.getPoliciesByCategory.useQuery("environmental");

  const { data: activeCampaigns, isLoading: activeCampaignsLoading } =
    api.policy.getAdvocacyCampaignsByStatus.useQuery("active");

  const { data: completedCampaigns, isLoading: completedCampaignsLoading } =
    api.policy.getAdvocacyCampaignsByStatus.useQuery("completed");

  const { data: plannedCampaigns, isLoading: plannedCampaignsLoading } =
    api.policy.getAdvocacyCampaignsByStatus.useQuery("planned");

  // Calculate loading state
  const isLoading =
    economicLoading ||
    socialLoading ||
    environmentalLoading ||
    activeCampaignsLoading ||
    completedCampaignsLoading ||
    plannedCampaignsLoading;

  // Combined policy briefs data
  const policyBriefs: PolicyBrief[] = [
    ...(economicPolicies || []),
    ...(socialPolicies || []),
    ...(environmentalPolicies || []),
  ];

  // Format date
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return format(date, "MMMM d, yyyy");
  };

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
            <BreadcrumbPage>Policy and Advocacy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">
          Policy and Advocacy
        </div>
        <div className="mt-2 text-muted-foreground">
          Our research-based policy recommendations and advocacy campaigns aim
          to transform economic discourse and policy in Pakistan.
        </div>
      </div>

      {isLoading ? (
        <PolicySkeleton />
      ) : (
        <>
          {/* Policy Briefs Section */}
          <div className="mb-16">
            <div className="mb-6 text-2xl font-bold">Policy Briefs</div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All Briefs</TabsTrigger>
                <TabsTrigger value="economic">Economic Policy</TabsTrigger>
                <TabsTrigger value="social">Social Policy</TabsTrigger>
                <TabsTrigger value="environmental">
                  Environmental Policy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {policyBriefs.length === 0 ? (
                    <div className="col-span-3 py-10 text-center text-muted-foreground">
                      No policy briefs available yet
                    </div>
                  ) : (
                    policyBriefs.map((brief) => (
                      <PolicyBriefCard
                        key={brief.id}
                        brief={brief}
                        formatDate={formatDate}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="economic">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {!economicPolicies || economicPolicies.length === 0 ? (
                    <div className="col-span-3 py-10 text-center text-muted-foreground">
                      No economic policy briefs available yet
                    </div>
                  ) : (
                    economicPolicies.map((brief) => (
                      <PolicyBriefCard
                        key={brief.id}
                        brief={brief}
                        formatDate={formatDate}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {!socialPolicies || socialPolicies.length === 0 ? (
                    <div className="col-span-3 py-10 text-center text-muted-foreground">
                      No social policy briefs available yet
                    </div>
                  ) : (
                    socialPolicies.map((brief) => (
                      <PolicyBriefCard
                        key={brief.id}
                        brief={brief}
                        formatDate={formatDate}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="environmental">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {!environmentalPolicies ||
                  environmentalPolicies.length === 0 ? (
                    <div className="col-span-3 py-10 text-center text-muted-foreground">
                      No environmental policy briefs available yet
                    </div>
                  ) : (
                    environmentalPolicies.map((brief) => (
                      <PolicyBriefCard
                        key={brief.id}
                        brief={brief}
                        formatDate={formatDate}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Advocacy Campaigns Section */}
          <div>
            <div className="mb-6 text-2xl font-bold">Advocacy Campaigns</div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6 w-full justify-start md:w-[400px]">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {!activeCampaigns || activeCampaigns.length === 0 ? (
                    <div className="col-span-2 py-10 text-center text-muted-foreground">
                      No active campaigns available yet
                    </div>
                  ) : (
                    activeCampaigns.map((campaign) => (
                      <AdvocacyCampaignCard
                        key={campaign.id}
                        campaign={campaign}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {!completedCampaigns || completedCampaigns.length === 0 ? (
                    <div className="col-span-2 py-10 text-center text-muted-foreground">
                      No completed campaigns available yet
                    </div>
                  ) : (
                    completedCampaigns.map((campaign) => (
                      <AdvocacyCampaignCard
                        key={campaign.id}
                        campaign={campaign}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="planned">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {!plannedCampaigns || plannedCampaigns.length === 0 ? (
                    <div className="col-span-2 py-10 text-center text-muted-foreground">
                      No planned campaigns available yet
                    </div>
                  ) : (
                    plannedCampaigns.map((campaign) => (
                      <AdvocacyCampaignCard
                        key={campaign.id}
                        campaign={campaign}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}

interface PolicyBriefCardProps {
  brief: PolicyBrief;
  formatDate: (date: Date | null | undefined) => string;
}

function PolicyBriefCard({ brief, formatDate }: PolicyBriefCardProps) {
  return (
    <Card>
      <div className="aspect-[3/2] w-full overflow-hidden">
        <Image
          src={
            brief.thumbnailUrl ||
            "https://images.unsplash.com/photo-1607944024060-0450380ddd33?q=80&w=600&auto=format&fit=crop"
          }
          alt={brief.title}
          width={600}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1607944024060-0450380ddd33?q=80&w=600&auto=format&fit=crop";
          }}
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-2 flex items-center space-x-2">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {brief.category.charAt(0).toUpperCase() + brief.category.slice(1)}
          </div>
          {brief.publishedAt && (
            <div className="text-xs text-muted-foreground">
              {formatDate(brief.publishedAt)}
            </div>
          )}
        </div>
        <div className="mb-3 text-lg font-semibold">{brief.title}</div>
        {brief.summary && (
          <div className="mb-4 line-clamp-3 text-sm text-muted-foreground">
            {brief.summary}
          </div>
        )}
        <Button variant="outline" className="w-full" asChild>
          <a href={`/policy/${brief.slug}`}>Read Brief</a>
        </Button>
      </CardContent>
    </Card>
  );
}

function AdvocacyCampaignCard({ campaign }: { campaign: AdvocacyCampaign }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={
            campaign.imageUrl ||
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
          }
          alt={campaign.title}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <div className="text-lg font-semibold text-white">
            {campaign.title}
          </div>
          <div className="text-sm text-white/80">
            Status:{" "}
            <span className="font-medium capitalize">{campaign.status}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">
          {campaign.description}
        </div>

        {campaign.achievements && campaign.achievements.length > 0 && (
          <div className="mt-4">
            <div className="font-medium">Key Achievements:</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {campaign.achievements.map((achievement, index) => (
                <li
                  key={`${campaign.id}-achievement-${index}`}
                  className="flex items-start"
                >
                  <span className="mr-2 text-primary">•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PolicySkeleton() {
  return (
    <div className="space-y-16">
      {/* Policy Briefs Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-6">
          <div className="flex gap-4 overflow-x-auto">
            <Skeleton className="h-10 w-24 flex-shrink-0" />
            <Skeleton className="h-10 w-32 flex-shrink-0" />
            <Skeleton className="h-10 w-28 flex-shrink-0" />
            <Skeleton className="h-10 w-40 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/2] w-full rounded-lg" />
                <div className="space-y-2 px-6">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                  <div className="space-y-1 py-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advocacy Campaigns Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
