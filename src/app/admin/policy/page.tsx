"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import { Plus } from "lucide-react";
import { api } from "~/trpc/react";
import PolicyBriefsTab from "./policy-briefs-tab";
import AdvocacyCampaignsTab from "./advocacy-campaigns-tab";

export default function AdminPolicyPage() {
  const router = useRouter();

  // Fetch all policy data
  const { isLoading: policiesLoading } = api.policy.getAllPolicies.useQuery();
  const { isLoading: campaignsLoading } =
    api.policy.getAllAdvocacyCampaigns.useQuery();

  // Calculate loading state
  const isLoading = policiesLoading || campaignsLoading;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Policy & Advocacy</div>
          <div className="text-muted-foreground">
            Manage policy briefs and advocacy campaigns
          </div>
        </div>
      </div>

      {isLoading ? (
        <ContentSkeleton />
      ) : (
        <Tabs defaultValue="policy-briefs" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="policy-briefs">Policy Briefs</TabsTrigger>
            <TabsTrigger value="advocacy-campaigns">
              Advocacy Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policy-briefs">
            <PolicyBriefsTab />
          </TabsContent>

          <TabsContent value="advocacy-campaigns">
            <AdvocacyCampaignsTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex w-full space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-44" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex space-x-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`skeleton-row-${i + 1}`}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex space-x-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
