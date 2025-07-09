"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  usePushNotifications,
  UsePushNotificationsReturn,
} from "@/hooks/use-push-notifications";

interface NotificationContextType extends UsePushNotificationsReturn {
  hasNotificationPermission: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const pushNotifications = usePushNotifications();

  const hasNotificationPermission = pushNotifications.permission === "granted";

  const contextValue: NotificationContextType = {
    ...pushNotifications,
    hasNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
