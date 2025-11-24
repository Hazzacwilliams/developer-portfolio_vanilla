/**
 * Service Worker for Portfolio Site
 * Provides offline support and caching for better performance
 */

const CACHE_NAME = 'harry-portfolio-v1';
const STATIC_CACHE_NAME = 'harry-portfolio-static-v1';
const DYNAMIC_CACHE_NAME = 'harry-portfolio-dynamic-v1';

// Resources to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/home.css',
    '/css/aboutme.css',
    '/css/projects.css',
    '/css/contact.css',
    '/css/skills.css',
    '/js/main.js',
    '/js/util/loadComponent.js',
    '/js/util/backgroundAnimation.js',
    '/manifest.json',
    '/html/home.html',
    '/html/aboutme.html',
    '/html/projects.html',
    '/html/contact.html',
    '/html/skills.html',
    '/assets/linkedin.png',
    '/assets/email.png',
    '/assets/github.png',
    '/assets/arrow.png',
    '/assets/download.gif',
    '/assets/harry_pic.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((err) => {
                console.error('[Service Worker] Cache install failed:', err);
            })
    );
    self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE_NAME && 
                        cacheName !== DYNAMIC_CACHE_NAME &&
                        cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Take control of all pages
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests (except for fonts and images we control)
    if (url.origin !== location.origin && 
        !url.href.includes('fonts.googleapis.com') &&
        !url.href.includes('fonts.gstatic.com')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // If network fails and it's a navigation request, return offline page
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

