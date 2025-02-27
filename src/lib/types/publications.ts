import type { publications, categories } from "~/server/db/schema";

// Publication types enum
export type PublicationType =
  | "research_paper"
  | "policy_brief"
  | "opinion"
  | "blog_post";

// Base publication type from the database schema
export type Publication = typeof publications.$inferSelect;

// Publication with author information as returned by the API
export interface PublicationWithAuthor extends Partial<Publication> {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  author?: {
    id: string;
    name: string | null;
  } | null;
}

// Array of publications with author information
export type PublicationsWithAuthor = PublicationWithAuthor[];

// Publication type with count as returned by the API
export interface PublicationTypeWithCount {
  typeId: PublicationType;
  count: number;
  displayName: string;
}

// Array of publication types with counts
export type PublicationTypesWithCount = PublicationTypeWithCount[];

// Category type from the database schema
export type Category = typeof categories.$inferSelect;

// Category with publication count as returned by the API
export interface CategoryWithCount extends Category {
  publicationCount: number;
}

// Array of categories with publication counts
export type CategoriesWithCount = CategoryWithCount[];
