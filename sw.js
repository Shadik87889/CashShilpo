// CashShilpo Service Worker - High Performance & Safe Firebase Pass-Through
const CACHE_NAME = "cashshilpo-app-v1";
const PRECACHE_ASSETS = [
  "/mobile.html",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/lucide@0.452.0/dist/umd/lucide.js",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js",
  "https://unpkg.com/@zxing/library@latest/umd/index.min.js",
  "cashshilpo-official-logo.png",
];

// Install: Cache critical static assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Precache skipped optional assets:", err);
      });
    }),
  );
});

// Activate: Clean up old versions immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch Strategy: Network-first for fresh POS data, fallback to cache
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // NEVER cache Firebase Authentication, Firestore WebSockets, or Gemini API
  if (
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("identitytoolkit") ||
    url.hostname.includes("firestore") ||
    event.request.method !== "GET"
  ) {
    return; // Pass through directly to network
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request)),
  );
});
