import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  publications,
  publicationCategories,
  publicationTags,
} from "~/server/db/schema";

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

      if (!user || !user.id) {
        throw new Error("Not authenticated");
      }

      const [publication] = await ctx.db
        .insert(publications)
        .values({
          type: input.type,
          title: input.title,
          slug: input.title.toLowerCase().replace(/\s+/g, "-"),
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
    });
  }),
});
