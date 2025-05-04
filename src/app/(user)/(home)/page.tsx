"use client";

import { api } from "~/trpc/react";
import { MobileView } from "./components/mobile-view";
import {
  LeftColumnArticles,
  CenterArticle,
} from "./components/featured-articles-section";
import { PopularArticlesSection } from "./components/popular-articles-section";
import { PublicationTypeSection } from "./components/publication-type-section";
import { HomePageSkeleton } from "./components/loading-skeletons";
import type {
  PublicationsWithAuthor,
  PublicationTypesWithCount,
  PublicationType,
} from "~/lib/types/publications";

export default function Home() {
  // Fetch featured and popular publications
  const { data: featuredPublications, isLoading: isFeaturedLoading } =
    api.publications.getFeatured.useQuery<PublicationsWithAuthor>();
  const { data: popularPublications, isLoading: isPopularLoading } =
    api.publications.getPopular.useQuery<PublicationsWithAuthor>();

  // Fetch all publication types with their counts
  const { data: publicationTypes, isLoading: isTypesLoading } =
    api.publications.getAllTypes.useQuery<PublicationTypesWithCount>();

  // Check if any data is still loading
  const isLoading = isFeaturedLoading || isPopularLoading || isTypesLoading;

  // Show skeleton while loading
  if (isLoading) {
    return <HomePageSkeleton />;
  }

  // Ensure we have data to display
  const featuredPublicationsData = featuredPublications ?? [];
  const popularPublicationsData = popularPublications ?? [];
  const publicationTypesData = publicationTypes ?? [];

  // Split featured publications for desktop view
  const leftColumnArticles = featuredPublicationsData.slice(0, 2);
  const centerArticle = featuredPublicationsData[0];

  // Define the publication types we want to display
  // We'll use the predefined types rather than relying on the API response
  // to ensure a consistent order and display
  const typesToDisplay: Array<{ type: PublicationType; displayName: string }> =
    [
      { type: "research_paper", displayName: "Research Papers" },
      { type: "policy_brief", displayName: "Policy Briefs" },
      { type: "opinion", displayName: "Opinion Pieces" },
      { type: "blog_post", displayName: "Blog Posts" },
    ];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Mobile View */}
      <MobileView
        featuredArticles={featuredPublicationsData}
        popularArticles={popularPublicationsData}
      />

      {/* Desktop View - Featured and Popular */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 divide-x">
          {/* Left Column - Two Featured Articles */}
          <div className="col-span-3 px-3">
            <LeftColumnArticles articles={leftColumnArticles} />
          </div>

          {/* Center Column - Large Featured Article */}
          <div className="col-span-6 px-3">
            <CenterArticle article={centerArticle} />
          </div>

          {/* Right Column - Most Popular */}
          <div className="col-span-3 px-3">
            <PopularArticlesSection articles={popularPublicationsData} />
          </div>
        </div>
      </div>

      {/* Publication Type Sections */}
      <div className="mt-16 space-y-16">
        {typesToDisplay.map((typeInfo) => (
          <PublicationTypeSection
            key={typeInfo.type}
            type={typeInfo.type}
            displayName={typeInfo.displayName}
          />
        ))}
      </div>
    </div>
  );
}
