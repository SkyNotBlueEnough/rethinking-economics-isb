import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { PublicationWithAuthor } from "~/lib/types/publications";

interface ArticleCardProps {
  article: PublicationWithAuthor;
}

/**
 * A card component for displaying an article in a grid layout
 */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/publications/${article.slug}`} className="group block h-full">
      <div className="flex h-full flex-col">
        {/* Article Thumbnail */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
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

        {/* Article Content */}
        <div className="mt-3 flex flex-1 flex-col">
          <div className="text-lg font-medium text-foreground group-hover:text-primary">
            {article.title}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {article.publishedAt &&
              format(new Date(article.publishedAt), "MMM d, yyyy")}{" "}
            • {article.author?.name}
          </div>
        </div>
      </div>
    </Link>
  );
}
