// Push Notification Extension for HealthDrive Service Worker
// This code will be dynamically imported by the main service worker

// Push event handler
self.addEventListener("push", function (event) {
  console.info("Push notification received:", event);

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch {
      notificationData = {
        title: "HealthDrive Notification",
        body: event.data.text() || "You have a new notification",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      };
    }
  } else {
    notificationData = {
      title: "HealthDrive Notification",
      body: "You have a new notification",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    };
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || "/favicon.ico",
    badge: notificationData.badge || "/favicon.ico",
    vibrate: [100, 50, 100],
    data: notificationData.data || {},
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/favicon.ico",
      },
      {
        action: "close",
        title: "Close",
        icon: "/favicon.ico",
      },
    ],
    tag: notificationData.tag || "healthdrive-notification",
    renotify: true,
    requireInteraction: false,
    silent: false,
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || "HealthDrive",
      options
    )
  );
});

// Notification click handler
self.addEventListener("notificationclick", function (event) {
  console.info("Notification click received:", event);

  event.notification.close();

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || "/dashboard";
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.info("Push notification extension loaded successfully");
