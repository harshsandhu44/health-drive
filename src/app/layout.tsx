import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import * as CONSTANTS from "@/lib/contants";
import "./globals.css";

export const metadata: Metadata = {
  title: CONSTANTS.TITLE,
  description: CONSTANTS.DESCRIPTION,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
