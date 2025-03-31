import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { contactSubmissions } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const contactRouter = createTRPCRouter({
  // Get all contact submissions
  getSubmissions: protectedProcedure.query(async ({ ctx }) => {
    const submissions = await ctx.db.query.contactSubmissions.findMany({
      orderBy: (submissions, { desc }) => [desc(submissions.createdAt)],
    });

    return submissions.map((submission) => ({
      ...submission,
      // Convert dates to ISO string format
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt
        ? submission.updatedAt.toISOString()
        : null,
    }));
  }),

  // Get a single contact submission by ID
  getSubmissionById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.query.contactSubmissions.findFirst({
        where: eq(contactSubmissions.id, input.id),
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      return {
        ...submission,
        createdAt: submission.createdAt.toISOString(),
        updatedAt: submission.updatedAt
          ? submission.updatedAt.toISOString()
          : null,
      };
    }),

  // Update submission status
  updateSubmissionStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "in_progress", "resolved"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(contactSubmissions)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(contactSubmissions.id, input.id));

      return { success: true };
    }),
});
