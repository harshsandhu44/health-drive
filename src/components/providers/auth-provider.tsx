"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { PropsWithChildren } from "react";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
