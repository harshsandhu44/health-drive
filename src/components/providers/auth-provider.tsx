"use client";

import { PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
