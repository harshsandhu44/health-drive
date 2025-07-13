"use client";

import { useEffect, useState } from "react";

import { Bell, BellOff, Volume2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PWAState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
}

export function PWAStatus() {
  const [state, setState] = useState<PWAState>({
    isSupported: false,
    permission: "default",
    isSubscribed: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkPWASupport = async () => {
      try {
        const isSupported =
          "serviceWorker" in navigator &&
          "PushManager" in window &&
          "Notification" in window;

        setState({
          isSupported,
          permission: isSupported ? Notification.permission : "denied",
          isSubscribed: false,
          isLoading: false,
        });

        // Check if already subscribed
        if (isSupported && "serviceWorker" in navigator) {
          try {
            const registrations =
              await navigator.serviceWorker.getRegistrations();
            if (registrations.length > 0) {
              const registration = registrations[0];
              const subscription =
                await registration.pushManager.getSubscription();
              setState(prev => ({
                ...prev,
                isSubscribed: subscription !== null,
              }));
            }
          } catch (error) {
            console.info("Could not check subscription status:", error);
          }
        }
      } catch (error) {
        console.error("Error checking PWA support:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (typeof window !== "undefined") {
      checkPWASupport();
    }
  }, []);

  const requestPermission = async () => {
    if (!state.isSupported) return false;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission, isLoading: false }));

      if (permission === "granted") {
        alert("Notification permission granted!");
      } else {
        alert("Notification permission denied");
      }

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting permission:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const sendTestNotification = () => {
    if (state.permission === "granted") {
      new Notification("HealthDrive Test", {
        body: "This is a test notification from HealthDrive PWA",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test-notification",
      });
    }
  };

  const playTestSound = () => {
    // Create and play a test beep sound
    const audioContext = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  if (!state.isSupported) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            PWA Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn&apos;t support Progressive Web Apps or Push
            Notifications
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          PWA & Notification Status
        </CardTitle>
        <CardDescription>
          Test and manage push notifications and audio alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Notification Permission:</span>
          <Badge
            variant={
              state.permission === "granted"
                ? "default"
                : state.permission === "denied"
                  ? "destructive"
                  : "secondary"
            }
          >
            {state.permission}
          </Badge>
        </div>

        {/* Subscription Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Push Subscription:</span>
          <Badge variant={state.isSubscribed ? "default" : "secondary"}>
            {state.isSubscribed ? "Subscribed" : "Not Subscribed"}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {state.permission === "default" && (
            <Button
              onClick={requestPermission}
              disabled={state.isLoading}
              size="sm"
            >
              <Bell className="mr-2 h-4 w-4" />
              Request Permission
            </Button>
          )}

          <Button
            onClick={sendTestNotification}
            variant="outline"
            size="sm"
            disabled={state.permission !== "granted"}
          >
            Test Notification
          </Button>

          <Button onClick={playTestSound} variant="outline" size="sm">
            <Volume2 className="mr-2 h-4 w-4" />
            Test Sound
          </Button>
        </div>

        {/* Information */}
        <div className="text-muted-foreground space-y-1 text-xs">
          <p>• PWA must be served over HTTPS or localhost</p>
          <p>• Install this app as PWA for better experience</p>
          <p>• Test notifications work immediately after permission grant</p>
        </div>
      </CardContent>
    </Card>
  );
}
