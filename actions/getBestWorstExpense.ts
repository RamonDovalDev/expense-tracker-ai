"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function getBestWorstExpense(): Promise<{
  bestExpense?: number;
  worstExpense?: number;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "User not found" };
  }

  try {
    // Fetch all user records
    const records = await db.record.findMany({
      where: { userId },
      select: { amount: true },
    });

    if (!records || records.length === 0) {
      return {
        bestExpense: 0,
        worstExpense: 0,
      };
    }

    const amounts = records.map((record) => record.amount);

    // Calculate the best and worst expense
    const bestExpense = Math.max(...amounts);
    const worstExpense = Math.min(...amounts);

    return { bestExpense, worstExpense };
  } catch (error) {
    console.error("Error fetching expense records:", error);
    return { error: "Database error" };
  }
}
