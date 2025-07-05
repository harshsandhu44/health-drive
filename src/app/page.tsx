import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Home = async () => {
  const { orgId } = await auth();

  // If user is authenticated and part of an organization, redirect to dashboard
  if (orgId) {
    redirect("/dashboard");
  }

  return (
    <main>
      <UserButton />
    </main>
  );
};

export default Home;
