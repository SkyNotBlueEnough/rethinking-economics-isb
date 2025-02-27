import type { publications } from "~/server/db/schema";

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
