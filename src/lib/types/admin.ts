import type { publications, profiles } from "~/server/db/schema";

export type Publication = typeof publications.$inferSelect;
export type Profile = typeof profiles.$inferSelect;

export type AdminAction = "approve" | "reject" | "modify";

export interface PublicationWithAuthor extends Publication {
  author: Profile;
}

export interface RejectionReason {
  reason: string;
  details?: string;
}

export interface PublicationModification {
  title?: string;
  abstract?: string;
  content?: string;
  tags?: string[];
  categories?: string[];
  thumbnailUrl?: string | null;
}

export interface AdminActionPayload {
  action: AdminAction;
  publicationId: number;
  rejectionReason?: RejectionReason;
  modifications?: PublicationModification;
}

export interface AdminState {
  isLoading: boolean;
  users: Profile[];
  publications: PublicationWithAuthor[];
  selectedPublication: PublicationWithAuthor | null;
  error: string | null;
}

export interface CreateProfileInput {
  id?: string;
  name: string;
  position?: string;
  bio?: string;
  avatar?: string;
  isTeamMember?: boolean;
  teamRole?: string;
  showOnWebsite?: boolean;
}
