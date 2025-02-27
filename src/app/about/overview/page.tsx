"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { useEffect, useState } from "react";
import { LucideCheck } from "lucide-react";

export default function OverviewPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <OverviewSkeleton />
      ) : (
        <>
          {/* Mission, Vision, Values Tabs */}
          <Tabs defaultValue="mission" className="mb-12 w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="vision">Vision</TabsTrigger>
              <TabsTrigger value="values">Values</TabsTrigger>
            </TabsList>
            <TabsContent value="mission" className="space-y-4">
              <div className="text-xl font-semibold">Our Mission</div>
              <div className="text-muted-foreground">
                Rethinking Economics is dedicated to transforming economic
                discourse in Pakistan by promoting pluralistic,
                interdisciplinary approaches to economic theory and policy. We
                aim to bridge the gap between academic economics and real-world
                challenges, fostering critical thinking and innovative solutions
                to Pakistan&apos;s economic issues.
              </div>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Education Reform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We advocate for diverse economic curricula that incorporate
                    heterodox perspectives, historical context, and
                    interdisciplinary approaches, preparing students to address
                    complex economic challenges.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Policy Influence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We engage with policymakers, providing evidence-based
                    research and alternative economic frameworks to inform
                    decisions that promote sustainable and equitable economic
                    development.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="vision" className="space-y-4">
              <div className="text-xl font-semibold">Our Vision</div>
              <div className="text-muted-foreground">
                We envision an economic discourse in Pakistan that embraces
                diverse perspectives, prioritizes human well-being and
                environmental sustainability, and addresses the unique
                challenges of our society. Our goal is to cultivate a generation
                of economists and citizens equipped to create a more just,
                sustainable, and prosperous economy.
              </div>
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Long-term Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <span className="sr-only">Checkmark</span>
                        <LucideCheck />
                      </div>
                      <div>
                        <div className="font-medium">
                          Transformed Economics Education
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Economics curricula across Pakistani universities that
                          incorporate diverse theoretical perspectives,
                          historical context, and interdisciplinary approaches.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <span className="sr-only">Checkmark</span>
                        <LucideCheck />
                      </div>
                      <div>
                        <div className="font-medium">
                          Inclusive Policy Discourse
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Economic policy debates that consider a wide range of
                          perspectives and prioritize social and environmental
                          outcomes alongside traditional economic metrics.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <span className="sr-only">Checkmark</span>
                        <LucideCheck />
                      </div>
                      <div>
                        <div className="font-medium">Engaged Citizenry</div>
                        <div className="text-sm text-muted-foreground">
                          A public that is economically literate and actively
                          engaged in economic discourse, capable of critically
                          evaluating economic policies and their impacts.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="values" className="space-y-4">
              <div className="text-xl font-semibold">Our Values</div>
              <div className="text-muted-foreground">
                Our work is guided by a commitment to pluralism, critical
                thinking, inclusivity, and real-world relevance. We believe that
                economics should serve society and the environment, not the
                other way around.
              </div>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pluralism</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We embrace diverse economic theories and methodologies,
                    recognizing that no single approach can address all economic
                    questions.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Critical Thinking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We encourage questioning assumptions, examining evidence,
                    and considering alternative perspectives in economic
                    analysis.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Inclusivity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We promote economic discourse that represents diverse voices
                    and addresses the needs of all members of society.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Real-world Relevance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    We focus on economics that addresses actual challenges
                    facing Pakistan and contributes to practical solutions.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* History Section */}
          <div className="mb-12">
            <div className="mb-6 text-2xl font-bold">Our History</div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="text-lg font-medium">2020: Foundation</div>
                    <div className="mt-2 text-muted-foreground">
                      Rethinking Economics Pakistan was established by a group
                      of economics students and faculty members concerned about
                      the narrow focus of economics education and policy
                      discourse in Pakistan.
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      2021: Growth and Expansion
                    </div>
                    <div className="mt-2 text-muted-foreground">
                      We expanded our network to include chapters at major
                      universities across Pakistan and launched our first
                      research initiatives and public events.
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      2022-Present: Impact and Influence
                    </div>
                    <div className="mt-2 text-muted-foreground">
                      We have established partnerships with international
                      organizations, contributed to policy debates, and begun to
                      influence economics curricula at Pakistani universities.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Skeleton */}
      <Skeleton className="aspect-[21/9] w-full rounded-lg" />

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
