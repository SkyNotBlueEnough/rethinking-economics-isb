import type { PublicationsWithAuthor } from "~/lib/types/publications";
import { FeaturedArticle } from "./featured-article";
import { PopularArticlesSection } from "./popular-articles-section";

interface MobileViewProps {
  featuredArticles: PublicationsWithAuthor;
  popularArticles: PublicationsWithAuthor;
}

export function MobileView({
  featuredArticles,
  popularArticles,
}: MobileViewProps) {
  if (!featuredArticles || featuredArticles.length === 0) return null;

  // Split featured publications into main and secondary
  const mainArticle = featuredArticles[2]; // Center article from desktop view
  const secondaryArticles = featuredArticles.slice(0, 2); // Left column articles from desktop view

  return (
    <div className="block lg:hidden">
      {/* Main Featured Article */}
      <div className="mb-8">
        {mainArticle && <FeaturedArticle article={mainArticle} size="large" />}
      </div>

      {/* Secondary Featured Articles */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {secondaryArticles.map((article) => (
          <FeaturedArticle key={article.id} article={article} size="small" />
        ))}
      </div>

      {/* Most Popular Section */}
      <div className="mb-8">
        <PopularArticlesSection articles={popularArticles} />
      </div>
    </div>
  );
}
