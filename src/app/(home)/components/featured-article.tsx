import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { PublicationWithAuthor } from "~/lib/types/publications";

interface FeaturedArticleProps {
  article: PublicationWithAuthor;
  size?: "small" | "large";
}

export function FeaturedArticle({
  article,
  size = "small",
}: FeaturedArticleProps) {
  return (
    <Link href={`/publications/${article.slug}`} className="group block">
      <div
        className={`relative ${size === "large" ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden rounded-lg`}
      >
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={size === "large"}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <div
        className={`mt-2 ${size === "large" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"} font-semibold text-foreground`}
      >
        {article.title}
      </div>
      <div className="mt-1">
        <div className="text-sm text-muted-foreground">
          {article.publishedAt &&
            format(new Date(article.publishedAt), "MMM d, yyyy")}{" "}
          • {article.author?.name}
        </div>
      </div>
    </Link>
  );
}
