import { z } from "zod";

// Zod schema for contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.enum([
    "general",
    "membership",
    "collaboration",
    "media",
    "other",
  ]),
});

// Type for contact form submission
export type ContactFormSubmission = z.infer<typeof contactFormSchema>;

// Type for contact submission in database (includes additional fields)
export interface ContactSubmission extends ContactFormSubmission {
  id: number;
  status: "new" | "in_progress" | "resolved";
  createdAt: Date;
  updatedAt?: Date;
}

// Type for admin panel contact list
export interface ContactSubmissionListItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  inquiryType: string;
  status: string;
  createdAt: Date;
}
