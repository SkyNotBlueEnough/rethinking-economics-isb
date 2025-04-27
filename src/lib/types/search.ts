import { z } from "zod";

/**
 * Search result item schema
 */
export const searchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string().optional(),
  type: z
    .enum(["publication", "event", "policy", "about", "member", "page"])
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  imageUrl: z.string().url().optional(),
});

/**
 * Search query parameters schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  type: z
    .enum(["publication", "event", "policy", "about", "member", "page", "all"])
    .optional()
    .default("all"),
  limit: z.number().min(1).max(50).optional().default(10),
  page: z.number().min(1).optional().default(1),
});

/**
 * Search response schema
 */
export const searchResponseSchema = z.object({
  results: z.array(searchResultSchema),
  totalResults: z.number(),
  page: z.number(),
  totalPages: z.number(),
  query: z.string(),
});

/**
 * TypeScript types derived from Zod schemas
 */
export type SearchResult = z.infer<typeof searchResultSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
