"use client";

import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth-provider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return <AuthProvider>{children}</AuthProvider>;
};
