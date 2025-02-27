import { api } from "~/trpc/react";
import { CategorySection } from "./category-section";
import type { CategoryWithCount } from "~/lib/types/publications";

interface CategorySectionWithDataProps {
  category: CategoryWithCount;
}

/**
 * A component that fetches publications for a category and renders a CategorySection
 */
export function CategorySectionWithData({
  category,
}: CategorySectionWithDataProps) {
  const { data: publications = [] } = api.publications.getByCategory.useQuery({
    categorySlug: category.slug,
    limit: 4,
  });

  return (
    <CategorySection
      title={category.name}
      articles={publications}
      viewAllLink={`/publications?category=${category.slug}`}
    />
  );
}
