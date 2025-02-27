import Link from "next/link";
import type { PublicationsWithAuthor } from "~/lib/types/publications";
import { PopularArticle } from "./popular-article";

interface PopularArticlesSectionProps {
  articles: PublicationsWithAuthor;
}

export function PopularArticlesSection({
  articles,
}: PopularArticlesSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Most Popular</div>
      </div>
      <div className="space-y-6">
        {articles.map((article) => (
          <PopularArticle key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
