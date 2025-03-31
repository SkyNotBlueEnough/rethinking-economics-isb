import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton for a featured article (small size)
 */
export function FeaturedArticleSmallSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

/**
 * Skeleton for a featured article (large size)
 */
export function FeaturedArticleLargeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Skeleton for a popular article
 */
export function PopularArticleSkeleton() {
  return (
    <div className="flex space-x-3">
      <Skeleton className="h-16 w-16 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Skeleton for the popular articles section
 */
export function PopularArticlesSectionSkeleton() {
  // Create an array with unique identifiers
  const skeletonItems = [
    "popular-article-1",
    "popular-article-2",
    "popular-article-3",
    "popular-article-4",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-6">
        {skeletonItems.map((id) => (
          <PopularArticleSkeleton key={id} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for an article card in the grid
 */
export function ArticleCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

/**
 * Skeleton for a publication type section
 */
export function PublicationTypeSectionSkeleton({ title }: { title: string }) {
  // Create an array with unique identifiers
  const skeletonItems = [
    `${title}-article-1`,
    `${title}-article-2`,
    `${title}-article-3`,
    `${title}-article-4`,
  ];

  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-2xl font-semibold">{title}</div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {skeletonItems.map((id) => (
          <ArticleCardSkeleton key={id} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for the left column featured articles
 */
export function LeftColumnArticlesSkeleton() {
  // Create an array with unique identifiers
  const skeletonItems = ["left-column-article-1", "left-column-article-2"];

  return (
    <div className="space-y-8">
      {skeletonItems.map((id) => (
        <FeaturedArticleSmallSkeleton key={id} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the mobile view
 */
export function MobileViewSkeleton() {
  // Create an array with unique identifiers
  const skeletonItems = [
    "mobile-featured-article-1",
    "mobile-featured-article-2",
  ];

  return (
    <div className="block lg:hidden">
      <div className="mb-8">
        <FeaturedArticleLargeSkeleton />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {skeletonItems.map((id) => (
          <FeaturedArticleSmallSkeleton key={id} />
        ))}
      </div>
      <div className="mb-8">
        <PopularArticlesSectionSkeleton />
      </div>
    </div>
  );
}

/**
 * Skeleton for the desktop view
 */
export function DesktopViewSkeleton() {
  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-12 divide-x">
        <div className="col-span-3 px-3">
          <LeftColumnArticlesSkeleton />
        </div>
        <div className="col-span-6 px-3">
          <FeaturedArticleLargeSkeleton />
        </div>
        <div className="col-span-3 px-3">
          <PopularArticlesSectionSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the publication types sections
 */
export function PublicationTypesSkeleton() {
  const typeTitles = [
    "Research Papers",
    "Policy Briefs",
    "Opinion Pieces",
    "Blog Posts",
  ];

  return (
    <div className="mt-16 space-y-16">
      {typeTitles.map((title) => (
        <PublicationTypeSectionSkeleton key={title} title={title} />
      ))}
    </div>
  );
}

/**
 * Main skeleton for the entire home page
 */
export function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <MobileViewSkeleton />
      <DesktopViewSkeleton />
      <PublicationTypesSkeleton />
    </div>
  );
}
