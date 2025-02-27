"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, User, Share2, Bookmark } from "lucide-react";
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
import { useState, useEffect } from "react";
import type { PublicationWithAuthor } from "~/lib/types/publications";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// Content renderer component to avoid dangerouslySetInnerHTML linter warning
// We need to use dangerouslySetInnerHTML for rendering HTML content
// eslint-disable-next-line react/no-danger
const ContentRenderer = ({ content }: { content: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Using a div with dangerouslySetInnerHTML in a separate component
  // eslint-disable-next-line react/no-danger
  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

// Related article card component
const RelatedArticleCard = ({
  article,
}: {
  article: PublicationWithAuthor;
}) => {
  return (
    <Card className="h-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <CardContent className="p-4">
        <div className="line-clamp-2 text-lg font-medium">{article.title}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/publications/${article.slug}`}>Read Article</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Social sharing buttons
const SocialShareButtons = ({ title }: { title: string }) => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: shareUrl,
        })
        .catch(console.error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>Share this article</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>Save for later</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } =
    api.publications.getBySlug.useQuery(slug);
  const { data: relatedArticles = [], isLoading: isLoadingRelated } =
    api.publications.getRelated.useQuery(
      { slug, limit: 3 },
      { enabled: !!article },
    );

  // Loading state
  if (isLoading) {
    return <ArticleLoadingSkeleton />;
  }

  // Article not found
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="text-3xl font-bold">Article Not Found</div>
          <div className="text-muted-foreground">
            The article you are looking for does not exist or has been removed.
          </div>
          <Button asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Navigation - Hidden on mobile */}
      <div className="hidden sm:block">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/publications">Publications</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/publications">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Publications</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>

        {/* Social Share Buttons */}
        <SocialShareButtons title={article.title} />
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="mb-2 text-sm font-medium uppercase text-primary">
          {article.type?.replace("_", " ")}
        </div>
        <div className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
          {article.title}
        </div>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {article.publishedAt && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {format(new Date(article.publishedAt), "MMMM d, yyyy")}
            </div>
          )}
          {article.authorId && (
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              By {article.author?.name}
            </div>
          )}
        </div>
      </div>

      {/* Article Content Container with max width for better readability */}
      <div className="mx-auto max-w-3xl">
        {/* Featured Image */}
        {article.thumbnailUrl && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9]">
            <Image
              src={article.thumbnailUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {/* Abstract */}
        {article.abstract && (
          <div className="mb-8 rounded-lg bg-muted p-4 sm:p-6">
            <div className="mb-2 text-lg font-medium">Abstract</div>
            <div className="text-muted-foreground">{article.abstract}</div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
          <ContentRenderer content={article.content} />
        </div>

        {/* PDF Download */}
        {article.pdfUrl && (
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Related Articles Section */}
      <div className="mt-16 border-t pt-8">
        <div className="mb-6 text-xl font-bold sm:text-2xl">
          Related Articles
        </div>

        {isLoadingRelated ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full">
                <Skeleton className="aspect-[16/9] w-full rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {relatedArticles.map((article) => (
              <RelatedArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">
            No related articles found.
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton for better UX
function ArticleLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Skeleton - Hidden on mobile */}
      <div className="mb-6 hidden items-center space-x-2 sm:flex">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Back Button and Share Buttons Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-24 sm:w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Article Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="mb-2 h-8 w-full sm:h-10" />
        <Skeleton className="mb-4 h-8 w-3/4 sm:h-10" />

        {/* Article Meta Skeleton */}
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <Skeleton className="mb-8 aspect-[16/9] w-full rounded-lg sm:aspect-[21/9]" />

      {/* Content Container */}
      <div className="mx-auto max-w-3xl">
        {/* Abstract Skeleton */}
        <div className="mb-8 rounded-lg border p-4 sm:p-6">
          <Skeleton className="mb-2 h-6 w-24" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
