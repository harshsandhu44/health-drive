"use client";

import { toast as originalToast } from "sonner";

// Function to play notification sound if notification permission is not granted
function playNotificationSoundIfNeeded() {
  // Check if we have notification permission
  const hasNotificationPermission =
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted";

  // Only play sound if user hasn't granted notification permission
  if (!hasNotificationPermission) {
    try {
      const audio = new Audio("/audio/notification.wav");
      audio.volume = 0.7;
      audio.play().catch((error) => {
        console.info("Could not play notification sound:", error);
      });
    } catch (error) {
      console.info("Error creating notification sound:", error);
    }
  }
}

// Enhanced toast functions that play sound
export const toast = {
  success: (...args: Parameters<typeof originalToast.success>) => {
    const result = originalToast.success(...args);
    playNotificationSoundIfNeeded();
    return result;
  },

  error: (...args: Parameters<typeof originalToast.error>) => {
    const result = originalToast.error(...args);
    playNotificationSoundIfNeeded();
    return result;
  },

  info: (...args: Parameters<typeof originalToast.info>) => {
    const result = originalToast.info(...args);
    playNotificationSoundIfNeeded();
    return result;
  },

  warning: (...args: Parameters<typeof originalToast.warning>) => {
    const result = originalToast.warning(...args);
    playNotificationSoundIfNeeded();
    return result;
  },

  message: (...args: Parameters<typeof originalToast.message>) => {
    const result = originalToast.message(...args);
    playNotificationSoundIfNeeded();
    return result;
  },

  // Keep original methods that don't need sound
  promise: originalToast.promise,
  custom: originalToast.custom,
  dismiss: originalToast.dismiss,
  loading: originalToast.loading,
};
