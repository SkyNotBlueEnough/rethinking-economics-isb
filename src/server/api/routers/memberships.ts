import { z } from "zod";
import { and, asc, eq, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  membershipTypes,
  memberships,
  faqs,
  collaborationCards,
} from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { checkUserIsAdmin } from "~/lib/auth-utils";

// We need to create a FAQs table in schema first
// For now, let's assume we have a table called 'faqs'
// with the following structure:
// id: number, question: string, answer: string, category: string, displayOrder: number

export const membershipRouter = createTRPCRouter({
  // =========== MEMBERSHIP TYPES ===========

  // Get all membership types
  getAllMembershipTypes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.membershipTypes.findMany({
      orderBy: [asc(membershipTypes.id)],
    });
  }),

  // Get a membership type by ID
  getMembershipTypeById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input: id }) => {
      const result = await ctx.db.query.membershipTypes.findFirst({
        where: eq(membershipTypes.id, id),
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership type not found",
        });
      }

      return result;
    }),

  // Create a new membership type (admin only)
  createMembershipType: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        description: z.string().max(1000).optional(),
        benefits: z.string().max(1000).optional(),
        requiresApproval: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create membership types",
        });
      }

      const result = await ctx.db
        .insert(membershipTypes)
        .values({
          name: input.name,
          description: input.description,
          benefits: input.benefits,
          requiresApproval: input.requiresApproval,
        })
        .returning();

      return result[0];
    }),

  // Update a membership type (admin only)
  updateMembershipType: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).max(100),
        description: z.string().max(1000).optional(),
        benefits: z.string().max(1000).optional(),
        requiresApproval: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update membership types",
        });
      }

      const result = await ctx.db
        .update(membershipTypes)
        .set({
          name: input.name,
          description: input.description,
          benefits: input.benefits,
          requiresApproval: input.requiresApproval,
        })
        .where(eq(membershipTypes.id, input.id))
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership type not found",
        });
      }

      return result[0];
    }),

  // Delete a membership type (admin only)
  deleteMembershipType: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete membership types",
        });
      }

      // First check if there are memberships with this type
      const existingMemberships = await ctx.db.query.memberships.findFirst({
        where: eq(memberships.membershipTypeId, id),
      });

      if (existingMemberships) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete a membership type that is in use",
        });
      }

      // Delete the membership type
      await ctx.db.delete(membershipTypes).where(eq(membershipTypes.id, id));

      return { success: true, id };
    }),

  // =========== MEMBERSHIPS ===========

  // Get all memberships (admin only)
  getAllMemberships: protectedProcedure.query(async ({ ctx }) => {
    // Get user ID from the context
    const userId = ctx.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    // Verify admin status
    const isAdmin = await checkUserIsAdmin(userId);
    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can view all memberships",
      });
    }

    return await ctx.db.query.memberships.findMany({
      with: {
        membershipType: true,
        profile: true,
      },
      orderBy: [asc(memberships.createdAt)],
    });
  }),

  // Get memberships for current user
  getUserMemberships: protectedProcedure.query(async ({ ctx }) => {
    // Get user ID from the context
    const userId = ctx.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    return await ctx.db.query.memberships.findMany({
      where: eq(memberships.userId, userId),
      with: {
        membershipType: true,
      },
      orderBy: [asc(memberships.createdAt)],
    });
  }),

  // Apply for a membership
  applyForMembership: protectedProcedure
    .input(
      z.object({
        membershipTypeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if membership type exists
      const membershipType = await ctx.db.query.membershipTypes.findFirst({
        where: eq(membershipTypes.id, input.membershipTypeId),
      });

      if (!membershipType) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership type not found",
        });
      }

      // Check if user already has an active membership of this type
      const existingMembership = await ctx.db.query.memberships.findFirst({
        where: and(
          eq(memberships.userId, userId),
          eq(memberships.membershipTypeId, input.membershipTypeId),
          eq(memberships.status, "approved"),
        ),
      });

      if (existingMembership) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have this membership",
        });
      }

      // Create new membership application
      const result = await ctx.db
        .insert(memberships)
        .values({
          userId: userId,
          membershipTypeId: input.membershipTypeId,
          status: membershipType.requiresApproval ? "pending" : "approved",
          startDate: membershipType.requiresApproval ? undefined : new Date(),
        })
        .returning();

      return result[0];
    }),

  // Update membership status (admin only)
  updateMembershipStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update membership status",
        });
      }

      const now = new Date();

      const result = await ctx.db
        .update(memberships)
        .set({
          status: input.status,
          startDate: input.status === "approved" ? now : undefined,
          // If status is approved, set end date to 1 year from now
          endDate:
            input.status === "approved"
              ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
              : undefined,
          updatedAt: now,
        })
        .where(eq(memberships.id, input.id))
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership not found",
        });
      }

      return result[0];
    }),

  // Cancel membership (user can cancel their own, admin can cancel any)
  cancelMembership: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const membership = await ctx.db.query.memberships.findFirst({
        where: eq(memberships.id, id),
      });

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership not found",
        });
      }

      // Check if user is canceling their own membership or is an admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (membership.userId !== userId && !isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only cancel your own memberships",
        });
      }

      // Instead of deleting, just set status to rejected and end date to now
      const result = await ctx.db
        .update(memberships)
        .set({
          status: "rejected",
          endDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(memberships.id, id))
        .returning();

      return result[0];
    }),

  // =========== FAQS ===========

  // Get all FAQs
  getAllFAQs: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.faqs.findMany({
      orderBy: [asc(faqs.displayOrder), asc(faqs.id)],
    });
  }),

  // Get FAQs by category
  getFAQsByCategory: publicProcedure
    .input(z.enum(["collaboration", "membership"]))
    .query(async ({ ctx, input: category }) => {
      return await ctx.db.query.faqs.findMany({
        where: eq(faqs.category, category),
        orderBy: [asc(faqs.displayOrder), asc(faqs.id)],
      });
    }),

  // Create FAQ (admin only)
  createFAQ: protectedProcedure
    .input(
      z.object({
        question: z.string().min(10).max(500),
        answer: z.string().min(20).max(2000),
        category: z.enum(["collaboration", "membership"]),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create FAQs",
        });
      }

      const result = await ctx.db
        .insert(faqs)
        .values({
          question: input.question,
          answer: input.answer,
          category: input.category,
          displayOrder: input.displayOrder ?? 0,
        })
        .returning();

      return result[0];
    }),

  // Update FAQ (admin only)
  updateFAQ: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string().min(10).max(500),
        answer: z.string().min(20).max(2000),
        category: z.enum(["collaboration", "membership"]),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update FAQs",
        });
      }

      const result = await ctx.db
        .update(faqs)
        .set({
          question: input.question,
          answer: input.answer,
          category: input.category,
          displayOrder: input.displayOrder ?? 0,
        })
        .where(eq(faqs.id, input.id))
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "FAQ not found",
        });
      }

      return result[0];
    }),

  // Delete FAQ (admin only)
  deleteFAQ: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete FAQs",
        });
      }

      await ctx.db.delete(faqs).where(eq(faqs.id, id));

      return { success: true, id };
    }),

  // =========== COLLABORATION CARDS ===========

  // Get all collaboration cards
  getAllCollaborationCards: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.collaborationCards.findMany({
      orderBy: [
        asc(collaborationCards.displayOrder),
        asc(collaborationCards.id),
      ],
    });
  }),

  // Get a collaboration card by ID
  getCollaborationCardById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input: id }) => {
      const result = await ctx.db.query.collaborationCards.findFirst({
        where: eq(collaborationCards.id, id),
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collaboration card not found",
        });
      }

      return result;
    }),

  // Create a collaboration card (admin only)
  createCollaborationCard: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(256),
        description: z.string().max(1000).optional(),
        iconName: z.string().max(100).optional(),
        bulletPoints: z.string().max(1000).optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create collaboration cards",
        });
      }

      const result = await ctx.db
        .insert(collaborationCards)
        .values({
          title: input.title,
          description: input.description,
          iconName: input.iconName,
          bulletPoints: input.bulletPoints,
          displayOrder: input.displayOrder ?? 0,
        })
        .returning();

      return result[0];
    }),

  // Update a collaboration card (admin only)
  updateCollaborationCard: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).max(256),
        description: z.string().max(1000).optional(),
        iconName: z.string().max(100).optional(),
        bulletPoints: z.string().max(1000).optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update collaboration cards",
        });
      }

      const result = await ctx.db
        .update(collaborationCards)
        .set({
          title: input.title,
          description: input.description,
          iconName: input.iconName,
          bulletPoints: input.bulletPoints,
          displayOrder: input.displayOrder ?? 0,
        })
        .where(eq(collaborationCards.id, input.id))
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collaboration card not found",
        });
      }

      return result[0];
    }),

  // Delete a collaboration card (admin only)
  deleteCollaborationCard: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: id }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Verify admin status
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete collaboration cards",
        });
      }

      await ctx.db
        .delete(collaborationCards)
        .where(eq(collaborationCards.id, id));

      return { success: true, id };
    }),
});
