import { z } from "zod";
import { eq, desc, asc, and } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { policies, advocacyCampaigns, caseStudies } from "~/server/db/schema";
import type {
  Policy,
  Policies,
  CaseStudy,
  CaseStudies,
  AdvocacyCampaign,
  AdvocacyCampaigns,
  PolicyStatus,
  PolicyCategory,
  AdvocacyCampaignStatus,
} from "~/lib/types/policy";

export const policyRouter = createTRPCRouter({
  // =========== POLICIES ===========

  // Get all policies
  getAllPolicies: publicProcedure.query(async ({ ctx }): Promise<Policies> => {
    return ctx.db.query.policies.findMany({
      orderBy: (policiesTable, { desc }) => [desc(policiesTable.publishedAt)],
    });
  }),

  // Get policies by category
  getPoliciesByCategory: publicProcedure
    .input(z.enum(["economic", "social", "environmental"]))
    .query(async ({ ctx, input }): Promise<Policies> => {
      return ctx.db.query.policies.findMany({
        where: eq(policies.category, input),
        orderBy: (policiesTable, { desc }) => [desc(policiesTable.publishedAt)],
      });
    }),

  // Get policy by slug
  getPolicyBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }): Promise<Policy | null> => {
      const policy = await ctx.db.query.policies.findFirst({
        where: eq(policies.slug, input),
      });

      if (!policy) {
        return null;
      }

      return policy;
    }),

  // Create policy
  createPolicy: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string().optional(),
        summary: z.string().optional(),
        content: z.string(),
        category: z.enum(["economic", "social", "environmental"]),
        thumbnailUrl: z.string().optional(),
        authorId: z.string().optional(),
        status: z.enum(["draft", "published"]).optional(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Generate slug if not provided
      const slug =
        input.slug ??
        input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      // Create policy
      return ctx.db
        .insert(policies)
        .values({
          ...input,
          slug,
          status: input.status ?? "draft",
          publishedAt: input.publishedAt || null,
          createdAt: new Date(),
        })
        .returning();
    }),

  // Update policy
  updatePolicy: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        summary: z.string().optional(),
        content: z.string().optional(),
        category: z.enum(["economic", "social", "environmental"]).optional(),
        thumbnailUrl: z.string().optional(),
        authorId: z.string().optional(),
        status: z.enum(["draft", "published"]).optional(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db
        .update(policies)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(policies.id, id))
        .returning();
    }),

  // Delete policy
  deletePolicy: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(policies).where(eq(policies.id, input)).returning();
    }),

  // =========== CASE STUDIES ===========

  // Get case studies for policy
  getCaseStudies: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }): Promise<CaseStudies> => {
      return ctx.db.query.caseStudies.findMany({
        where: eq(caseStudies.policyId, input),
        orderBy: (caseStudiesTable, { desc }) => [
          desc(caseStudiesTable.publishedAt),
        ],
      });
    }),

  // =========== ADVOCACY CAMPAIGNS ===========

  // Get all advocacy campaigns
  getAllAdvocacyCampaigns: publicProcedure.query(
    async ({ ctx }): Promise<AdvocacyCampaigns> => {
      const campaigns = (await ctx.db.query.advocacyCampaigns.findMany({
        orderBy: (campaignsTable, { asc }) => [
          asc(campaignsTable.displayOrder),
        ],
      })) as unknown as AdvocacyCampaigns;
      // Parse achievements from JSON string
      return campaigns.map((campaign) => ({
        ...campaign,
        achievements: campaign.achievements
          ? JSON.parse(campaign.achievements as unknown as string)
          : undefined,
      }));
    },
  ),

  // Get advocacy campaigns by status
  getAdvocacyCampaignsByStatus: publicProcedure
    .input(z.enum(["active", "completed", "planned"]))
    .query(async ({ ctx, input }): Promise<AdvocacyCampaigns> => {
      const campaigns = (await ctx.db.query.advocacyCampaigns.findMany({
        where: eq(advocacyCampaigns.status, input),
        orderBy: (campaignsTable, { asc }) => [
          asc(campaignsTable.displayOrder),
        ],
      })) as unknown as AdvocacyCampaigns;

      // Parse achievements from JSON string
      return campaigns.map((campaign) => ({
        ...campaign,
        achievements: campaign.achievements
          ? JSON.parse(campaign.achievements as unknown as string)
          : undefined,
      }));
    }),

  // Create advocacy campaign
  createAdvocacyCampaign: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(["active", "completed", "planned"]),
        imageUrl: z.string().optional(),
        achievements: z.array(z.string()).optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { achievements, ...rest } = input;

      // Stringify achievements array to store as JSON
      const achievementsJson = achievements
        ? JSON.stringify(achievements)
        : null;

      const result = await ctx.db
        .insert(advocacyCampaigns)
        .values({
          ...rest,
          achievements: achievementsJson,
          createdAt: new Date(),
        })
        .returning();

      // Return with parsed achievements
      return result.map((campaign) => ({
        ...campaign,
        achievements: campaign.achievements
          ? JSON.parse(campaign.achievements)
          : undefined,
      }));
    }),

  // Update advocacy campaign
  updateAdvocacyCampaign: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
        imageUrl: z.string().optional(),
        achievements: z.array(z.string()).optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, achievements, ...data } = input;

      // Prepare update data
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date(),
      };

      // Handle achievements if provided
      if (achievements !== undefined) {
        updateData.achievements = JSON.stringify(achievements);
      }

      const result = await ctx.db
        .update(advocacyCampaigns)
        .set(updateData)
        .where(eq(advocacyCampaigns.id, id))
        .returning();

      // Return with parsed achievements
      return result.map((campaign) => ({
        ...campaign,
        achievements: campaign.achievements
          ? JSON.parse(campaign.achievements)
          : undefined,
      }));
    }),

  // Delete advocacy campaign
  deleteAdvocacyCampaign: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(advocacyCampaigns)
        .where(eq(advocacyCampaigns.id, input))
        .returning();
    }),
});
