import Link from "next/link";
import type { PublicationsWithAuthor } from "~/lib/types/publications";
import { ArticleCard } from "./article-card";

interface ArticleGridSectionProps {
  title: string;
  articles: PublicationsWithAuthor;
  viewAllLink?: string;
}

/**
 * A reusable component for displaying a section with articles in a grid
 */
export function ArticleGridSection({
  title,
  articles,
  viewAllLink = "/publications",
}: ArticleGridSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-2xl font-semibold">{title}</div>
        <Link
          href={viewAllLink}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
