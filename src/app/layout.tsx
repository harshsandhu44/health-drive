import { PropsWithChildren } from "react";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { RootProvider } from "@/components/providers";
import { ServiceWorkerRegistration } from "@/components/shared/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthDrive by Vylune",
  description:
    "HealthDrive solves the problem of healthcare data management. We are on a mission to help you manage data on your own terms.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HealthDrive",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ServiceWorkerRegistration />
        <RootProvider>{children}</RootProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
