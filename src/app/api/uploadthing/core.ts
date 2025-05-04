import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { profiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      // Update the user's profile with the new avatar URL
      await db
        .update(profiles)
        .set({
          avatar: file.url,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, metadata.userId));

      console.log("Avatar URL:", file.url);

      // Return data that will be sent to the client
      return { avatarUrl: file.url };
    }),

  // New endpoint for markdown editor image uploads
  markdownImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log(
        "Markdown image upload complete for userId:",
        metadata.userId,
      );
      console.log("Image URL:", file.url);

      // Return data that will be sent to the client
      return { imageUrl: file.url };
    }),

  // Publication thumbnail uploader
  thumbnailUploader: f({ image: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = getAuth(req);

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Thumbnail upload complete for userId:", metadata.userId);
      console.log("Thumbnail URL:", file.url);

      // Return data that will be sent to the client
      return { thumbnailUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
