import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-none border-0",
            headerTitle: "text-zinc-900 dark:text-zinc-100",
            headerSubtitle: "text-zinc-600 dark:text-zinc-400",
            socialButtonsBlockButton:
              "border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800",
            socialButtonsBlockButtonText: "text-zinc-900 dark:text-zinc-100",
            formFieldLabel: "text-zinc-700 dark:text-zinc-300",
            formFieldInput:
              "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
            footerActionLink: "text-blue-600 hover:text-blue-700",
          },
        }}
      />
    </div>
  );
}
