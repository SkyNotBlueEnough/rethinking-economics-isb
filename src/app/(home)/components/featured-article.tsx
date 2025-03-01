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
      <div className="flex h-full flex-col">
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

        {size === "large" ? (
          <div className="mt-auto">
            <div className="mt-2 text-center text-2xl font-semibold text-foreground sm:text-3xl">
              {article.title}
            </div>
            <div className="mt-1 text-center">
              <div className="text-sm text-muted-foreground">
                {article.publishedAt &&
                  format(new Date(article.publishedAt), "MMM d, yyyy")}{" "}
                • {article.author?.name}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 text-lg font-semibold text-foreground sm:text-xl">
              {article.title}
            </div>
            <div className="mt-1">
              <div className="text-sm text-muted-foreground">
                {article.publishedAt &&
                  format(new Date(article.publishedAt), "MMM d, yyyy")}{" "}
                • {article.author?.name}
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
