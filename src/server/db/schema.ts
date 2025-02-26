// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  int,
  sqliteTableCreator,
  text,
  primaryKey,
  real,
  unique,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `rethinking-economics-isb_${name}`,
);

// =========== USER PROFILES ===========
export const profiles = createTable("profile", {
  id: text("id").primaryKey(), // References Clerk user ID
  name: text("name", { length: 256 }),
  bio: text("bio", { length: 2000 }),
  position: text("position", { length: 256 }),
  avatar: text("avatar_url"),
  isTeamMember: int("is_team_member", { mode: "boolean" }).default(false),
  teamRole: text("team_role", { length: 256 }),
  showOnWebsite: int("show_on_website", { mode: "boolean" }).default(false),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

// =========== MEMBERSHIPS ===========
export const membershipTypes = createTable("membership_type", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 100 }).notNull(),
  description: text("description", { length: 1000 }),
  benefits: text("benefits", { length: 1000 }),
  requiresApproval: int("requires_approval", { mode: "boolean" }).default(true),
});

export const memberships = createTable("membership", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => profiles.id),
  membershipTypeId: int("membership_type_id").references(
    () => membershipTypes.id,
  ),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default(
    "pending",
  ),
  startDate: int("start_date", { mode: "timestamp" }),
  endDate: int("end_date", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

// =========== CONTENT CATEGORIES ===========

export const categories = createTable(
  "category",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 100 }).notNull(),
    slug: text("slug", { length: 100 }).notNull(),
    description: text("description", { length: 500 }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    slugIdx: unique("category_slug_idx").on(table.slug),
  }),
);

// =========== TAGS ===========
export const tags = createTable(
  "tag",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name", { length: 50 }).notNull(),
    slug: text("slug", { length: 50 }).notNull(),
  },
  (table) => ({
    slugIdx: unique("tag_slug_idx").on(table.slug),
  }),
);

// =========== PUBLICATIONS ===========
export const publications = createTable(
  "publication",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    slug: text("slug", { length: 256 }).notNull(),
    abstract: text("abstract", { length: 1000 }),
    content: text("content").notNull(),
    type: text("type", {
      enum: ["research_paper", "policy_brief", "opinion", "blog_post"],
    }).notNull(),
    pdfUrl: text("pdf_url"),
    thumbnailUrl: text("thumbnail_url"),
    authorId: text("author_id").references(() => profiles.id),
    status: text("status", {
      enum: ["draft", "pending_review", "published", "rejected"],
    }).default("draft"),
    featuredOrder: int("featured_order"),
    publishedAt: int("published_at", { mode: "timestamp" }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    slugIdx: unique("publication_slug_idx").on(table.slug),
  }),
);

// Publication-Category relationship
export const publicationCategories = createTable(
  "publication_category",
  {
    publicationId: int("publication_id").references(() => publications.id),
    categoryId: int("category_id").references(() => categories.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.publicationId, table.categoryId] }),
  }),
);

// Publication-Tag relationship
export const publicationTags = createTable(
  "publication_tag",
  {
    publicationId: int("publication_id").references(() => publications.id),
    tagId: int("tag_id").references(() => tags.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.publicationId, table.tagId] }),
  }),
);

// Co-authors for publications
export const publicationCoAuthors = createTable(
  "publication_co_author",
  {
    publicationId: int("publication_id").references(() => publications.id),
    authorId: text("author_id").references(() => profiles.id),
    authorOrder: int("author_order").default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.publicationId, table.authorId] }),
  }),
);

// =========== EVENTS ===========
export const events = createTable(
  "event",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    slug: text("slug", { length: 256 }).notNull(),
    description: text("description", { length: 2000 }),
    location: text("location", { length: 256 }),
    startDate: int("start_date", { mode: "timestamp" }).notNull(),
    endDate: int("end_date", { mode: "timestamp" }),
    registrationUrl: text("registration_url"),
    thumbnailUrl: text("thumbnail_url"),
    status: text("status", {
      enum: ["upcoming", "ongoing", "completed", "canceled"],
    }).default("upcoming"),
    isVirtual: int("is_virtual", { mode: "boolean" }).default(false),
    virtualLink: text("virtual_link"),
    maxAttendees: int("max_attendees"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    slugIdx: unique("event_slug_idx").on(table.slug),
  }),
);

// Event registrations
export const eventRegistrations = createTable("event_registration", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: int("event_id").references(() => events.id),
  userId: text("user_id").references(() => profiles.id),
  name: text("name", { length: 256 }),
  email: text("email", { length: 256 }),
  phone: text("phone", { length: 20 }),
  status: text("status", {
    enum: ["registered", "attended", "canceled", "no_show"],
  }).default("registered"),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// Event media (photos, videos, etc.)
export const eventMedia = createTable("event_media", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: int("event_id").references(() => events.id),
  type: text("type", { enum: ["photo", "video", "document"] }).notNull(),
  url: text("url").notNull(),
  title: text("title", { length: 256 }),
  description: text("description", { length: 500 }),
  isFeatured: int("is_featured", { mode: "boolean" }).default(false),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// =========== POLICY & ADVOCACY ===========
export const policies = createTable(
  "policy",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    slug: text("slug", { length: 256 }).notNull(),
    summary: text("summary", { length: 1000 }),
    content: text("content").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    authorId: text("author_id").references(() => profiles.id),
    status: text("status", {
      enum: ["draft", "published"],
    }).default("draft"),
    publishedAt: int("published_at", { mode: "timestamp" }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    slugIdx: unique("policy_slug_idx").on(table.slug),
  }),
);

// Policy case studies
export const caseStudies = createTable(
  "case_study",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    slug: text("slug", { length: 256 }).notNull(),
    summary: text("summary", { length: 1000 }),
    content: text("content").notNull(),
    policyId: int("policy_id").references(() => policies.id),
    thumbnailUrl: text("thumbnail_url"),
    authorId: text("author_id").references(() => profiles.id),
    status: text("status", {
      enum: ["draft", "published"],
    }).default("draft"),
    publishedAt: int("published_at", { mode: "timestamp" }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    slugIdx: unique("case_study_slug_idx").on(table.slug),
  }),
);

// =========== MEDIA & PRESS ===========
export const pressReleases = createTable(
  "press_release",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }).notNull(),
    slug: text("slug", { length: 256 }).notNull(),
    content: text("content").notNull(),
    pdfUrl: text("pdf_url"),
    releaseDate: int("release_date", { mode: "timestamp" }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    slugIdx: unique("press_release_slug_idx").on(table.slug),
  }),
);

export const mediaAppearances = createTable("media_appearance", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title", { length: 256 }).notNull(),
  outlet: text("outlet", { length: 256 }).notNull(),
  url: text("url").notNull(),
  date: int("date", { mode: "timestamp" }).notNull(),
  summary: text("summary", { length: 1000 }),
  thumbnailUrl: text("thumbnail_url"),
  isFeatured: int("is_featured", { mode: "boolean" }).default(false),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

// =========== CONTACT & INQUIRIES ===========
export const inquiries = createTable("inquiry", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).notNull(),
  email: text("email", { length: 256 }).notNull(),
  phone: text("phone", { length: 20 }),
  subject: text("subject", { length: 256 }),
  message: text("message", { length: 2000 }).notNull(),
  type: text("type", {
    enum: ["general", "membership", "media", "partnership", "other"],
  }).default("general"),
  status: text("status", {
    enum: ["new", "in_progress", "resolved", "spam"],
  }).default("new"),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});
