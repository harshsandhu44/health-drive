"use client";

import { Bell, BellOff, Volume2 } from "lucide-react";
import { useNotifications } from "@/components/providers/notification-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { toast } from "@/lib/toast-with-sound";

export function PWAStatus() {
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    isLoading,
    hasNotificationPermission,
  } = useNotifications();

  const { playNotificationSound, canPlaySound } = useNotificationSound();

  // Test functions
  const handleTestToast = () => {
    toast.success(
      "Test notification - this should play sound if notifications are disabled!"
    );
  };

  const handleTestSound = () => {
    playNotificationSound();
  };

  const handleTestNotification = () => {
    sendTestNotification();
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Notification permission granted!");
    } else {
      toast.error("Notification permission denied");
    }
  };

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      toast.success("Successfully subscribed to push notifications!");
    } else {
      toast.error("Failed to subscribe to push notifications");
    }
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribe();
    if (success) {
      toast.success("Successfully unsubscribed from push notifications");
    } else {
      toast.error("Failed to unsubscribe from push notifications");
    }
  };

  if (!isSupported) {
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
              permission === "granted"
                ? "default"
                : permission === "denied"
                ? "destructive"
                : "secondary"
            }
          >
            {permission}
          </Badge>
        </div>

        {/* Subscription Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Push Subscription:</span>
          <Badge variant={isSubscribed ? "default" : "secondary"}>
            {isSubscribed ? "Subscribed" : "Not Subscribed"}
          </Badge>
        </div>

        {/* Sound Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Sound Notifications:</span>
          <Badge variant={canPlaySound ? "default" : "secondary"}>
            {canPlaySound ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {permission === "default" && (
            <Button
              onClick={handleRequestPermission}
              disabled={isLoading}
              size="sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Request Permission
            </Button>
          )}

          {permission === "granted" && !isSubscribed && (
            <Button onClick={handleSubscribe} disabled={isLoading} size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          )}

          {isSubscribed && (
            <Button
              onClick={handleUnsubscribe}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <BellOff className="h-4 w-4 mr-2" />
              Unsubscribe
            </Button>
          )}

          <Button onClick={handleTestToast} variant="outline" size="sm">
            Test Toast + Sound
          </Button>

          {canPlaySound && (
            <Button onClick={handleTestSound} variant="outline" size="sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Test Sound Only
            </Button>
          )}

          {hasNotificationPermission && (
            <Button
              onClick={handleTestNotification}
              variant="outline"
              size="sm"
            >
              Test Push Notification
            </Button>
          )}
        </div>

        {/* Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• If notifications are enabled, toasts won&apos;t play sound</p>
          <p>• If notifications are disabled, toasts will play sound</p>
          <p>• Install this app as PWA for better experience</p>
        </div>
      </CardContent>
    </Card>
  );
}
