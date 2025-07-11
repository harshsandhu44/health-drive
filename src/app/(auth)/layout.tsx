import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-lg bg-white p-8 shadow-xl dark:bg-slate-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              HealthDrive
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Healthcare Management Platform
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
