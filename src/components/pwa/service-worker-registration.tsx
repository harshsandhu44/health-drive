"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.info("Service Worker not supported");
      return;
    }

    const registerServiceWorker = async () => {
      try {
        // First check if there's already a registration
        const existingRegistrations =
          await navigator.serviceWorker.getRegistrations();

        if (existingRegistrations.length > 0) {
          console.info("Service Worker already registered");

          // Wait for the service worker to be ready
          const readyRegistration = await navigator.serviceWorker.ready;
          console.info(
            "Service worker ready for push notifications:",
            readyRegistration
          );

          // Try to import push notification functionality
          if (readyRegistration.active) {
            try {
              readyRegistration.active.postMessage({
                type: "IMPORT_PUSH_EXTENSION",
                url: "/sw-push-extension.js",
              });
              console.info("Push extension import message sent");
            } catch (msgError) {
              console.warn("Failed to send push extension message:", msgError);
            }
          }
        } else {
          // Let next-pwa handle automatic registration, but provide fallback
          console.info("Waiting for next-pwa to register service worker...");

          // Wait a bit for next-pwa to register, then check again
          setTimeout(async () => {
            try {
              const registrations =
                await navigator.serviceWorker.getRegistrations();
              if (registrations.length === 0) {
                console.info("Attempting manual service worker registration");
                await navigator.serviceWorker.register("/sw.js", {
                  scope: "/",
                });
              }
            } catch (error) {
              console.warn("Manual service worker registration failed:", error);
            }
          }, 1000);
        }

        // Add global message handling for service worker communication
        navigator.serviceWorker.addEventListener("message", event => {
          console.info("Message from service worker:", event.data);
        });

        // Listen for service worker updates
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          console.info("Service worker controller changed");
        });
      } catch (error) {
        console.warn("Service worker setup failed:", error);
      }
    };

    // Start the registration process
    registerServiceWorker();

    // Check for Push Manager support
    if ("PushManager" in window) {
      console.info("Push Manager is supported");
    } else {
      console.warn("Push Manager is not supported");
    }
  }, []);

  return null; // This component doesn't render anything
}
