"use client";

import { useCallback, useRef, useEffect } from "react";
import { useNotifications } from "@/components/providers/notification-provider";

export interface UseNotificationSoundOptions {
  volume?: number;
  enabled?: boolean;
}

export interface UseNotificationSoundReturn {
  playNotificationSound: () => void;
  isPlaying: boolean;
  canPlaySound: boolean;
}

export function useNotificationSound(
  options: UseNotificationSoundOptions = {}
): UseNotificationSoundReturn {
  const { volume = 0.7, enabled = true } = options;

  // Safely get notification permission state with fallback
  let hasNotificationPermission = false;
  try {
    const notificationContext = useNotifications();
    hasNotificationPermission = notificationContext.hasNotificationPermission;
  } catch {
    // Fallback to direct check if context is not available
    hasNotificationPermission =
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted";
  }

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    audioRef.current = new Audio("/audio/notification.wav");
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";

    // Handle audio events
    const handleCanPlay = () => {
      console.info("Notification sound loaded and ready to play");
    };

    const handleError = (error: Event) => {
      console.error("Error loading notification sound:", error);
    };

    const handleEnded = () => {
      isPlayingRef.current = false;
    };

    const audio = audioRef.current;
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Determine if sound should be played
  const canPlaySound = enabled && !hasNotificationPermission;

  const playNotificationSound = useCallback(() => {
    if (!canPlaySound || !audioRef.current || isPlayingRef.current) {
      return;
    }

    try {
      isPlayingRef.current = true;

      // Reset audio to beginning in case it was played before
      audioRef.current.currentTime = 0;

      // Play the audio
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.info("Notification sound played successfully");
          })
          .catch((error) => {
            console.error("Error playing notification sound:", error);
            isPlayingRef.current = false;
          });
      }
    } catch (error) {
      console.error("Error playing notification sound:", error);
      isPlayingRef.current = false;
    }
  }, [canPlaySound]);

  return {
    playNotificationSound,
    isPlaying: isPlayingRef.current,
    canPlaySound,
  };
}
