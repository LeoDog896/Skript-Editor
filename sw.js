var CACHE_NAME = 'skript-editor';
var urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/logo.svg',
  '/upload.svg',
  '/download.svg',
  '/file.svg',
  'https://ajaxorg.github.io/ace-builds/src-min-noconflict/ace.js',
  '/?',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
self.addEventListener('activate', function(event) {
  caches.keys().then(function(names) {
    for (let name of names)
        caches.delete(name);
  });
});
