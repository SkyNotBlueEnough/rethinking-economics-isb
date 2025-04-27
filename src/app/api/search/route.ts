import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { searchQuerySchema } from "~/lib/types/search";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export async function GET(request: NextRequest) {
  try {
    // Get the search query from the URL parameters
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const type = searchParams.get("type") || "all";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    // Validate the query parameters with Zod
    const validatedParams = searchQuerySchema.parse({
      q: q || "",
      type,
      page,
      limit,
    });

    // Create a TRPC server context and caller
    const context = await createTRPCContext({
      headers: request.headers,
    });
    const caller = createCaller(context);

    // Call the search procedure from our TRPC router
    const results = await caller.search.search(validatedParams);

    // Return the results
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid search parameters",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        message: "An error occurred while processing your search",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
