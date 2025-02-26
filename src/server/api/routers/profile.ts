import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { profiles } from "~/server/db/schema";

export const profileRouter = createTRPCRouter({
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;

    let profile = await ctx.db.query.profiles.findFirst({
      where: eq(profiles.id, ctx.user.id),
    });

    if (!profile && ctx.user) {
      const newProfiles = await ctx.db
        .insert(profiles)
        .values({
          id: ctx.user.id,
          name: ctx.user.fullName,
          avatar: ctx.user.imageUrl,
          bio: "",
          position: "",
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning();

      profile = newProfiles[0];
    }

    return profile;
  }),

  update: protectedProcedure
    .input(
      z.object({
        bio: z.string().optional(),
        position: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!user || !user.id) {
        throw new Error("Not authenticated");
      }

      await ctx.db
        .update(profiles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, user.id));

      return { success: true };
    }),
});
