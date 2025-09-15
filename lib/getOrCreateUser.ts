import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { User } from "@prisma/client";

export const getOrCreateUser = async (): Promise<User | null> => {
  const user = await currentUser();
  if (!user) {
    return null; // O lanza un error si es una ruta protegida: throw new Error('Authentication required');
  }

  try {
    const userData = await db.user.upsert({
      where: { clerkUserId: user.id },
      update: {}, // No actualizamos datos existentes
      create: {
        clerkUserId: user.id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unknown User",
        imageUrl: user.imageUrl || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        email: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return userData;
  } catch (error) {
    console.error("Error checking/creating user:", error);
    throw new Error("Failed to check or create user");
  }
};
