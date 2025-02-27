import type {
  PublicationWithAuthor,
  PublicationsWithAuthor,
} from "~/lib/types/publications";
import { FeaturedArticle } from "./featured-article";

/**
 * Component for displaying a list of featured articles in the left column
 */
export function LeftColumnArticles({
  articles,
}: {
  articles: PublicationsWithAuthor;
}) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <FeaturedArticle key={article.id} article={article} size="small" />
      ))}
    </div>
  );
}

/**
 * Component for displaying the main featured article in the center column
 */
export function CenterArticle({
  article,
}: {
  article: PublicationWithAuthor | undefined;
}) {
  if (!article) return null;

  return <FeaturedArticle article={article} size="large" />;
}

/**
 * Legacy component that combines both left and center articles
 * This is kept for backward compatibility but is no longer used directly
 */
export function FeaturedArticlesSection({
  articles,
}: {
  articles: PublicationsWithAuthor;
}) {
  if (!articles || articles.length === 0) return null;

  // Split featured publications into left column and center
  const leftColumnArticles = articles.slice(0, 2);
  const centerArticle = articles[2];

  return (
    <>
      {/* Left Column - Two Featured Articles */}
      <div className="col-span-3">
        <LeftColumnArticles articles={leftColumnArticles} />
      </div>

      {/* Center Column - Large Featured Article */}
      <div className="col-span-6">
        <CenterArticle article={centerArticle} />
      </div>
    </>
  );
}
