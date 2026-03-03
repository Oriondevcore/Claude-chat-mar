javascript
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('orion-v1').then(cache => 
      cache.addAll(['/', './index.html', './config.js'])
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => 
      response || fetch(e.request)
    )
  );
});