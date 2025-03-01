"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define partner type
interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website: string;
  category: "academic" | "policy" | "civil_society";
}

export default function PartnershipsPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock partners data
  const partners: Partner[] = [
    {
      id: "1",
      name: "University of Karachi",
      description:
        "We collaborate with the Department of Economics at the University of Karachi on curriculum development and research initiatives.",
      logoUrl: "/images/partners/uok.png",
      website: "https://uok.edu.pk",
      category: "academic",
    },
    {
      id: "2",
      name: "Lahore University of Management Sciences",
      description:
        "LUMS hosts our annual conference on pluralist economics and provides academic support for our research programs.",
      logoUrl: "/images/partners/lums.png",
      website: "https://lums.edu.pk",
      category: "academic",
    },
    {
      id: "3",
      name: "Institute of Business Administration",
      description:
        "IBA collaborates with us on developing case studies of alternative economic models and hosts workshops for students and faculty.",
      logoUrl: "/images/partners/iba.png",
      website: "https://iba.edu.pk",
      category: "academic",
    },
    {
      id: "4",
      name: "Pakistan Institute of Development Economics",
      description:
        "PIDE partners with us on policy research and advocacy, particularly in the areas of sustainable development and inequality.",
      logoUrl: "/images/partners/pide.png",
      website: "https://pide.org.pk",
      category: "policy",
    },
    {
      id: "5",
      name: "State Bank of Pakistan",
      description:
        "We work with the research department of the State Bank on financial inclusion and monetary policy analysis.",
      logoUrl: "/images/partners/sbp.png",
      website: "https://sbp.org.pk",
      category: "policy",
    },
    {
      id: "6",
      name: "Planning Commission of Pakistan",
      description:
        "Our research informs the Planning Commission's approach to sustainable economic development and social welfare programs.",
      logoUrl: "/images/partners/planning.png",
      website: "https://pc.gov.pk",
      category: "policy",
    },
    {
      id: "7",
      name: "Sustainable Development Policy Institute",
      description:
        "SDPI and Rethinking Economics collaborate on research related to environmental economics and sustainable development in Pakistan.",
      logoUrl: "/images/partners/sdpi.png",
      website: "https://sdpi.org",
      category: "civil_society",
    },
    {
      id: "8",
      name: "Pakistan Poverty Alleviation Fund",
      description:
        "We partner with PPAF on research and advocacy related to poverty reduction and inclusive economic growth.",
      logoUrl: "/images/partners/ppaf.png",
      website: "https://ppaf.org.pk",
      category: "civil_society",
    },
    {
      id: "9",
      name: "Rethinking Economics International",
      description:
        "As part of the global Rethinking Economics network, we collaborate on international initiatives and share resources and best practices.",
      logoUrl: "/images/partners/rei.png",
      website: "https://rethinkeconomics.org",
      category: "civil_society",
    },
  ];

  // Filter partners by category
  const academicPartners = partners.filter(
    (partner) => partner.category === "academic",
  );
  const policyPartners = partners.filter(
    (partner) => partner.category === "policy",
  );
  const civilSocietyPartners = partners.filter(
    (partner) => partner.category === "civil_society",
  );

  return (
    <div>
      {isLoading ? (
        <PartnershipsSkeleton />
      ) : (
        <>
          <div className="mb-8">
            <div className="text-xl font-semibold">Our Partnerships</div>
            <div className="mt-2 text-muted-foreground">
              We collaborate with a diverse range of organizations to advance
              our mission of transforming economic discourse in Pakistan.
            </div>
          </div>

          <Tabs defaultValue="academic" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger value="academic">Academic Institutions</TabsTrigger>
              <TabsTrigger value="policy">Policy Organizations</TabsTrigger>
              <TabsTrigger value="civil_society">Civil Society</TabsTrigger>
            </TabsList>

            <TabsContent value="academic">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {academicPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="policy">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {policyPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="civil_society">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {civilSocietyPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 space-y-6">
            <div className="text-xl font-semibold">
              Partnership Opportunities
            </div>
            <div className="text-muted-foreground">
              We are always seeking new partnerships with organizations that
              share our commitment to pluralist, interdisciplinary approaches to
              economics. If your organization is interested in collaborating
              with us, please reach out to discuss potential opportunities.
            </div>

            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <div className="font-medium">Research Collaboration</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Partner with us on research projects that explore
                      alternative economic frameworks and their application to
                      Pakistan&apos;s development challenges.
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
                      Join our efforts to promote evidence-based, inclusive
                      economic policies that prioritize human well-being and
                      environmental sustainability.
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Events and Outreach</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Collaborate on conferences, workshops, and public events
                      that broaden economic discourse and engage diverse
                      audiences.
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
        </>
      )}
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
                className="object-contain p-2"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parentElement = target.parentElement;
                  if (parentElement) {
                    parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center font-medium">${partner.name}</div>`;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center font-medium">
              {partner.name}
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {partner.description}
        </div>
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Visit Website
        </a>
      </CardContent>
    </Card>
  );
}

function PartnershipsSkeleton() {
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
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}
