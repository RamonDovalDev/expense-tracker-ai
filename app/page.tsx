import Guest from "@/components/Guest";
import HomeContent from "@/components/HomeContent";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

interface User {
  name: string;
  imageUrl?: string;
  createdAt: Date;
  lastActiveAt?: Date;
}

export default async function HomePage() {
  try {
    const user = (await getOrCreateUser()) as User | null;
    if (!user) return <Guest />;
    return (
      <HomeContent
        user={{
          firstName: user.name,
          imageUrl: user.imageUrl || "/default-avatar.png",
          createdAt: user.createdAt.toISOString(),
          lastActiveAt: user.lastActiveAt?.toISOString(),
        }}
      />
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return <Guest />;
  }
}
