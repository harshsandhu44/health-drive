import type { PropsWithChildren } from "react";

import type { Metadata, Viewport } from "next";

import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import * as CONSTANTS from "@/lib/contants";
import "./globals.css";

export const metadata: Metadata = {
  title: CONSTANTS.TITLE,
  description: CONSTANTS.DESCRIPTION,
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
        {children}
      </body>
    </html>
  );
}
