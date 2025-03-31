import { api } from "~/trpc/react";
import { ArticleGridSection } from "./article-grid-section";
import { PublicationTypeSectionSkeleton } from "./loading-skeletons";
import type { PublicationType } from "~/lib/types/publications";

interface PublicationTypeSectionProps {
  type: PublicationType;
  displayName: string;
}

/**
 * A component that fetches publications for a specific type and renders a section
 */
export function PublicationTypeSection({
  type,
  displayName,
}: PublicationTypeSectionProps) {
  const { data: publications = [], isLoading } =
    api.publications.getByType.useQuery({
      type,
      limit: 4,
    });

  // Show skeleton while loading
  if (isLoading) {
    return <PublicationTypeSectionSkeleton title={displayName} />;
  }

  // Don't render anything if there are no publications of this type
  if (publications.length === 0) {
    return null;
  }

  return (
    <ArticleGridSection
      title={displayName}
      articles={publications}
      viewAllLink={`/publications?type=${type}`}
    />
  );
}
