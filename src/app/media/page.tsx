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

// Define media mention type
interface MediaMention {
  id: string;
  title: string;
  outlet: string;
  date: string;
  url: string;
  excerpt?: string;
  imageUrl?: string;
  type: "article" | "interview" | "feature";
}

// Define press release type
interface PressRelease {
  id: string;
  title: string;
  date: string;
  summary: string;
  pdfUrl?: string;
}

// Define media resource type
interface MediaResource {
  id: string;
  title: string;
  description: string;
  type: "factsheet" | "presskit" | "logo" | "photo";
  downloadUrl: string;
  thumbnailUrl?: string;
}

export default function MediaPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock media mentions data
  const mediaMentions: MediaMention[] = [
    {
      id: "1",
      title: "Rethinking Economics Pakistan Calls for Curriculum Reform",
      outlet: "Dawn News",
      date: "2023-09-15",
      url: "https://example.com/news/1",
      excerpt:
        "The organization argues that Pakistan's economic challenges require diverse theoretical perspectives beyond mainstream economics.",
      imageUrl:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=300&auto=format&fit=crop",
      type: "article",
    },
    {
      id: "2",
      title: "Interview: The Future of Economic Education in Pakistan",
      outlet: "Express Tribune",
      date: "2023-08-22",
      url: "https://example.com/news/2",
      excerpt:
        "Dr. Amina Khan discusses the need for pluralist approaches to economics education and policy-making in Pakistan.",
      imageUrl:
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=300&auto=format&fit=crop",
      type: "interview",
    },
    {
      id: "3",
      title: "New Research on Alternative Economic Models",
      outlet: "Business Recorder",
      date: "2023-07-10",
      url: "https://example.com/news/3",
      excerpt:
        "Rethinking Economics Pakistan's latest research paper examines heterodox approaches to monetary policy that prioritize employment and inclusive growth.",
      imageUrl:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop",
      type: "article",
    },
    {
      id: "4",
      title: "Feature: The Hidden Economics of Care Work",
      outlet: "The News International",
      date: "2023-06-05",
      url: "https://example.com/news/4",
      excerpt:
        "An in-depth look at Rethinking Economics Pakistan's research on the economic value of unpaid care work and its policy implications.",
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&auto=format&fit=crop",
      type: "feature",
    },
  ];

  // Mock press releases data
  const pressReleases: PressRelease[] = [
    {
      id: "1",
      title:
        "Rethinking Economics Pakistan Launches New Policy Research Initiative",
      date: "2023-09-01",
      summary:
        "The initiative will examine innovative financial mechanisms to support Pakistan's transition to a more sustainable and inclusive economy.",
      pdfUrl: "https://example.com/press/1.pdf",
    },
    {
      id: "2",
      title: "Annual Conference on Pluralist Economics Announced",
      date: "2023-08-15",
      summary:
        "The conference will bring together leading economists, policymakers, and students to explore diverse approaches to economic theory and policy.",
      pdfUrl: "https://example.com/press/2.pdf",
    },
    {
      id: "3",
      title: "New Partnership with International Research Network",
      date: "2023-07-20",
      summary:
        "Rethinking Economics Pakistan joins global network of researchers working on alternative economic frameworks for sustainable development.",
      pdfUrl: "https://example.com/press/3.pdf",
    },
    {
      id: "4",
      title: "Statement on Recent Economic Policy Developments",
      date: "2023-06-10",
      summary:
        "Rethinking Economics Pakistan responds to the government's new economic policy framework, highlighting both strengths and areas for improvement.",
      pdfUrl: "https://example.com/press/4.pdf",
    },
  ];

  // Mock media resources data
  const mediaResources: MediaResource[] = [
    {
      id: "1",
      title: "Organizational Fact Sheet",
      description:
        "Key information about Rethinking Economics Pakistan, our mission, and our work.",
      type: "factsheet",
      downloadUrl: "https://example.com/resources/factsheet.pdf",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1586892478025-2b5472316f22?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Press Kit",
      description:
        "Comprehensive information for media professionals, including background, leadership bios, and key initiatives.",
      type: "presskit",
      downloadUrl: "https://example.com/resources/presskit.zip",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Logo Package",
      description: "High-resolution logos and brand assets for media use.",
      type: "logo",
      downloadUrl: "https://example.com/resources/logos.zip",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Event Photos",
      description:
        "High-resolution photos from our recent events and conferences.",
      type: "photo",
      downloadUrl: "https://example.com/resources/photos.zip",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=300&auto=format&fit=crop",
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

  // Filter media mentions by type
  const articles = mediaMentions.filter(
    (mention) => mention.type === "article",
  );
  const interviews = mediaMentions.filter(
    (mention) => mention.type === "interview",
  );
  const features = mediaMentions.filter(
    (mention) => mention.type === "feature",
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
            <BreadcrumbPage>Media and Press</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">Media and Press</div>
        <div className="mt-2 text-muted-foreground">
          News coverage, press releases, and resources for media professionals.
        </div>
      </div>

      {isLoading ? (
        <MediaSkeleton />
      ) : (
        <>
          {/* Media Mentions Section */}
          <div className="mb-16">
            <div className="mb-6 text-2xl font-bold">Media Coverage</div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All Coverage</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mediaMentions.map((mention) => (
                    <MediaMentionCard
                      key={mention.id}
                      mention={mention}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="articles">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((mention) => (
                    <MediaMentionCard
                      key={mention.id}
                      mention={mention}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="interviews">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {interviews.map((mention) => (
                    <MediaMentionCard
                      key={mention.id}
                      mention={mention}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="features">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {features.map((mention) => (
                    <MediaMentionCard
                      key={mention.id}
                      mention={mention}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Press Releases Section */}
          <div className="mb-16">
            <div className="mb-6 text-2xl font-bold">Press Releases</div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pressReleases.map((release) => (
                <PressReleaseCard
                  key={release.id}
                  release={release}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>

          {/* Media Resources Section */}
          <div className="mb-16">
            <div className="mb-6 text-2xl font-bold">Media Resources</div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mediaResources.map((resource) => (
                <MediaResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>

          {/* Media Contact Section */}
          <div className="rounded-lg bg-muted p-6">
            <div className="text-xl font-semibold">Media Contact</div>
            <div className="mt-2 text-muted-foreground">
              For media inquiries, interview requests, or additional
              information, please contact our Communications Director:
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <span className="font-medium">Subtain Zahid</span>,
                Communications Director
              </div>
              <div>Email: media@rethinkingeconomics.pk</div>
              <div>Phone: +92 300 1234567</div>
            </div>
            <div className="mt-6">
              <Button>Contact for Media Inquiry</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface MediaMentionCardProps {
  mention: MediaMention;
  formatDate: (date: string) => string;
}

function MediaMentionCard({ mention, formatDate }: MediaMentionCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={
            mention.imageUrl ??
            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=300&auto=format&fit=crop"
          }
          alt={mention.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=300&auto=format&fit=crop";
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="font-medium text-primary">{mention.outlet}</div>
          <div className="text-sm text-muted-foreground">
            {formatDate(mention.date)}
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg">{mention.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mention.excerpt && (
          <div className="line-clamp-3 text-sm text-muted-foreground">
            {mention.excerpt}
          </div>
        )}
        <a
          href={mention.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Read Full Article
        </a>
      </CardContent>
    </Card>
  );
}

interface PressReleaseCardProps {
  release: PressRelease;
  formatDate: (date: string) => string;
}

function PressReleaseCard({ release, formatDate }: PressReleaseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="text-sm text-muted-foreground">
          {formatDate(release.date)}
        </div>
        <CardTitle className="line-clamp-2">{release.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">{release.summary}</div>
        {release.pdfUrl && (
          <Button variant="outline" size="sm">
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
      </CardContent>
    </Card>
  );
}

function MediaResourceCard({ resource }: { resource: MediaResource }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={
            resource.thumbnailUrl ??
            "https://images.unsplash.com/photo-1586892478025-2b5472316f22?q=80&w=300&auto=format&fit=crop"
          }
          alt={resource.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1586892478025-2b5472316f22?q=80&w=300&auto=format&fit=crop";
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {resource.description}
        </div>
        <a
          href={resource.downloadUrl}
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Download
        </a>
      </CardContent>
    </Card>
  );
}

function MediaSkeleton() {
  return (
    <div className="space-y-16">
      {/* Media Mentions Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-6">
          <div className="flex gap-4 overflow-x-auto">
            <Skeleton className="h-10 w-28 flex-shrink-0" />
            <Skeleton className="h-10 w-24 flex-shrink-0" />
            <Skeleton className="h-10 w-28 flex-shrink-0" />
            <Skeleton className="h-10 w-24 flex-shrink-0" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                <div className="space-y-2 px-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <div className="space-y-1 py-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Press Releases Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Media Resources Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Media Contact Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}
