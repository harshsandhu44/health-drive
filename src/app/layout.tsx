import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { RootProvider } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthDrive by whouse.io",
  description:
    "HealthDrive solves the problem of healthcare data management. We are on a mission to help you manage data on your own terms.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
