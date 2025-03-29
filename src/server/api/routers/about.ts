import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  aboutOverview,
  aboutCards,
  historyMilestones,
  teamMembers,
  partners,
} from "~/server/db/schema";
import type {
  AboutOverviewWithCards,
  AboutOverviews,
  HistoryMilestones,
  TeamMembers,
  Partners,
  SectionType,
  TeamMemberCategory,
  PartnerCategory,
} from "~/lib/types/about";
import type { SQL } from "drizzle-orm";

export const aboutRouter = createTRPCRouter({
  // =========== ABOUT OVERVIEW SECTION (MISSION/VISION/VALUES) ===========

  // Get all overview sections (with cards)
  getOverviewSections: publicProcedure.query(
    async ({ ctx }): Promise<AboutOverviewWithCards[]> => {
      const sections = await ctx.db.query.aboutOverview.findMany({
        orderBy: (aboutOverviewTable, { asc }) => [
          asc(aboutOverviewTable.displayOrder),
        ],
        with: {
          cards: {
            orderBy: (aboutCardsTable, { asc }) => [
              asc(aboutCardsTable.displayOrder),
            ],
          },
        },
      });

      if (!sections) {
        return [];
      }

      return sections as AboutOverviewWithCards[];
    },
  ),

  // Get single overview section by type (with cards)
  getOverviewSection: publicProcedure
    .input(z.enum(["mission", "vision", "values", "history"]))
    .query(async ({ ctx, input }): Promise<AboutOverviewWithCards | null> => {
      const section = await ctx.db.query.aboutOverview.findFirst({
        where: eq(aboutOverview.section, input),
        with: {
          cards: {
            orderBy: (aboutCardsTable, { asc }) => [
              asc(aboutCardsTable.displayOrder),
            ],
          },
        },
      });

      if (!section) {
        return null;
      }

      return section as AboutOverviewWithCards;
    }),

  // Create or update overview section
  upsertOverviewSection: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        section: z.enum(["mission", "vision", "values", "history"]),
        title: z.string(),
        content: z.string().optional(),
        displayOrder: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (id) {
        // Update existing section
        return ctx.db
          .update(aboutOverview)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(aboutOverview.id, id))
          .returning();
      }

      // Create new section
      return ctx.db
        .insert(aboutOverview)
        .values({
          ...data,
          updatedAt: new Date(),
        })
        .returning();
    }),

  // Delete overview section
  deleteOverviewSection: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(aboutOverview)
        .where(eq(aboutOverview.id, input))
        .returning();
    }),

  // Create card for section
  createCard: protectedProcedure
    .input(
      z.object({
        sectionId: z.number(),
        title: z.string(),
        content: z.string().optional(),
        icon: z.string().optional(),
        displayOrder: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(aboutCards).values(input).returning();
    }),

  // Update card
  updateCard: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string().optional(),
        icon: z.string().optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db
        .update(aboutCards)
        .set(data)
        .where(eq(aboutCards.id, id))
        .returning();
    }),

  // Delete card
  deleteCard: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(aboutCards)
        .where(eq(aboutCards.id, input))
        .returning();
    }),

  // =========== HISTORY MILESTONES ===========

  // Get all history milestones
  getHistoryMilestones: publicProcedure.query(
    async ({ ctx }): Promise<HistoryMilestones> => {
      return ctx.db.query.historyMilestones.findMany({
        orderBy: (historyMilestonesTable, { asc }) => [
          asc(historyMilestonesTable.displayOrder),
        ],
      });
    },
  ),

  // Create history milestone
  createHistoryMilestone: protectedProcedure
    .input(
      z.object({
        year: z.string(),
        title: z.string(),
        content: z.string().optional(),
        displayOrder: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(historyMilestones)
        .values({
          ...input,
          updatedAt: new Date(),
        })
        .returning();
    }),

  // Update history milestone
  updateHistoryMilestone: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        year: z.string().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db
        .update(historyMilestones)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(historyMilestones.id, id))
        .returning();
    }),

  // Delete history milestone
  deleteHistoryMilestone: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(historyMilestones)
        .where(eq(historyMilestones.id, input))
        .returning();
    }),

  // =========== TEAM MEMBERS ===========

  // Get all team members
  getAllTeamMembers: publicProcedure.query(
    async ({ ctx }): Promise<TeamMembers> => {
      return ctx.db.query.teamMembers.findMany({
        orderBy: (teamMembersTable, { asc }) => [
          asc(teamMembersTable.displayOrder),
        ],
      });
    },
  ),

  // Get team members by category
  getTeamMembersByCategory: publicProcedure
    .input(z.enum(["leadership", "faculty", "students"]))
    .query(async ({ ctx, input }): Promise<TeamMembers> => {
      return ctx.db.query.teamMembers.findMany({
        where: eq(teamMembers.category, input),
        orderBy: (teamMembersTable, { asc }) => [
          asc(teamMembersTable.displayOrder),
        ],
      });
    }),

  // Create team member
  createTeamMember: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.enum(["leadership", "faculty", "students"]),
        displayOrder: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(teamMembers)
        .values({
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }),

  // Update team member
  updateTeamMember: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.enum(["leadership", "faculty", "students"]).optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db
        .update(teamMembers)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(teamMembers.id, id))
        .returning();
    }),

  // Delete team member
  deleteTeamMember: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(teamMembers)
        .where(eq(teamMembers.id, input))
        .returning();
    }),

  // =========== PARTNERS ===========

  // Get all partners
  getAllPartners: publicProcedure.query(async ({ ctx }): Promise<Partners> => {
    return ctx.db.query.partners.findMany({
      orderBy: (partnersTable, { asc }) => [asc(partnersTable.displayOrder)],
    });
  }),

  // Get partners by category
  getPartnersByCategory: publicProcedure
    .input(z.enum(["academic", "policy", "civil_society"]))
    .query(async ({ ctx, input }): Promise<Partners> => {
      return ctx.db.query.partners.findMany({
        where: eq(partners.category, input),
        orderBy: (partnersTable, { asc }) => [asc(partnersTable.displayOrder)],
      });
    }),

  // Create partner
  createPartner: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        category: z.enum(["academic", "policy", "civil_society"]),
        displayOrder: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(partners)
        .values({
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }),

  // Update partner
  updatePartner: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        category: z.enum(["academic", "policy", "civil_society"]).optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db
        .update(partners)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(partners.id, id))
        .returning();
    }),

  // Delete partner
  deletePartner: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(partners).where(eq(partners.id, input)).returning();
    }),
});
