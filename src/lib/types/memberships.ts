import type {
  membershipTypes,
  memberships,
  collaborationCards,
} from "~/server/db/schema";

export type MembershipType = typeof membershipTypes.$inferSelect;
export type MembershipTypes = MembershipType[];

export type Membership = typeof memberships.$inferSelect;
export type Memberships = Membership[];

export type MembershipWithType = Membership & {
  membershipType: MembershipType;
};

export type MembershipStatus = "pending" | "approved" | "rejected";

// For form validation
export const membershipTypeFormSchema = {
  name: { minLength: 2, maxLength: 100 },
  description: { maxLength: 1000 },
  benefits: { maxLength: 1000 },
};

// For collaboration FAQs
export interface FAQ {
  id?: number;
  question: string;
  answer: string;
  category: "collaboration" | "membership";
  displayOrder?: number;
}

export type FAQs = FAQ[];

// For collaboration cards
export type CollaborationCard = typeof collaborationCards.$inferSelect;
export type CollaborationCards = CollaborationCard[];
