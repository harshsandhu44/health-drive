"use client";

import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth-provider";
import { NotificationProvider } from "./notification-provider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  );
};
