"use client";

import { useState, useEffect, useCallback } from "react";

export interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
}

export interface UsePushNotificationsReturn extends PushNotificationState {
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendTestNotification: () => void;
}

// VAPID public key - replace with your actual VAPID key when implementing server-side push
const VAPID_PUBLIC_KEY =
  "BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f40SWoMKUBXVaFNuQUH0EE6WXVmFLY7C2EKSl8JtBqqGNpQu8go";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "default",
    isSubscribed: false,
    subscription: null,
    isLoading: true,
    error: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        // First check basic browser support
        const isSupported =
          "serviceWorker" in navigator &&
          "PushManager" in window &&
          "Notification" in window;

        if (!isSupported) {
          setState((prev) => ({
            ...prev,
            isSupported: false,
            isLoading: false,
            error: "Push notifications are not supported in this browser",
          }));
          return;
        }

        // Set basic support first - this is all we need for PWA to work
        setState((prev) => ({
          ...prev,
          isSupported: true,
          permission: Notification.permission,
          isSubscribed: false,
          subscription: null,
          isLoading: false,
        }));

        // Optionally try to check service worker registration in the background
        // But don't make PWA support dependent on it
        setTimeout(async () => {
          try {
            if ("serviceWorker" in navigator) {
              const registrations =
                await navigator.serviceWorker.getRegistrations();
              if (registrations.length > 0) {
                const registration = registrations[0];
                if (registration) {
                  const subscription =
                    await registration.pushManager.getSubscription();

                  setState((prev) => ({
                    ...prev,
                    isSubscribed: subscription !== null,
                    subscription,
                  }));
                }
              }
            }
          } catch (error) {
            console.info("Could not check service worker subscription:", error);
            // Don't affect the isSupported state
          }
        }, 1000); // Check after 1 second delay
      } catch (error) {
        console.error("Error checking push notification support:", error);
        setState((prev) => ({
          ...prev,
          isSupported: false,
          isLoading: false,
          error: "Failed to check push notification support",
        }));
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      checkSupport();
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.isSupported) {
        throw new Error("Push notifications are not supported");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const permission = await Notification.requestPermission();

      setState((prev) => ({
        ...prev,
        permission,
        isLoading: false,
      }));

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to request notification permission",
      }));
      return false;
    }
  }, [state.isSupported]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.isSupported || state.permission !== "granted") {
        throw new Error(
          "Cannot subscribe: notifications not supported or permission not granted"
        );
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const registrations = await navigator.serviceWorker.getRegistrations();
      const registration = registrations[0];

      if (!registration) {
        throw new Error("No service worker registration found");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Here you would typically send the subscription to your server
      console.info("Push subscription:", JSON.stringify(subscription));

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to subscribe to push notifications",
      }));
      return false;
    }
  }, [state.isSupported, state.permission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.subscription) {
        return true;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await state.subscription.unsubscribe();

      // Here you would typically notify your server about the unsubscription
      console.info("Unsubscribed from push notifications");

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to unsubscribe from push notifications",
      }));
      return false;
    }
  }, [state.subscription]);

  const sendTestNotification = useCallback(() => {
    if (state.permission === "granted") {
      new Notification("HealthDrive Test", {
        body: "This is a test notification from HealthDrive",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test-notification",
      });
    }
  }, [state.permission]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}
