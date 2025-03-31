import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { contactSubmissions } from "~/server/db/schema";
import { contactFormSchema } from "~/lib/types/contact";

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.format() },
        { status: 400 },
      );
    }

    const validatedData = result.data;

    // Insert the submission into the database
    await db.insert(contactSubmissions).values({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      inquiryType: validatedData.inquiryType,
      // Default values for other fields will be applied automatically
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
