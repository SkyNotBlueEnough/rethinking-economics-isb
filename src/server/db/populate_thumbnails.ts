import "dotenv/config";
import { db } from "./index";
import { publications } from "./schema";
import { eq } from "drizzle-orm";

// Array of thumbnail URLs to cycle through
const thumbnailUrls = [
  "https://substack-post-media.s3.amazonaws.com/public/images/97b632b6-df3d-4966-a8e0-257f4f96f811_1920x1920.png",
  "https://substack-post-media.s3.amazonaws.com/public/images/e5c1d99c-6b20-4c9f-8ef2-c64ea81b0c76_1344x896.png",
  "https://substack-post-media.s3.amazonaws.com/public/images/2ae8ed7a-5b9a-4023-b487-1eb7245482da_1920x1280.png",
  "https://substack-post-media.s3.amazonaws.com/public/images/7333d590-941e-4129-9459-494d7bb9b551_1024x1024.png",
  "https://substack-post-media.s3.amazonaws.com/public/images/b5fadf19-1a74-45da-ad68-6e1cd23b1159_1920x1281.png",
  "https://substack-post-media.s3.amazonaws.com/public/images/0cf8e6f6-cee1-4793-9c2f-c978b11e195d_940x788.png",
  "https://substack-post-media.s3.amazonaws.com/public/images/055b20e4-666d-4f6e-87d8-11a60522fa0f_1280x878.jpeg",
  "https://substack-post-media.s3.amazonaws.com/public/images/585a48dd-4c88-4909-ab5a-1a0ce928f03a_1626x1008.png",
];

async function populateThumbnails() {
  console.log("Starting to populate thumbnail URLs for publications...");

  // Get all publications
  const allPublications = await db.query.publications.findMany();
  console.log(`Found ${allPublications.length} publications to update.`);

  // Update each publication with a thumbnail URL
  for (let i = 0; i < allPublications.length; i++) {
    const publication = allPublications[i];

    // Skip if publication is undefined
    if (!publication) {
      console.warn(`Publication at index ${i} is undefined, skipping.`);
      continue;
    }

    const thumbnailUrl = thumbnailUrls[i % thumbnailUrls.length]; // Cycle through the URLs

    try {
      // Update the publication with the thumbnail URL
      await db
        .update(publications)
        .set({ thumbnailUrl })
        .where(eq(publications.id, publication.id));

      console.log(
        `Updated publication "${publication.title}" with thumbnail URL.`,
      );
    } catch (error) {
      console.error(
        `Failed to update publication ${publication.title}:`,
        error,
      );
    }
  }

  console.log("Thumbnail URLs populated successfully.");
}

// Run the function
populateThumbnails()
  .catch((error) => {
    console.error("Error populating thumbnail URLs:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Script execution completed.");
    process.exit(0);
  });
