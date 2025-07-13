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
  origin: string;
  pathname: string;
}

export function PWADebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
      origin: window.location.origin,
      pathname: window.location.pathname,
    };

    // Check service worker state
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        setDebugInfo(_prev => ({
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
        // Check if service worker is already registered
        const existingRegistrations =
          await navigator.serviceWorker.getRegistrations();
        results.push(
          `📊 Existing registrations: ${existingRegistrations.length}`
        );

        if (existingRegistrations.length > 0) {
          const registration = existingRegistrations[0];
          results.push(
            `✅ Service Worker already registered: ${registration.scope}`
          );

          if (registration.active) {
            results.push("✅ Service Worker is active");
          } else if (registration.installing) {
            results.push("⏳ Service Worker is installing");
          } else if (registration.waiting) {
            results.push("⏳ Service Worker is waiting");
          }
        } else {
          // Try to register manually if not already registered
          try {
            const registration = await navigator.serviceWorker.register(
              "/sw.js",
              {
                scope: "/",
              }
            );
            results.push(
              `✅ Service Worker manually registered: ${registration.scope}`
            );

            // Wait for the service worker to be ready
            await navigator.serviceWorker.ready;
            results.push("✅ Service Worker is ready");
          } catch (regError) {
            results.push(`❌ Manual registration failed: ${regError}`);
            // Check if it's a scope or file issue
            if (regError instanceof Error) {
              if (regError.message.includes("scope")) {
                results.push("💡 Hint: Scope issue - try reloading the page");
              } else if (regError.message.includes("script")) {
                results.push(
                  "💡 Hint: Service worker file not found or invalid"
                );
              }
            }
          }
        }

        // Check the current state again
        const finalRegistrations =
          await navigator.serviceWorker.getRegistrations();
        results.push(
          `📊 Final registrations count: ${finalRegistrations.length}`
        );
      } catch (error) {
        results.push(`❌ Service Worker check failed: ${error}`);
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

  const testManifestValidation = async () => {
    const results: string[] = [];

    try {
      // First check if manifest is linked in HTML
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        const href = manifestLink.getAttribute("href");
        results.push(`✅ Manifest link found in HTML: ${href}`);
      } else {
        results.push("❌ No manifest link found in HTML");
      }

      // Try different manifest URLs
      const manifestUrls = [
        "/manifest.json",
        "./manifest.json",
        `${window.location.origin}/manifest.json`,
      ];
      let manifestFound = false;

      for (const url of manifestUrls) {
        try {
          results.push(`🔍 Testing manifest URL: ${url}`);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
          });

          if (response.ok) {
            const manifest = await response.json();
            results.push(`✅ Manifest accessible at: ${url}`);
            results.push(`📊 App name: ${manifest.name || "Not specified"}`);
            results.push(
              `📊 Short name: ${manifest.short_name || "Not specified"}`
            );
            results.push(
              `📊 Start URL: ${manifest.start_url || "Not specified"}`
            );
            results.push(
              `📊 Display mode: ${manifest.display || "Not specified"}`
            );
            results.push(
              `📊 Theme color: ${manifest.theme_color || "Not specified"}`
            );
            results.push(
              `📊 Background color: ${manifest.background_color || "Not specified"}`
            );
            results.push(`📊 Icons count: ${manifest.icons?.length || 0}`);
            if (manifest.icons && manifest.icons.length > 0) {
              manifest.icons.forEach((icon: { src: string; sizes?: string; type?: string }, index: number) => {
                results.push(
                  `   Icon ${index + 1}: ${icon.src} (${icon.sizes || "no size"}, ${icon.type || "no type"})`
                );
              });
            }
            manifestFound = true;
            break;
          } else {
            results.push(
              `❌ ${url} returned status: ${response.status} ${response.statusText}`
            );
          }
        } catch (fetchError) {
          results.push(`❌ Failed to fetch ${url}: ${fetchError}`);
        }
      }

      if (!manifestFound) {
        results.push("❌ Manifest file not accessible from any URL");
        results.push(
          "💡 Hint: Make sure the manifest.json file exists in the public folder"
        );
        results.push(
          "💡 Hint: Check if the app is served over HTTPS or localhost"
        );
        results.push(
          "💡 Hint: Try refreshing the page or clearing browser cache"
        );
      }

      // Check if PWA is installable
      if ("serviceWorker" in navigator && manifestFound) {
        results.push(
          "✅ Basic PWA requirements met (HTTPS + Manifest + Service Worker)"
        );
      }
    } catch (error) {
      results.push(`❌ Manifest validation failed: ${error}`);
      if (
        error instanceof TypeError &&
        error.message.includes("NetworkError")
      ) {
        results.push(
          "💡 Hint: This might be a CORS issue or the server is not running"
        );
      }
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

          <div className="flex justify-between">
            <span>Origin:</span>
            <Badge variant="outline">{debugInfo.origin}</Badge>
          </div>
        </div>

        <div className="grid gap-2">
          <Button onClick={testServiceWorkerRegistration} variant="outline">
            Test Service Worker Registration
          </Button>
          <Button onClick={testNotificationPermission} variant="outline">
            Test Notification Permission
          </Button>
          <Button onClick={testManifestValidation} variant="outline">
            Test Manifest Validation
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium">Test Results:</h4>
            <div className="bg-muted rounded p-3 font-mono text-sm">
              {testResults.map((result, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`test-result-${index}`}>{result}</div>
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
