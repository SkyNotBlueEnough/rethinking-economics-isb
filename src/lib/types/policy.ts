import type { policies, caseStudies } from "~/server/db/schema";

// Policy status enum
export type PolicyStatus = "draft" | "published";

// Policy category enum
export type PolicyCategory = "economic" | "social" | "environmental";

// Advocacy campaign status enum
export type AdvocacyCampaignStatus = "active" | "completed" | "planned";

// Base types from database schema
export type Policy = typeof policies.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;

// Arrays of types
export type Policies = Policy[];
export type CaseStudies = CaseStudy[];

// Input types for creating/updating
export interface PolicyInput {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  category: PolicyCategory;
  thumbnailUrl?: string;
  authorId?: string;
  status?: PolicyStatus;
  publishedAt?: Date;
}

export interface CaseStudyInput {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  policyId: number;
  thumbnailUrl?: string;
  authorId?: string;
  status?: PolicyStatus;
  publishedAt?: Date;
}

// Advocacy campaign is not in the database schema yet, we'll add it
export interface AdvocacyCampaign {
  id: number;
  title: string;
  description?: string;
  status: AdvocacyCampaignStatus;
  imageUrl?: string;
  achievements?: string[];
  displayOrder?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export type AdvocacyCampaigns = AdvocacyCampaign[];

export interface AdvocacyCampaignInput {
  title: string;
  description?: string;
  status: AdvocacyCampaignStatus;
  imageUrl?: string;
  achievements?: string[];
  displayOrder?: number;
}
