import type { events, eventMedia, initiatives } from "~/server/db/schema";

// Event type enum
export type EventType = "conference" | "workshop" | "seminar" | "webinar";

// Event status enum
export type EventStatus = "upcoming" | "ongoing" | "completed" | "canceled";

// Initiative category enum
export type InitiativeCategory =
  | "education"
  | "policy"
  | "community"
  | "research";

// Base types from database schema
export type Event = typeof events.$inferSelect;
export type EventMedia = typeof eventMedia.$inferSelect;
export type Initiative = typeof initiatives.$inferSelect;

// Arrays of types
export type Events = Event[];
export type EventMediaList = EventMedia[];
export type Initiatives = Initiative[];

// Input types for creating/updating
export interface EventInput {
  title: string;
  slug?: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  registrationUrl?: string;
  thumbnailUrl?: string;
  type: EventType;
  status?: EventStatus;
  isVirtual?: boolean;
  virtualLink?: string;
  maxAttendees?: number;
  displayOrder?: number;
}

export interface EventMediaInput {
  eventId: number;
  type: "photo" | "video" | "document";
  url: string;
  title?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface InitiativeInput {
  title: string;
  description?: string;
  category: InitiativeCategory;
  iconName?: string;
  displayOrder?: number;
}
