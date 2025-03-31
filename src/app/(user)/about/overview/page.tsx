"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { useEffect, useState } from "react";
import { LucideCheck } from "lucide-react";
import { api } from "~/trpc/react";
import type {
  AboutOverviewWithCards,
  HistoryMilestones,
} from "~/lib/types/about";

export default function OverviewPage() {
  const { data: missionData, isLoading: missionLoading } =
    api.about.getOverviewSection.useQuery("mission");
  const { data: visionData, isLoading: visionLoading } =
    api.about.getOverviewSection.useQuery("vision");
  const { data: valuesData, isLoading: valuesLoading } =
    api.about.getOverviewSection.useQuery("values");
  const { data: historyMilestones, isLoading: historyLoading } =
    api.about.getHistoryMilestones.useQuery();

  const isLoading =
    missionLoading || visionLoading || valuesLoading || historyLoading;

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div>
      {/* Mission, Vision, Values Tabs */}
      <Tabs defaultValue="mission" className="mb-12 w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
        </TabsList>

        <TabsContent value="mission" className="space-y-4">
          {missionLoading ? (
            <SectionSkeleton cardCount={2} />
          ) : (
            <>
              <div className="text-xl font-semibold">
                {missionData?.title || "Our Mission"}
              </div>
              <div className="text-muted-foreground">
                {missionData?.content || "No mission content available."}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                {missionData?.cards && missionData.cards.length > 0 ? (
                  missionData.cards.map((card) => (
                    <Card key={card.id}>
                      <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent>{card.content}</CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-muted-foreground">
                    No mission cards available.
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="vision" className="space-y-4">
          {visionLoading ? (
            <SectionSkeleton cardCount={3} />
          ) : (
            <>
              <div className="text-xl font-semibold">
                {visionData?.title || "Our Vision"}
              </div>
              <div className="text-muted-foreground">
                {visionData?.content || "No vision content available."}
              </div>
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Long-term Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {visionData?.cards && visionData.cards.length > 0 ? (
                      visionData.cards.map((card) => (
                        <div key={card.id} className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <span className="sr-only">Checkmark</span>
                            <LucideCheck />
                          </div>
                          <div>
                            <div className="font-medium">{card.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {card.content}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No vision goals available.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="values" className="space-y-4">
          {valuesLoading ? (
            <SectionSkeleton cardCount={4} />
          ) : (
            <>
              <div className="text-xl font-semibold">
                {valuesData?.title || "Our Values"}
              </div>
              <div className="text-muted-foreground">
                {valuesData?.content || "No values content available."}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {valuesData?.cards && valuesData.cards.length > 0 ? (
                  valuesData.cards.map((card) => (
                    <Card key={card.id}>
                      <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent>{card.content}</CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-muted-foreground">
                    No values cards available.
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* History Section */}
      <div className="mb-12">
        <div className="mb-6 text-2xl font-bold">Our History</div>
        {historyLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {historyMilestones && historyMilestones.length > 0 ? (
                  historyMilestones.map((milestone) => (
                    <div key={milestone.id}>
                      <div className="text-lg font-medium">
                        {milestone.year}: {milestone.title}
                      </div>
                      <div className="mt-2 text-muted-foreground">
                        {milestone.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No history milestones available.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SectionSkeleton({ cardCount = 2 }: { cardCount?: number }) {
  // Create an array of unique IDs for the skeleton cards
  const skeletonIds = ["sk1", "sk2", "sk3", "sk4"].slice(0, cardCount);

  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {skeletonIds.map((id) => (
          <Skeleton key={id} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-12">
      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>

      {/* History Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
