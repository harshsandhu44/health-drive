import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default async function HomePage() {
  return (
    <div>
      <h1>Welcome to Health Drive</h1>
      <SignedOut>
        <div>
          <h2>Sign in to get started</h2>
          <p>Sign in to access your account and start using Health Drive.</p>
          <Link href="/sign-in">Sign in</Link>
        </div>
      </SignedOut>
    </div>
  );
}
