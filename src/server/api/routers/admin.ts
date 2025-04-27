import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, like, inArray } from "drizzle-orm";
import type { CreateProfileInput } from "~/lib/types/admin";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  profiles,
  publications,
  publicationCategories,
  publicationTags,
  categories,
  tags,
} from "~/server/db/schema";
import { checkUserIsAdmin } from "~/lib/auth-utils";

export const rejectionReasonSchema = z.object({
  reason: z.string().min(1),
  details: z.string().optional(),
});

export const publicationModificationSchema = z.object({
  title: z.string().optional(),
  abstract: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export const adminRouter = createTRPCRouter({
  // Get all publications with filter options
  getPublications: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["all", "draft", "pending_review", "published", "rejected"])
          .optional()
          .default("all"),
        search: z.string().optional(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access this resource",
        });
      }

      // Build the query
      let query = db
        .select({
          publication: publications,
          author: profiles,
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .orderBy(desc(publications.createdAt));

      // Apply status filter if not "all"
      if (input.status !== "all") {
        query = query.where(
          eq(publications.status, input.status),
        ) as typeof query;
      }

      // Apply search filter
      if (input.search) {
        query = query.where(
          like(publications.title, `%${input.search}%`),
        ) as typeof query;
      }

      // Execute query with pagination
      const results = await query.limit(input.limit).offset(input.offset);

      return results.map((r) => ({
        ...r.publication,
        author: r.author,
      }));
    }),

  // Get a single publication by ID with all details
  getPublicationById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access this resource",
        });
      }

      // Get the publication with author
      const result = await db
        .select({
          publication: publications,
          author: profiles,
        })
        .from(publications)
        .leftJoin(profiles, eq(publications.authorId, profiles.id))
        .where(eq(publications.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Publication not found",
        });
      }

      // Get categories and tags
      const publicationCats = await db
        .select({
          category: categories,
        })
        .from(publicationCategories)
        .innerJoin(
          categories,
          eq(publicationCategories.categoryId, categories.id),
        )
        .where(eq(publicationCategories.publicationId, input.id));

      const publicationTgs = await db
        .select({
          tag: tags,
        })
        .from(publicationTags)
        .innerJoin(tags, eq(publicationTags.tagId, tags.id))
        .where(eq(publicationTags.publicationId, input.id));

      return {
        ...result[0]?.publication,
        author: result[0]?.author,
        categories: publicationCats.map((pc) => pc.category),
        tags: publicationTgs.map((pt) => pt.tag),
      };
    }),

  // Approve a publication
  approvePublication: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        modifications: publicationModificationSchema.optional(),
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can approve publications",
        });
      }

      // Start a transaction for all database operations
      return await db.transaction(async (tx) => {
        // Apply modifications if provided
        if (input.modifications) {
          const updateData: Record<string, unknown> = {};

          if (input.modifications.title) {
            updateData.title = input.modifications.title;
          }

          if (input.modifications.abstract) {
            updateData.abstract = input.modifications.abstract;
          }

          if (input.modifications.content) {
            updateData.content = input.modifications.content;
          }

          // Update the publication with modifications
          if (Object.keys(updateData).length > 0) {
            await tx
              .update(publications)
              .set(updateData)
              .where(eq(publications.id, input.id));
          }

          // Update tags if provided
          if (input.modifications.tags) {
            // Get tag IDs, creating new tags if needed
            const tagIds = await Promise.all(
              input.modifications.tags.map(async (tagName) => {
                const existingTag = await tx
                  .select()
                  .from(tags)
                  .where(eq(tags.name, tagName))
                  .limit(1);

                if (existingTag.length > 0) {
                  return existingTag[0]?.id;
                }

                // Create new tag
                const slug = tagName.toLowerCase().replace(/\s+/g, "-");
                const [newTag] = await tx
                  .insert(tags)
                  .values({ name: tagName, slug })
                  .returning({ id: tags.id });

                return newTag?.id;
              }),
            );

            // Delete old tags
            await tx
              .delete(publicationTags)
              .where(eq(publicationTags.publicationId, input.id));

            // Insert new tags
            for (const tagId of tagIds) {
              if (tagId) {
                await tx.insert(publicationTags).values({
                  publicationId: input.id,
                  tagId,
                });
              }
            }
          }

          // Update categories if provided
          if (input.modifications.categories) {
            const categoryIds = await tx
              .select({ id: categories.id })
              .from(categories)
              .where(inArray(categories.name, input.modifications.categories));

            // Delete old categories
            await tx
              .delete(publicationCategories)
              .where(eq(publicationCategories.publicationId, input.id));

            // Insert new categories
            for (const category of categoryIds) {
              await tx.insert(publicationCategories).values({
                publicationId: input.id,
                categoryId: category.id,
              });
            }
          }
        }

        // Update status to published and set published date
        await tx
          .update(publications)
          .set({
            status: "published",
            publishedAt: new Date(),
          })
          .where(eq(publications.id, input.id));

        // Return the updated publication
        const updated = await tx
          .select()
          .from(publications)
          .where(eq(publications.id, input.id))
          .limit(1);

        return updated[0];
      });
    }),

  // Reject a publication
  rejectPublication: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        rejectionReason: rejectionReasonSchema,
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can reject publications",
        });
      }

      // Get the original content
      const originalPublication = await db
        .select({ content: publications.content })
        .from(publications)
        .where(eq(publications.id, input.id))
        .limit(1);

      if (!originalPublication.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Publication not found",
        });
      }

      const originalContent = originalPublication[0]?.content;

      // Update publication status to rejected
      await db
        .update(publications)
        .set({
          status: "rejected",
          // Store rejection reason in the content field with a special format
          // In a real app, you might want to create a separate table for rejection reasons
          content: JSON.stringify({
            originalContent,
            rejectionReason: input.rejectionReason,
          }),
        })
        .where(eq(publications.id, input.id));

      // Return the updated publication
      const updated = await db
        .select()
        .from(publications)
        .where(eq(publications.id, input.id))
        .limit(1);

      return updated[0];
    }),

  // Get all users
  getUsers: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get user ID from the context
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can access user list",
        });
      }

      // Build query
      let query = db.select().from(profiles).orderBy(desc(profiles.createdAt));

      // Apply search filter
      if (input.search) {
        query = query.where(
          like(profiles.name, `%${input.search}%`),
        ) as typeof query;
      }

      // Execute query with pagination
      return await query.limit(input.limit).offset(input.offset);
    }),

  // Delete a publication
  deletePublication: protectedProcedure
    .input(
      z.object({
        id: z.number(),
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete publications",
        });
      }

      return await db.transaction(async (tx) => {
        // First delete associated tags
        await tx
          .delete(publicationTags)
          .where(eq(publicationTags.publicationId, input.id));

        // Then delete associated categories
        await tx
          .delete(publicationCategories)
          .where(eq(publicationCategories.publicationId, input.id));

        // Finally delete the publication
        await tx.delete(publications).where(eq(publications.id, input.id));

        return { success: true };
      });
    }),

  // Update a publication
  updatePublication: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        authorId: z.string().optional(),
        title: z.string().optional(),
        abstract: z.string().optional(),
        content: z.string().optional(),
        type: z
          .enum(["research_paper", "policy_brief", "opinion", "blog_post"])
          .optional(),
        status: z
          .enum(["draft", "pending_review", "published", "rejected"])
          .optional(),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update publications",
        });
      }

      return await db.transaction(async (tx) => {
        // Update publication basic fields
        const updateData: Record<string, unknown> = {};

        if (input.title) {
          updateData.title = input.title;
          // Update slug if title changes
          updateData.slug = input.title.toLowerCase().replace(/\s+/g, "-");
        }

        if (input.abstract !== undefined) {
          updateData.abstract = input.abstract;
        }

        if (input.content !== undefined) {
          updateData.content = input.content;
        }

        if (input.type) {
          updateData.type = input.type;
        }

        if (input.status) {
          updateData.status = input.status;

          // If changing to published, set the publishedAt date
          if (input.status === "published") {
            updateData.publishedAt = new Date();
          }
        }

        if (input.authorId) {
          updateData.authorId = input.authorId;
        }

        // Update the publication if we have any fields to update
        if (Object.keys(updateData).length > 0) {
          await tx
            .update(publications)
            .set(updateData)
            .where(eq(publications.id, input.id));
        }

        // Update tags if provided
        if (input.tags) {
          // Get tag IDs, creating new tags if needed
          const tagIds = await Promise.all(
            input.tags.map(async (tagName) => {
              const existingTag = await tx
                .select()
                .from(tags)
                .where(eq(tags.name, tagName))
                .limit(1);

              if (existingTag.length > 0) {
                return existingTag[0]?.id;
              }

              // Create new tag
              const slug = tagName.toLowerCase().replace(/\s+/g, "-");
              const [newTag] = await tx
                .insert(tags)
                .values({ name: tagName, slug })
                .returning({ id: tags.id });

              return newTag?.id;
            }),
          );

          // Delete old tags
          await tx
            .delete(publicationTags)
            .where(eq(publicationTags.publicationId, input.id));

          // Insert new tags
          for (const tagId of tagIds) {
            if (tagId) {
              await tx.insert(publicationTags).values({
                publicationId: input.id,
                tagId,
              });
            }
          }
        }

        // Update categories if provided
        if (input.categories) {
          const categoryIds = await tx
            .select({ id: categories.id })
            .from(categories)
            .where(inArray(categories.name, input.categories));

          // Delete old categories
          await tx
            .delete(publicationCategories)
            .where(eq(publicationCategories.publicationId, input.id));

          // Insert new categories
          for (const category of categoryIds) {
            await tx.insert(publicationCategories).values({
              publicationId: input.id,
              categoryId: category.id,
            });
          }
        }

        // Return the updated publication
        const updated = await tx
          .select()
          .from(publications)
          .where(eq(publications.id, input.id))
          .limit(1);

        return updated[0];
      });
    }),

  // Create publication as another user
  createPublicationAsUser: protectedProcedure
    .input(
      z.object({
        authorId: z.string(),
        title: z.string(),
        abstract: z.string().optional(),
        content: z.string(),
        type: z.enum([
          "research_paper",
          "policy_brief",
          "opinion",
          "blog_post",
        ]),
        status: z
          .enum(["draft", "pending_review", "published"])
          .default("published"),
        tags: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create publications as other users",
        });
      }

      // Check if the target user exists
      const targetUser = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, input.authorId))
        .limit(1);

      if (targetUser.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target user not found",
        });
      }

      // Generate a URL-friendly slug from the title
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Create the publication
      return await db.transaction(async (tx) => {
        // Insert the publication
        const [newPublication] = await tx
          .insert(publications)
          .values({
            title: input.title,
            slug,
            abstract: input.abstract,
            content: input.content,
            type: input.type,
            authorId: input.authorId,
            status: input.status,
            publishedAt: input.status === "published" ? new Date() : null,
          })
          .returning();

        if (!newPublication) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create publication",
          });
        }

        // Add tags if provided
        if (input.tags && input.tags.length > 0) {
          for (const tagName of input.tags) {
            // Check if tag exists
            const existingTag = await tx
              .select()
              .from(tags)
              .where(eq(tags.name, tagName))
              .limit(1);

            let tagId: number | undefined;
            if (existingTag.length > 0) {
              tagId = existingTag[0]?.id;
            } else {
              // Create new tag
              const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
              const [newTag] = await tx
                .insert(tags)
                .values({ name: tagName, slug: tagSlug })
                .returning({ id: tags.id });
              tagId = newTag?.id;
            }

            // Link tag to publication
            if (tagId) {
              await tx.insert(publicationTags).values({
                publicationId: newPublication.id,
                tagId,
              });
            }
          }
        }

        // Add categories if provided
        if (input.categories && input.categories.length > 0) {
          const categoryIds = await tx
            .select({ id: categories.id })
            .from(categories)
            .where(inArray(categories.name, input.categories));

          for (const category of categoryIds) {
            await tx.insert(publicationCategories).values({
              publicationId: newPublication.id,
              categoryId: category.id,
            });
          }
        }

        return newPublication;
      });
    }),

  // Create a new user profile (for use when publishing articles)
  createUserProfile: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(), // Optional custom ID, will generate a random one if not provided
        name: z.string().min(1, "Name is required"),
        position: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        isTeamMember: z.boolean().optional().default(false),
        teamRole: z.string().optional(),
        showOnWebsite: z.boolean().optional().default(false),
      }) satisfies z.ZodType<CreateProfileInput>,
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create user profiles",
        });
      }

      // Generate a random ID if not provided
      const profileId =
        input.id ||
        `auto_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      // Check if profile with the ID already exists
      const existingProfile = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

      if (existingProfile.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A profile with this ID already exists",
        });
      }

      // Create the new profile
      const [newProfile] = await db
        .insert(profiles)
        .values({
          id: profileId,
          name: input.name,
          position: input.position || "",
          bio: input.bio || "",
          avatar: input.avatar || null,
          isTeamMember: input.isTeamMember || false,
          teamRole: input.teamRole || "",
          showOnWebsite: input.showOnWebsite || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newProfile;
    }),

  // Bulk delete publications
  bulkDeletePublications: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
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

      // Check if user is admin
      const isAdmin = await checkUserIsAdmin(userId);
      if (!isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete publications",
        });
      }

      return await db.transaction(async (tx) => {
        for (const id of input.ids) {
          // First delete associated tags
          await tx
            .delete(publicationTags)
            .where(eq(publicationTags.publicationId, id));

          // Then delete associated categories
          await tx
            .delete(publicationCategories)
            .where(eq(publicationCategories.publicationId, id));

          // Finally delete the publication
          await tx.delete(publications).where(eq(publications.id, id));
        }

        return { success: true };
      });
    }),
});
