"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugInfo {
  hasServiceWorker: boolean;
  hasPushManager: boolean;
  hasNotification: boolean;
  notificationPermission: string;
  serviceWorkerState: string;
  userAgent: string;
  isHttps: boolean;
}

export function PWADebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {return;}

    const info: DebugInfo = {
      hasServiceWorker: "serviceWorker" in navigator,
      hasPushManager: "PushManager" in window,
      hasNotification: "Notification" in window,
      notificationPermission:
        "Notification" in window ? Notification.permission : "not-supported",
      serviceWorkerState: "unknown",
      userAgent: navigator.userAgent,
      isHttps:
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost",
    };

    // Check service worker state
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        setDebugInfo((_prev) => ({
          ...info,
          serviceWorkerState:
            registrations.length > 0 ? "registered" : "not-registered",
        }));
      });
    } else {
      setDebugInfo(info);
    }
  }, []);

  const testServiceWorkerRegistration = async () => {
    const results: string[] = [];

    try {
      if (!("serviceWorker" in navigator)) {
        results.push("❌ Service Worker not supported");
        setTestResults(results);
        return;
      }

      results.push("✅ Service Worker API available");

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        results.push(`✅ Service Worker registered: ${registration.scope}`);

        if (registration.active) {
          results.push("✅ Service Worker is active");
        } else if (registration.installing) {
          results.push("⏳ Service Worker is installing");
        } else if (registration.waiting) {
          results.push("⏳ Service Worker is waiting");
        }
      } catch (error) {
        results.push(`❌ Service Worker registration failed: ${error}`);
      }

      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        results.push(`📊 Total registrations: ${registrations.length}`);
      } catch (error) {
        results.push(`❌ Could not get registrations: ${error}`);
      }
    } catch (error) {
      results.push(`❌ Unexpected error: ${error}`);
    }

    setTestResults(results);
  };

  const testNotificationPermission = async () => {
    const results: string[] = [];

    try {
      if (!("Notification" in window)) {
        results.push("❌ Notification API not supported");
        setTestResults(results);
        return;
      }

      results.push("✅ Notification API available");
      results.push(`📊 Current permission: ${Notification.permission}`);

      if (Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          results.push(`📊 Permission after request: ${permission}`);
        } catch (error) {
          results.push(`❌ Permission request failed: ${error}`);
        }
      }

      if (Notification.permission === "granted") {
        try {
          const notification = new Notification("Test Notification", {
            body: "This is a test notification",
            icon: "/favicon.ico",
          });
          results.push("✅ Test notification sent");
          setTimeout(() => notification.close(), 3000);
        } catch (error) {
          results.push(`❌ Test notification failed: ${error}`);
        }
      }
    } catch (error) {
      results.push(`❌ Unexpected error: ${error}`);
    }

    setTestResults(results);
  };

  if (!debugInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PWA Debug - Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PWA Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span>Service Worker Support:</span>
            <Badge
              variant={debugInfo.hasServiceWorker ? "default" : "destructive"}
            >
              {debugInfo.hasServiceWorker ? "Yes" : "No"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>Push Manager Support:</span>
            <Badge
              variant={debugInfo.hasPushManager ? "default" : "destructive"}
            >
              {debugInfo.hasPushManager ? "Yes" : "No"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>Notification Support:</span>
            <Badge
              variant={debugInfo.hasNotification ? "default" : "destructive"}
            >
              {debugInfo.hasNotification ? "Yes" : "No"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>Notification Permission:</span>
            <Badge
              variant={
                debugInfo.notificationPermission === "granted"
                  ? "default"
                  : "secondary"
              }
            >
              {debugInfo.notificationPermission}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>Service Worker State:</span>
            <Badge
              variant={
                debugInfo.serviceWorkerState === "registered"
                  ? "default"
                  : "secondary"
              }
            >
              {debugInfo.serviceWorkerState}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span>HTTPS/Localhost:</span>
            <Badge variant={debugInfo.isHttps ? "default" : "destructive"}>
              {debugInfo.isHttps ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-2">
          <Button onClick={testServiceWorkerRegistration} variant="outline">
            Test Service Worker Registration
          </Button>
          <Button onClick={testNotificationPermission} variant="outline">
            Test Notification Permission
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium">Test Results:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
        )}

        <details className="text-xs">
          <summary className="cursor-pointer font-medium">User Agent</summary>
          <div className="mt-2 break-all">{debugInfo.userAgent}</div>
        </details>
      </CardContent>
    </Card>
  );
}
