"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { Partner } from "~/lib/types/about";

export default function PartnershipsPage() {
  const { data: allPartners, isLoading } = api.about.getAllPartners.useQuery();

  // Filter partners by category
  const academicPartners =
    allPartners?.filter((partner) => partner.category === "academic") ?? [];
  const policyPartners =
    allPartners?.filter((partner) => partner.category === "policy") ?? [];
  const civilSocietyPartners =
    allPartners?.filter((partner) => partner.category === "civil_society") ??
    [];

  if (isLoading) {
    return <PartnershipsSkeleton />;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-xl font-semibold">Our Partnerships</div>
        <div className="mt-2 text-muted-foreground">
          We collaborate with a diverse range of organizations to advance our
          mission of transforming economic discourse in Pakistan.
        </div>
      </div>

      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="academic">Academic Institutions</TabsTrigger>
          <TabsTrigger value="policy">Policy Organizations</TabsTrigger>
          <TabsTrigger value="civil_society">Civil Society</TabsTrigger>
        </TabsList>

        <TabsContent value="academic">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {academicPartners.length > 0 ? (
              academicPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No academic partners found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="policy">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {policyPartners.length > 0 ? (
              policyPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No policy partners found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="civil_society">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {civilSocietyPartners.length > 0 ? (
              civilSocietyPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No civil society partners found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 space-y-6">
        <div className="text-xl font-semibold">Partnership Opportunities</div>
        <div className="text-muted-foreground">
          We are always seeking new partnerships with organizations that share
          our commitment to pluralist, interdisciplinary approaches to
          economics. If your organization is interested in collaborating with
          us, please reach out to discuss potential opportunities.
        </div>

        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="font-medium">Research Collaboration</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Partner with us on research projects that explore alternative
                  economic frameworks and their application to Pakistan&apos;s
                  development challenges.
                </div>
              </div>
              <div>
                <div className="font-medium">Educational Initiatives</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Work with us to develop and implement pluralist economics
                  curricula, workshops, and training programs.
                </div>
              </div>
              <div>
                <div className="font-medium">Policy Advocacy</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Join our efforts to promote evidence-based, inclusive economic
                  policies that prioritize human well-being and environmental
                  sustainability.
                </div>
              </div>
              <div>
                <div className="font-medium">Events and Outreach</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Collaborate on conferences, workshops, and public events that
                  broaden economic discourse and engage diverse audiences.
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="font-medium">
                Contact us at{" "}
                <span className="text-primary">
                  partnerships@reisbthinktank.com
                </span>{" "}
                to discuss partnership opportunities.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{partner.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-16 items-center justify-center overflow-hidden rounded-md bg-muted/50">
          {partner.logoUrl ? (
            <div className="relative h-12 w-full">
              <Image
                src={partner.logoUrl}
                alt={`${partner.name} logo`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div className="font-bold text-muted-foreground">
              {partner.name}
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {partner.description}
        </div>
        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            Visit Website
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function PartnershipsSkeleton() {
  // Create an array of unique IDs for the skeleton items
  const skeletonIds = ["sk1", "sk2", "sk3"];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skeletonIds.map((id) => (
            <Skeleton key={id} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-60 w-full rounded-lg" />
      </div>
    </div>
  );
}
