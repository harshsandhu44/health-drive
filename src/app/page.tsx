import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    // Redirect authenticated users to dashboard
    redirect("/dashboard");
  } else {
    // Redirect unauthenticated users to sign-in
    redirect("/auth/sign-in");
  }
}
