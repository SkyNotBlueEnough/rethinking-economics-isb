import "dotenv/config";
import { db } from "./index";
import fs from "node:fs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { publicationsRouter } from "~/server/api/routers/publications";
import type { User } from "@clerk/nextjs/server";

// Read articles from JSON file
const articles = JSON.parse(
  fs.readFileSync("src/server/db/fake_articles.json", "utf-8"),
);

async function populatePublications() {
  const caller = publicationsRouter.createCaller({
    db,
    user: {
      id: "user_2tFUOCB6k4vvQPxg6TZDIB5qIlG",
    } as unknown as User,
    headers: new Headers(),
  });

  for (const article of articles) {
    try {
      await caller.create({
        type: article.category,
        title: article.title,
        content: article.content,
        categoryId: 1, // Assuming category ID 1 for simplicity
        tagId: 1, // Assuming tag ID 1 for simplicity
      });
      console.log(`Created publication: ${article.title}`);
    } catch (error) {
      console.error(`Failed to create publication ${article.title}:`, error);
    }
  }

  console.log("Publications populated successfully.");
}

populatePublications().catch(console.error);
