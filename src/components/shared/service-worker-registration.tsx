"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Let next-pwa handle the service worker registration automatically
    // We just need to wait for it to be ready
    navigator.serviceWorker.ready
      .then((registration) => {
        console.info(
          "Service worker ready for push notifications:",
          registration
        );

        // Import push notification functionality into the service worker
        if (registration.active) {
          registration.active.postMessage({
            type: "IMPORT_PUSH_EXTENSION",
            url: "/sw-push-extension.js",
          });
        }

        // Add message handling for communication between main thread and service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          console.info("Message from service worker:", event.data);
        });
      })
      .catch((error) => {
        console.warn("Service worker not ready:", error);
      });

    // Listen for push events in the main thread (for testing)
    if ("PushManager" in window) {
      console.info("Push Manager is supported");
    }
  }, []);

  return null; // This component doesn't render anything
}
