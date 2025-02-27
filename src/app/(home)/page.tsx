"use client";

import { api } from "~/trpc/react";
import { MobileView } from "~/components/home/mobile-view";
import {
  FeaturedArticlesSection,
  LeftColumnArticles,
  CenterArticle,
} from "~/components/home/featured-articles-section";
import { PopularArticlesSection } from "~/components/home/popular-articles-section";
import type { PublicationsWithAuthor } from "~/lib/types/publications";

export default function Home() {
  // Fetch featured and popular publications
  const { data: featuredPublications = [] } =
    api.publications.getFeatured.useQuery<PublicationsWithAuthor>();
  const { data: popularPublications = [] } =
    api.publications.getPopular.useQuery<PublicationsWithAuthor>();

  // Split featured publications for desktop view
  const leftColumnArticles = featuredPublications.slice(0, 2);
  const centerArticle = featuredPublications[2];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Mobile View */}
      <MobileView
        featuredArticles={featuredPublications}
        popularArticles={popularPublications}
      />

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Two Featured Articles */}
          <div className="col-span-3">
            <LeftColumnArticles articles={leftColumnArticles} />
          </div>

          {/* Center Column - Large Featured Article */}
          <div className="col-span-6">
            <CenterArticle article={centerArticle} />
          </div>

          {/* Right Column - Most Popular */}
          <div className="col-span-3">
            <PopularArticlesSection articles={popularPublications} />
          </div>
        </div>
      </div>
    </div>
  );
}
