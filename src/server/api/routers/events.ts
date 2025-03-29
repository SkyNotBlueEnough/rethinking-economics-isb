import { z } from "zod";
import { eq, desc, asc, and, lt, gte } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { events, eventMedia, initiatives } from "~/server/db/schema";
import type {
  Event,
  Events,
  EventMedia,
  EventMediaList,
  Initiative,
  Initiatives,
  EventType,
  EventStatus,
  InitiativeCategory,
} from "~/lib/types/events";

export const eventsRouter = createTRPCRouter({
  // =========== EVENTS ===========

  // Get all events
  getAllEvents: publicProcedure.query(async ({ ctx }): Promise<Events> => {
    return ctx.db.query.events.findMany({
      orderBy: (eventsTable, { asc }) => [asc(eventsTable.displayOrder)],
    });
  }),

  // Get all events sorted by date
  getAllEventsSorted: publicProcedure.query(
    async ({ ctx }): Promise<Events> => {
      return ctx.db.query.events.findMany({
        orderBy: (eventsTable, { desc, asc }) => [
          desc(eventsTable.startDate),
          asc(eventsTable.displayOrder),
        ],
      });
    },
  ),

  // Get upcoming events
  getUpcomingEvents: publicProcedure.query(async ({ ctx }): Promise<Events> => {
    const now = new Date();
    return ctx.db.query.events.findMany({
      where: and(eq(events.status, "upcoming"), gte(events.startDate, now)),
      orderBy: (eventsTable, { asc }) => [
        asc(eventsTable.startDate),
        asc(eventsTable.displayOrder),
      ],
    });
  }),

  // Get past events
  getPastEvents: publicProcedure.query(async ({ ctx }): Promise<Events> => {
    const now = new Date();
    return ctx.db.query.events.findMany({
      where: lt(events.startDate, now),
      orderBy: (eventsTable, { desc }) => [desc(eventsTable.startDate)],
    });
  }),

  // Get event by slug
  getEventBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }): Promise<Event | null> => {
      const event = await ctx.db.query.events.findFirst({
        where: eq(events.slug, input),
      });

      if (!event) {
        return null;
      }

      return event;
    }),

  // Create event
  createEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        startDate: z.date(),
        endDate: z.date().optional(),
        registrationUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        type: z.enum(["conference", "workshop", "seminar", "webinar"]),
        status: z
          .enum(["upcoming", "ongoing", "completed", "canceled"])
          .optional(),
        isVirtual: z.boolean().optional(),
        virtualLink: z.string().optional(),
        maxAttendees: z.number().optional(),
        displayOrder: z.number().optional(),
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

      // Create a properly typed event object
      const eventData = {
        title: input.title,
        slug,
        description: input.description,
        location: input.location,
        startDate: input.startDate,
        endDate: input.endDate,
        registrationUrl: input.registrationUrl,
        thumbnailUrl: input.thumbnailUrl,
        type: input.type,
        status: input.status ?? "upcoming",
        isVirtual: input.isVirtual,
        virtualLink: input.virtualLink,
        maxAttendees: input.maxAttendees,
        displayOrder: input.displayOrder,
        createdAt: new Date(),
      };

      return ctx.db.insert(events).values(eventData).returning();
    }),

  // Update event
  updateEvent: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        registrationUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        type: z
          .enum(["conference", "workshop", "seminar", "webinar"])
          .optional(),
        status: z
          .enum(["upcoming", "ongoing", "completed", "canceled"])
          .optional(),
        isVirtual: z.boolean().optional(),
        virtualLink: z.string().optional(),
        maxAttendees: z.number().optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Create a properly typed update object
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date(),
      };

      // No need to convert timestamps - let Drizzle handle it

      return ctx.db
        .update(events)
        .set(updateData)
        .where(eq(events.id, id))
        .returning();
    }),

  // Delete event
  deleteEvent: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(events).where(eq(events.id, input)).returning();
    }),

  // =========== EVENT MEDIA ===========

  // Get media for event
  getEventMedia: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }): Promise<EventMediaList> => {
      return ctx.db.query.eventMedia.findMany({
        where: eq(eventMedia.eventId, input),
        orderBy: (mediaTable, { desc }) => [
          desc(mediaTable.isFeatured),
          desc(mediaTable.createdAt),
        ],
      });
    }),

  // Add media to event
  addEventMedia: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        type: z.enum(["photo", "video", "document"]),
        url: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(eventMedia)
        .values({
          ...input,
          createdAt: new Date(),
        })
        .returning();
    }),

  // Update event media
  updateEventMedia: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.enum(["photo", "video", "document"]).optional(),
        url: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        isFeatured: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db
        .update(eventMedia)
        .set(data)
        .where(eq(eventMedia.id, id))
        .returning();
    }),

  // Delete event media
  deleteEventMedia: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(eventMedia)
        .where(eq(eventMedia.id, input))
        .returning();
    }),

  // =========== INITIATIVES ===========

  // Get all initiatives
  getAllInitiatives: publicProcedure.query(
    async ({ ctx }): Promise<Initiatives> => {
      return ctx.db.query.initiatives.findMany({
        orderBy: (initiativesTable, { asc }) => [
          asc(initiativesTable.displayOrder),
        ],
      });
    },
  ),

  // Get initiatives by category
  getInitiativesByCategory: publicProcedure
    .input(z.enum(["education", "policy", "community", "research"]))
    .query(async ({ ctx, input }): Promise<Initiatives> => {
      return ctx.db.query.initiatives.findMany({
        where: eq(initiatives.category, input),
        orderBy: (initiativesTable, { asc }) => [
          asc(initiativesTable.displayOrder),
        ],
      });
    }),

  // Create initiative
  createInitiative: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.enum(["education", "policy", "community", "research"]),
        iconName: z.string().optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(initiatives)
        .values({
          ...input,
          createdAt: new Date(),
        })
        .returning();
    }),

  // Update initiative
  updateInitiative: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z
          .enum(["education", "policy", "community", "research"])
          .optional(),
        iconName: z.string().optional(),
        displayOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db
        .update(initiatives)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(initiatives.id, id))
        .returning();
    }),

  // Delete initiative
  deleteInitiative: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(initiatives)
        .where(eq(initiatives.id, input))
        .returning();
    }),
});
