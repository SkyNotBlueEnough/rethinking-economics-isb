import { z } from "zod";
import { eq, like, or, and, desc, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  publications,
  events,
  policies,
  caseStudies,
  profiles,
} from "~/server/db/schema";
import { searchQuerySchema } from "~/lib/types/search";
import type { SearchResult, SearchResponse } from "~/lib/types/search";

export const searchRouter = createTRPCRouter({
  // Global search endpoint that searches across multiple content types
  search: publicProcedure
    .input(searchQuerySchema)
    .query(async ({ ctx, input }): Promise<SearchResponse> => {
      const { q, type, limit, page } = input;
      const offset = (page - 1) * limit;
      let totalResults = 0;
      const results: SearchResult[] = [];

      // Function to create a search term pattern
      const createSearchPattern = (term: string) =>
        `%${term.toLowerCase().trim()}%`;
      const searchPattern = createSearchPattern(q);

      // Loading state skeleton rendered in the UI component

      try {
        // Search in publications if type is "all" or "publication"
        if (type === "all" || type === "publication") {
          const publicationResults = await ctx.db
            .select({
              id: publications.id,
              title: publications.title,
              description: publications.abstract,
              url: publications.slug,
              createdAt: publications.createdAt,
              updatedAt: publications.updatedAt,
              imageUrl: publications.thumbnailUrl,
            })
            .from(publications)
            .where(
              and(
                eq(publications.status, "published"),
                or(
                  like(publications.title, searchPattern),
                  like(publications.abstract, searchPattern),
                  like(publications.content, searchPattern),
                ),
              ),
            )
            .orderBy(desc(publications.publishedAt))
            .limit(type === "all" ? Math.floor(limit / 4) : limit)
            .offset(type === "all" ? 0 : offset);

          // Transform to SearchResult format
          const formattedPublications: SearchResult[] = publicationResults.map(
            (pub) => ({
              id: String(pub.id),
              title: pub.title as string,
              description: (pub.description as string) || "",
              url: `/publications/${pub.url}`,
              type: "publication",
              createdAt: pub.createdAt as Date,
              updatedAt: pub.updatedAt as Date,
              imageUrl: pub.imageUrl as string,
            }),
          );

          results.push(...formattedPublications);

          if (type === "publication") {
            // Get total count for publications only search
            const [countResult] = await ctx.db
              .select({
                count: sql`count(*)`,
              })
              .from(publications)
              .where(
                and(
                  eq(publications.status, "published"),
                  or(
                    like(publications.title, searchPattern),
                    like(publications.abstract, searchPattern),
                    like(publications.content, searchPattern),
                  ),
                ),
              );

            if (countResult) {
              totalResults = Number(countResult.count);
            }
          }
        }

        // Search in events if type is "all" or "event"
        if (type === "all" || type === "event") {
          const eventResults = await ctx.db
            .select({
              id: events.id,
              title: events.title,
              description: events.description,
              url: events.slug,
              createdAt: events.createdAt,
              updatedAt: events.updatedAt,
              imageUrl: events.thumbnailUrl,
            })
            .from(events)
            .where(
              and(
                or(eq(events.status, "upcoming"), eq(events.status, "ongoing")),
                or(
                  like(events.title, searchPattern),
                  like(events.description, searchPattern),
                  like(events.location, searchPattern),
                ),
              ),
            )
            .orderBy(desc(events.startDate))
            .limit(type === "all" ? Math.floor(limit / 4) : limit)
            .offset(type === "all" ? 0 : offset);

          // Transform to SearchResult format
          const formattedEvents: SearchResult[] = eventResults.map((event) => ({
            id: String(event.id),
            title: event.title as string,
            description: (event.description as string) || "",
            url: `/events/${event.url}`,
            type: "event",
            createdAt: event.createdAt as Date,
            updatedAt: event.updatedAt as Date,
            imageUrl: event.imageUrl as string,
          }));

          results.push(...formattedEvents);

          if (type === "event") {
            // Get total count for events only search
            const [countResult] = await ctx.db
              .select({
                count: sql`count(*)`,
              })
              .from(events)
              .where(
                and(
                  or(
                    eq(events.status, "upcoming"),
                    eq(events.status, "ongoing"),
                  ),
                  or(
                    like(events.title, searchPattern),
                    like(events.description, searchPattern),
                    like(events.location, searchPattern),
                  ),
                ),
              );

            if (countResult) {
              totalResults = Number(countResult.count);
            }
          }
        }

        // Search in policies if type is "all" or "policy"
        if (type === "all" || type === "policy") {
          const policyResults = await ctx.db
            .select({
              id: policies.id,
              title: policies.title,
              description: policies.summary,
              url: policies.slug,
              createdAt: policies.createdAt,
              updatedAt: policies.updatedAt,
              imageUrl: policies.thumbnailUrl,
            })
            .from(policies)
            .where(
              and(
                eq(policies.status, "published"),
                or(
                  like(policies.title, searchPattern),
                  like(policies.summary, searchPattern),
                  like(policies.content, searchPattern),
                ),
              ),
            )
            .orderBy(desc(policies.publishedAt))
            .limit(type === "all" ? Math.floor(limit / 4) : limit)
            .offset(type === "all" ? 0 : offset);

          // Transform to SearchResult format
          const formattedPolicies: SearchResult[] = policyResults.map(
            (policy) => ({
              id: String(policy.id),
              title: policy.title as string,
              description: (policy.description as string) || "",
              url: `/policy/${policy.url}`,
              type: "policy",
              createdAt: policy.createdAt as Date,
              updatedAt: policy.updatedAt as Date,
              imageUrl: policy.imageUrl as string,
            }),
          );

          results.push(...formattedPolicies);

          if (type === "policy") {
            // Get total count for policies only search
            const [countResult] = await ctx.db
              .select({
                count: sql`count(*)`,
              })
              .from(policies)
              .where(
                and(
                  eq(policies.status, "published"),
                  or(
                    like(policies.title, searchPattern),
                    like(policies.summary, searchPattern),
                    like(policies.content, searchPattern),
                  ),
                ),
              );

            if (countResult) {
              totalResults = Number(countResult.count);
            }
          }
        }

        // Search in team members/profiles if type is "all" or "member"
        if (type === "all" || type === "member") {
          const profileResults = await ctx.db
            .select({
              id: profiles.id,
              name: profiles.name,
              bio: profiles.bio,
              position: profiles.position,
              avatar: profiles.avatar,
              teamRole: profiles.teamRole,
            })
            .from(profiles)
            .where(
              and(
                eq(profiles.showOnWebsite, true),
                or(
                  like(profiles.name, searchPattern),
                  like(profiles.bio, searchPattern),
                  like(profiles.position, searchPattern),
                  like(profiles.teamRole, searchPattern),
                ),
              ),
            )
            .limit(type === "all" ? Math.floor(limit / 4) : limit)
            .offset(type === "all" ? 0 : offset);

          // Transform to SearchResult format
          const formattedProfiles: SearchResult[] = profileResults.map(
            (profile) => ({
              id: profile.id as string,
              title: profile.name as string,
              description: (profile.position ||
                profile.teamRole ||
                "") as string,
              url: `/team/${profile.id}`,
              type: "member",
              imageUrl: profile.avatar as string,
            }),
          );

          results.push(...formattedProfiles);

          if (type === "member") {
            // Get total count for profiles only search
            const [countResult] = await ctx.db
              .select({
                count: sql`count(*)`,
              })
              .from(profiles)
              .where(
                and(
                  eq(profiles.showOnWebsite, true),
                  or(
                    like(profiles.name, searchPattern),
                    like(profiles.bio, searchPattern),
                    like(profiles.position, searchPattern),
                    like(profiles.teamRole, searchPattern),
                  ),
                ),
              );

            if (countResult) {
              totalResults = Number(countResult.count);
            }
          }
        }

        // If doing an "all" search, get the total count across all entity types
        if (type === "all") {
          // Publication count
          const [pubCountResult] = await ctx.db
            .select({
              count: sql`count(*)`,
            })
            .from(publications)
            .where(
              and(
                eq(publications.status, "published"),
                or(
                  like(publications.title, searchPattern),
                  like(publications.abstract, searchPattern),
                  like(publications.content, searchPattern),
                ),
              ),
            );

          // Event count
          const [eventCountResult] = await ctx.db
            .select({
              count: sql`count(*)`,
            })
            .from(events)
            .where(
              and(
                or(eq(events.status, "upcoming"), eq(events.status, "ongoing")),
                or(
                  like(events.title, searchPattern),
                  like(events.description, searchPattern),
                  like(events.location, searchPattern),
                ),
              ),
            );

          // Policy count
          const [policyCountResult] = await ctx.db
            .select({
              count: sql`count(*)`,
            })
            .from(policies)
            .where(
              and(
                eq(policies.status, "published"),
                or(
                  like(policies.title, searchPattern),
                  like(policies.summary, searchPattern),
                  like(policies.content, searchPattern),
                ),
              ),
            );

          // Profile count
          const [profileCountResult] = await ctx.db
            .select({
              count: sql`count(*)`,
            })
            .from(profiles)
            .where(
              and(
                eq(profiles.showOnWebsite, true),
                or(
                  like(profiles.name, searchPattern),
                  like(profiles.bio, searchPattern),
                  like(profiles.position, searchPattern),
                  like(profiles.teamRole, searchPattern),
                ),
              ),
            );

          let pubCount = 0;
          let eventCount = 0;
          let policyCount = 0;
          let profileCount = 0;

          if (pubCountResult) pubCount = Number(pubCountResult.count);
          if (eventCountResult) eventCount = Number(eventCountResult.count);
          if (policyCountResult) policyCount = Number(policyCountResult.count);
          if (profileCountResult)
            profileCount = Number(profileCountResult.count);

          totalResults = pubCount + eventCount + policyCount + profileCount;
        }

        // Calculate total pages
        const totalPages = Math.ceil(totalResults / limit);

        return {
          results,
          totalResults,
          page,
          totalPages,
          query: q,
        };
      } catch (error) {
        console.error("Search error:", error);
        return {
          results: [],
          totalResults: 0,
          page,
          totalPages: 0,
          query: q,
        };
      }
    }),
});
