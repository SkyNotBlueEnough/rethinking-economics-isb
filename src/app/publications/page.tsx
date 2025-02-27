"use client";

import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type {
  PublicationType,
  PublicationWithAuthor,
} from "~/lib/types/publications";

export default function PublicationsPage() {
  // Fetch all publication types with their counts
  const { data: publicationTypes = [], isLoading: isLoadingTypes } =
    api.publications.getAllTypes.useQuery();

  // Define the publication types we want to display
  const typesToDisplay: Array<{ type: PublicationType; displayName: string }> =
    [
      { type: "research_paper", displayName: "Research Papers" },
      { type: "policy_brief", displayName: "Policy Briefs" },
      { type: "opinion", displayName: "Opinion Pieces" },
      { type: "blog_post", displayName: "Blog Posts" },
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
            <BreadcrumbPage>Publications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">Publications</div>
        <div className="mt-2 text-muted-foreground">
          Browse our collection of research papers, policy briefs, opinion
          pieces, and blog posts.
        </div>
      </div>

      {/* Publications Tabs */}
      <Tabs defaultValue="research_paper" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          {typesToDisplay.map((typeInfo) => (
            <TabsTrigger
              key={typeInfo.type}
              value={typeInfo.type}
              className="min-w-max"
            >
              {typeInfo.displayName}
              {isLoadingTypes ? (
                <Skeleton className="ml-2 h-5 w-5 rounded-full" />
              ) : (
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {publicationTypes.find((t) => t.typeId === typeInfo.type)
                    ?.count ?? 0}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {typesToDisplay.map((typeInfo) => (
          <TabsContent key={typeInfo.type} value={typeInfo.type}>
            <PublicationTypeContent type={typeInfo.type} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function PublicationTypeContent({ type }: { type: PublicationType }) {
  const { data: publications = [], isLoading } =
    api.publications.getByType.useQuery({
      type,
      limit: 10,
    });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          "skeleton-1",
          "skeleton-2",
          "skeleton-3",
          "skeleton-4",
          "skeleton-5",
          "skeleton-6",
        ].map((id) => (
          <PublicationCardSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-lg font-medium">No publications found</div>
        <div className="text-muted-foreground">
          Check back later for new content.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((publication) => (
        <PublicationCard key={publication.id} publication={publication} />
      ))}
    </div>
  );
}

function PublicationCard({
  publication,
}: {
  publication: PublicationWithAuthor;
}) {
  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <Link
        href={`/publications/${publication.slug}`}
        className="group block h-full"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {publication.thumbnailUrl ? (
            <Image
              src={publication.thumbnailUrl}
              alt={publication.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
        <CardContent className="p-4">
          <div className="line-clamp-2 text-lg font-medium group-hover:text-primary">
            {publication.title}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {publication.publishedAt &&
              format(new Date(publication.publishedAt), "MMM d, yyyy")}{" "}
            • {publication.author?.name}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="ghost" size="sm" className="text-primary">
            Read Article
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}

function PublicationCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-32" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}
