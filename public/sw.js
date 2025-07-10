if (!self.define) {
  let e,
    s = {};
  const n = (n, t) => (
    (n = new URL(n + ".js", t).href),
    s[n] ||
      new Promise(s => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = n), (e.onload = s), document.head.appendChild(e));
        } else ((e = n), importScripts(n), s());
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (t, a) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let c = {};
    const o = e => n(e, i),
      g = { module: { uri: i }, exports: c, require: o };
    s[i] = Promise.all(t.map(e => g[e] || o(e))).then(e => (a(...e), c));
  };
}
define(["./workbox-4d767a27"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/4bd1b696-7b9071663a568a36.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/684-c811d77aa69ae8c6.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/96-0ab8e11fe74c5a49.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-2fd6c753896f80b2.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/app/debug/page-9a1f06051d7a7608.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/app/layout-97a6b24a9e084c7d.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/app/page-687dfdffc8d1b6e5.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/framework-f593a28cde54158e.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/main-app-e9d35b36d44abc83.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/main-f29a91b54d9f0d5d.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/pages/_app-da15c11dea942c36.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-60d835819e29e072.js",
          revision: "e1gZgwFpDu7U1H8XFPQlg",
        },
        {
          url: "/_next/static/css/f644a69cea58ac4f.css",
          revision: "f644a69cea58ac4f",
        },
        {
          url: "/_next/static/e1gZgwFpDu7U1H8XFPQlg/_buildManifest.js",
          revision: "8530c93ba1dea85e7b43c535dae5a926",
        },
        {
          url: "/_next/static/e1gZgwFpDu7U1H8XFPQlg/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/audio/notification.wav",
          revision: "7215ee9c7d9dc229d2921a40e899ec5f",
        },
        { url: "/manifest.json", revision: "23acc8d623f1c476b49a1b3c18649d76" },
        {
          url: "/sw-push-extension.js",
          revision: "08806929535f5c74fd39b26be9bf2a94",
        },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: t,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.googleapis\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.gstatic\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/api\/.*$/i,
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /.*/i,
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ));
});
