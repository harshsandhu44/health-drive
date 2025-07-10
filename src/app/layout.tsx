import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthDrive by Vylune",
  description:
    "HealthDrive provides healthcare facilities with a SaaS platform to streamline operations, including appointment management, doctor and department oversight, real-time analytics, and secure patient record sharing.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
