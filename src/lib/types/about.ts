import type {
  aboutOverview,
  aboutCards,
  historyMilestones,
  teamMembers,
  partners,
} from "~/server/db/schema";

// Section types enum
export type SectionType = "mission" | "vision" | "values" | "history";

// Team member category types enum
export type TeamMemberCategory = "leadership" | "faculty" | "students";

// Partner category types enum
export type PartnerCategory = "academic" | "policy" | "civil_society";

// Base types from database schema
export type AboutOverview = typeof aboutOverview.$inferSelect;
export type AboutCard = typeof aboutCards.$inferSelect;
export type HistoryMilestone = typeof historyMilestones.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Partner = typeof partners.$inferSelect;

// About overview with related cards
export interface AboutOverviewWithCards extends AboutOverview {
  cards?: AboutCard[];
}

// Arrays of types
export type AboutOverviews = AboutOverview[];
export type AboutOverviewsWithCards = AboutOverviewWithCards[];
export type AboutCards = AboutCard[];
export type HistoryMilestones = HistoryMilestone[];
export type TeamMembers = TeamMember[];
export type Partners = Partner[];

// Input types for creating/updating
export interface AboutOverviewInput {
  section: SectionType;
  title: string;
  content?: string;
  displayOrder?: number;
}

export interface AboutCardInput {
  sectionId: number;
  title: string;
  content?: string;
  icon?: string;
  displayOrder?: number;
}

export interface HistoryMilestoneInput {
  year: string;
  title: string;
  content?: string;
  displayOrder?: number;
}

export interface TeamMemberInput {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  category: TeamMemberCategory;
  displayOrder?: number;
}

export interface PartnerInput {
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  category: PartnerCategory;
  displayOrder?: number;
}
