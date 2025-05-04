import { z } from "zod";
import { eq, desc, sql, and } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  publications,
  publicationCategories,
  publicationTags,
  profiles,
  categories,
} from "~/server/db/schema";
import type {
  PublicationWithAuthor,
  PublicationsWithAuthor,
} from "~/lib/types/publications";

export const publicationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "research_paper",
          "policy_brief",
          "opinion",
          "blog_post",
        ]),
        title: z.string(),
        content: z.string(),
        abstract: z.string().optional(),
        pdfUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        categoryId: z.number(),
        tagId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      const [publication] = await ctx.db
        .insert(publications)
        .values({
          type: input.type,
          title: input.title,
          slug: input.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
          content: input.content,
          authorId: user.id,
          status: "published",
          abstract: input.abstract ?? "",
          pdfUrl: input.pdfUrl ?? "",
          thumbnailUrl: input.thumbnailUrl ?? "",
          featuredOrder: null,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return publication;
    }),

  createSubmission: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        abstract: z.string().optional(),
        content: z.string(),
        type: z.enum([
          "research_paper",
          "policy_brief",
          "opinion",
          "blog_post",
        ]),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      const [publication] = await ctx.db
        .insert(publications)
        .values({
          type: input.type,
          title: input.title,
          slug: input.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
          content: input.content,
          authorId: user.id,
          status: "pending_review", // Hardcoded status for user submissions
          abstract: input.abstract ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return publication;
    }),

  getUserPublications: protectedProcedure.query(
    async ({ ctx }): Promise<PublicationsWithAuthor> => {
      const { user } = ctx;

      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      return await ctx.db
        .select({
          id: publications.id,
          title: publications.title,
          slug: publications.slug,
          type: publications.type,
          status: publications.status,
          thumbnailUrl: publications.thumbnailUrl,
          publishedAt: publications.publishedAt,
          createdAt: publications.createdAt,
          author: {
            id: profiles.id,
            name: profiles.name,
          },
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .where(eq(publications.authorId, user.id))
        .orderBy(desc(publications.createdAt));
    },
  ),

  // Get all publications
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.publications.findMany({
      orderBy: (publications, { desc }) => [desc(publications.createdAt)],
    });
  }),

  // Get single publication by slug
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.query.publications.findFirst({
      where: eq(publications.slug, input),
      with: {
        author: true,
      },
    }) as Promise<PublicationWithAuthor>;
  }),

  // Get related publications by type or category
  getRelated: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().min(1).max(6).default(3),
      }),
    )
    .query(async ({ ctx, input }): Promise<PublicationsWithAuthor> => {
      // First, get the current publication to find its type and categories
      const currentPublication = await ctx.db.query.publications.findFirst({
        where: eq(publications.slug, input.slug),
        with: {
          categories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!currentPublication) {
        return [];
      }

      // Get publications with the same type, excluding the current one
      return await ctx.db
        .select({
          id: publications.id,
          title: publications.title,
          slug: publications.slug,
          thumbnailUrl: publications.thumbnailUrl,
          publishedAt: publications.publishedAt,
          author: {
            id: profiles.id,
            name: profiles.name,
          },
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .where(
          and(
            eq(publications.status, "published"),
            eq(publications.type, currentPublication.type),
            sql`${publications.id} != ${currentPublication.id}`,
          ),
        )
        .orderBy(desc(publications.publishedAt))
        .limit(input.limit);
    }),

  // Get publications by type
  getByType: publicProcedure
    .input(
      z.object({
        type: z.enum([
          "research_paper",
          "policy_brief",
          "opinion",
          "blog_post",
        ]),
        limit: z.number().min(1).max(10).default(4),
      }),
    )
    .query(async ({ ctx, input }): Promise<PublicationsWithAuthor> => {
      return await ctx.db
        .select({
          id: publications.id,
          title: publications.title,
          slug: publications.slug,
          thumbnailUrl: publications.thumbnailUrl,
          publishedAt: publications.publishedAt,
          author: {
            id: profiles.id,
            name: profiles.name,
          },
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .where(
          and(
            eq(publications.status, "published"),
            eq(publications.type, input.type),
          ),
        )
        .orderBy(desc(publications.publishedAt))
        .limit(input.limit);
    }),

  // Get all publication types with their counts
  getAllTypes: publicProcedure.query(async ({ ctx }) => {
    const typesWithCounts = await ctx.db
      .select({
        type: publications.type,
        count: sql`count(*)`,
      })
      .from(publications)
      .where(eq(publications.status, "published"))
      .groupBy(publications.type)
      .orderBy(desc(sql`count(*)`));

    // Map the types to more user-friendly names
    return typesWithCounts.map((item) => ({
      typeId: item.type,
      count: Number(item.count),
      displayName: getPublicationTypeDisplayName(item.type),
    }));
  }),

  // Get publications by category
  getByCategory: publicProcedure
    .input(
      z.object({
        categorySlug: z.string(),
        limit: z.number().min(1).max(10).default(4),
      }),
    )
    .query(async ({ ctx, input }): Promise<PublicationsWithAuthor> => {
      return await ctx.db
        .select({
          id: publications.id,
          title: publications.title,
          slug: publications.slug,
          thumbnailUrl: publications.thumbnailUrl,
          publishedAt: publications.publishedAt,
          author: {
            id: profiles.id,
            name: profiles.name,
          },
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .leftJoin(
          publicationCategories,
          eq(publications.id, publicationCategories.publicationId),
        )
        .leftJoin(
          categories,
          eq(publicationCategories.categoryId, categories.id),
        )
        .where(
          and(
            eq(publications.status, "published"),
            eq(categories.slug, input.categorySlug),
          ),
        )
        .orderBy(desc(publications.publishedAt))
        .limit(input.limit);
    }),

  // Get all categories with their publication counts
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categoriesWithCounts = await ctx.db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        publicationCount: sql`count(${publicationCategories.publicationId})`,
      })
      .from(categories)
      .leftJoin(
        publicationCategories,
        eq(categories.id, publicationCategories.categoryId),
      )
      .leftJoin(
        publications,
        eq(publicationCategories.publicationId, publications.id),
      )
      .where(eq(publications.status, "published"))
      .groupBy(categories.id)
      .having(sql`count(${publicationCategories.publicationId}) > 0`)
      .orderBy(desc(sql`count(${publicationCategories.publicationId})`));

    return categoriesWithCounts;
  }),

  getFeatured: publicProcedure.query(
    async ({ ctx }): Promise<PublicationsWithAuthor> => {
      return await ctx.db
        .select({
          id: publications.id,
          title: publications.title,
          slug: publications.slug,
          thumbnailUrl: publications.thumbnailUrl,
          publishedAt: publications.publishedAt,
          author: {
            id: profiles.id,
            name: profiles.name,
          },
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .where(eq(publications.status, "published"))
        .orderBy(desc(publications.featuredOrder))
        .limit(4);
    },
  ),

  getPopular: publicProcedure.query(
    async ({ ctx }): Promise<PublicationsWithAuthor> => {
      return await ctx.db
        .select({
          id: publications.id,
          title: publications.title,
          slug: publications.slug,
          thumbnailUrl: publications.thumbnailUrl,
          publishedAt: publications.publishedAt,
          author: {
            id: profiles.id,
            name: profiles.name,
          },
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .where(eq(publications.status, "published"))
        .orderBy(desc(publications.publishedAt))
        .limit(6);
    },
  ),
});

// Helper function to get display names for publication types
function getPublicationTypeDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    research_paper: "Research Papers",
    policy_brief: "Policy Briefs",
    opinion: "Opinion Pieces",
    blog_post: "Blog Posts",
  };

  return displayNames[type] ?? type;
}
