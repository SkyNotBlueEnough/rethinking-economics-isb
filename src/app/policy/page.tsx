"use client";

import { useState, useEffect } from "react";
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

// Define policy brief type
interface PolicyBrief {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl?: string;
  pdfUrl?: string;
  category: "economic" | "social" | "environmental";
}

// Define advocacy campaign type
interface AdvocacyCampaign {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "planned";
  imageUrl?: string;
  achievements?: string[];
}

export default function PolicyPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock policy briefs data
  const policyBriefs: PolicyBrief[] = [
    {
      id: "1",
      title: "Rethinking Monetary Policy for Inclusive Growth",
      summary:
        "This policy brief examines alternative approaches to monetary policy that prioritize employment and inclusive growth alongside price stability.",
      date: "2023-06-15",
      imageUrl:
        "https://images.unsplash.com/photo-1607944024060-0450380ddd33?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "/pdfs/monetary-policy-brief.pdf",
      category: "economic",
    },
    {
      id: "2",
      title: "Green Finance for Pakistan's Sustainable Development",
      summary:
        "This brief proposes a framework for developing green finance instruments to fund Pakistan's transition to a more sustainable economy.",
      date: "2023-04-22",
      imageUrl:
        "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "/pdfs/green-finance-brief.pdf",
      category: "environmental",
    },
    {
      id: "3",
      title: "Addressing Inequality Through Progressive Taxation",
      summary:
        "This policy brief analyzes Pakistan's tax system and proposes reforms to make it more progressive and effective at reducing inequality.",
      date: "2023-02-10",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "/pdfs/taxation-brief.pdf",
      category: "economic",
    },
    {
      id: "4",
      title: "Care Economy: Recognizing and Valuing Unpaid Work",
      summary:
        "This brief examines the economic value of unpaid care work in Pakistan and proposes policies to recognize, reduce, and redistribute this work.",
      date: "2022-11-30",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "/pdfs/care-economy-brief.pdf",
      category: "social",
    },
    {
      id: "5",
      title: "Climate Resilience in Agricultural Policy",
      summary:
        "This policy brief outlines strategies for incorporating climate resilience into Pakistan's agricultural policies and practices.",
      date: "2022-09-18",
      imageUrl:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "/pdfs/agriculture-brief.pdf",
      category: "environmental",
    },
    {
      id: "6",
      title: "Education for Economic Transformation",
      summary:
        "This brief analyzes how Pakistan's education system can better prepare students for a changing economy and proposes curriculum reforms.",
      date: "2022-07-05",
      imageUrl:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "/pdfs/education-brief.pdf",
      category: "social",
    },
  ];

  // Mock advocacy campaigns data
  const advocacyCampaigns: AdvocacyCampaign[] = [
    {
      id: "1",
      title: "Economics Curriculum Reform",
      description:
        "A campaign to promote the adoption of pluralist economics curricula in Pakistani universities, incorporating diverse theoretical perspectives and interdisciplinary approaches.",
      status: "active",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
      achievements: [
        "Developed a model pluralist economics curriculum",
        "Engaged with faculty at 5 major universities",
        "Organized workshops for economics educators",
      ],
    },
    {
      id: "2",
      title: "Green Recovery Advocacy",
      description:
        "An initiative advocating for green recovery policies in Pakistan's post-COVID economic planning, emphasizing sustainable infrastructure and renewable energy.",
      status: "active",
      imageUrl:
        "https://images.unsplash.com/photo-1473893604213-3df9c15611c0?q=80&w=800&auto=format&fit=crop",
      achievements: [
        "Published a comprehensive green recovery framework",
        "Presented recommendations to the Planning Commission",
        "Built a coalition of environmental and economic organizations",
      ],
    },
    {
      id: "3",
      title: "Financial Inclusion Policy",
      description:
        "A campaign promoting policies to increase financial inclusion, particularly for women and rural communities, through innovative financial services and regulatory reforms.",
      status: "completed",
      imageUrl:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
      achievements: [
        "Contributed to the State Bank's financial inclusion strategy",
        "Conducted research on barriers to financial access",
        "Organized a national conference on financial inclusion",
      ],
    },
    {
      id: "4",
      title: "Economic Literacy Initiative",
      description:
        "A program to improve economic literacy among the general public, journalists, and policymakers, providing accessible resources on economic concepts and policies.",
      status: "planned",
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter policy briefs by category
  const economicBriefs = policyBriefs.filter(
    (brief) => brief.category === "economic",
  );
  const socialBriefs = policyBriefs.filter(
    (brief) => brief.category === "social",
  );
  const environmentalBriefs = policyBriefs.filter(
    (brief) => brief.category === "environmental",
  );

  // Filter advocacy campaigns by status
  const activeCampaigns = advocacyCampaigns.filter(
    (campaign) => campaign.status === "active",
  );
  const completedCampaigns = advocacyCampaigns.filter(
    (campaign) => campaign.status === "completed",
  );
  const plannedCampaigns = advocacyCampaigns.filter(
    (campaign) => campaign.status === "planned",
  );

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
                  {policyBriefs.map((brief) => (
                    <PolicyBriefCard
                      key={brief.id}
                      brief={brief}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="economic">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {economicBriefs.map((brief) => (
                    <PolicyBriefCard
                      key={brief.id}
                      brief={brief}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {socialBriefs.map((brief) => (
                    <PolicyBriefCard
                      key={brief.id}
                      brief={brief}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="environmental">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {environmentalBriefs.map((brief) => (
                    <PolicyBriefCard
                      key={brief.id}
                      brief={brief}
                      formatDate={formatDate}
                    />
                  ))}
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
                  {activeCampaigns.map((campaign) => (
                    <AdvocacyCampaignCard
                      key={campaign.id}
                      campaign={campaign}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {completedCampaigns.map((campaign) => (
                    <AdvocacyCampaignCard
                      key={campaign.id}
                      campaign={campaign}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="planned">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {plannedCampaigns.map((campaign) => (
                    <AdvocacyCampaignCard
                      key={campaign.id}
                      campaign={campaign}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Policy Impact Section */}
          <div className="mt-16">
            <div className="mb-6 text-2xl font-bold">Our Policy Impact</div>
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-primary">15+</div>
                    <div className="mt-2 font-medium">
                      Policy Briefs Published
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Research-based recommendations on economic, social, and
                      environmental policy
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-primary">8</div>
                    <div className="mt-2 font-medium">
                      Policy Working Groups
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Collaborative teams of experts developing alternative
                      policy frameworks
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-bold text-primary">12</div>
                    <div className="mt-2 font-medium">
                      Government Consultations
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Direct engagement with policymakers to influence economic
                      policy
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

interface PolicyBriefCardProps {
  brief: PolicyBrief;
  formatDate: (date: string) => string;
}

function PolicyBriefCard({ brief, formatDate }: PolicyBriefCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={
            brief.imageUrl ||
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
          }
          alt={brief.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop";
          }}
        />
      </div>
      <CardHeader>
        <div className="text-sm text-muted-foreground">
          {formatDate(brief.date)}
        </div>
        <CardTitle className="line-clamp-2 text-lg">{brief.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="line-clamp-3 text-sm text-muted-foreground">
          {brief.summary}
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        {brief.pdfUrl && (
          <Button variant="outline" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
              aria-hidden="true"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Download PDF
          </Button>
        )}
      </div>
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
              {campaign.achievements.map((achievement) => (
                <li
                  key={`${campaign.id}-${achievement.substring(0, 10)}`}
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

      {/* Policy Impact Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}
