import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { PublicationWithAuthor } from "~/lib/types/publications";

interface PopularArticleProps {
  article: PublicationWithAuthor;
}

export function PopularArticle({ article }: PopularArticleProps) {
  return (
    <Link href={`/publications/${article.slug}`} className="group flex gap-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium group-hover:text-primary">
          {article.title}
        </div>
        <div className="text-xs text-muted-foreground">
          {article.publishedAt &&
            format(new Date(article.publishedAt), "MMM d, yyyy")}{" "}
          • {article.author?.name}
        </div>
      </div>
    </Link>
  );
}
