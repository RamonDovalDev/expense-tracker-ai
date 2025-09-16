"use server";

import { categorizeExpense } from "@/lib/ai";
import { VALID_CATEGORIES } from "@/lib/constants";
import z from "zod";

// Zod Validation Schema
const suggestCategorySchema = z.object({
  description: z
    .string()
    .min(2, "Description must be at least 2 characters long")
    .max(100, "Description cannot exceed 100 characters"),
});

// Inferred type
type SuggestCategoryInput = z.infer<typeof suggestCategorySchema>;

export async function suggestCategory(
  description: string
): Promise<{ category: string; error?: string }> {
  // Validate Zod Input
  const validationResult = suggestCategorySchema.safeParse({ description });
  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.issues[0].message || "Invalid description";
    return {
      category: "Other",
      error: errorMessage,
    };
  }

  try {
    const trimmedDescription = description.trim();
    const suggestedCategory = await categorizeExpense(trimmedDescription);
    const category = VALID_CATEGORIES.includes(suggestedCategory as any)
      ? suggestedCategory
      : "Other";

    return { category };
  } catch (error) {
    console.error("❌ Error in suggestCategory server action:", error);

    // Handle specific OpenRouter errors
    if (error instanceof Error) {
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        return {
          category: "Other",
          error: "Invalid API key. Please contact support.",
        };
      }
      if (
        error.message.includes("429") ||
        error.message.includes("rate limit")
      ) {
        return {
          category: "Other",
          error: "Rate limit exceeded. Please try again later.",
        };
      }
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        return {
          category: "Other",
          error: "Network error. Please check your connection.",
        };
      }
    }
    return {
      category: "Other",
      error: "unable to suggest category this time. Please, try later",
    };
  }
}
