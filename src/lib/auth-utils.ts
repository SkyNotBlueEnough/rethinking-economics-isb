import { db } from "~/server/db";
import { profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// List of admin user IDs - for simple role management
// In a production app, you might want to store this in the database
const ADMIN_USER_IDS = ["admin1", "admin2"];

export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  // Check if user is in the hardcoded admin list
  if (ADMIN_USER_IDS.includes(userId)) {
    return true;
  }

  // Check if user has admin role in database
  // For example, you might have an "isAdmin" field in your profiles table
  try {
    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });

    // For now, we'll consider team members as admins
    // You can modify this logic based on your requirements
    return Boolean(userProfile?.isTeamMember);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
