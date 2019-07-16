// Version of the offline cache (change this value everytime you want to update cache)
var CACHE_NAME = 've01'              

// Add a path you want to cache in this list.
var URLS = [                
  '/',
  '/app',
  'ace/ace.js',
  'lib/codeblast.js',
  'ace/ext-split.js',
  'ace/ext-language_tools.js',
  'scripts/script.js',
  'styles/main.css',
  'images/hash.svg',
  'images/brush.svg',
  'images/download.svg',
  'images/file.svg',
  'images/logo.svg',
  'images/options.svg',
  'images/refresh.svg',
  'images/upload.svg',
  'ace/mode-skript.js',
  'manifest.json',
  'https://fonts.googleapis.com/css?family=Inconsolata',
  'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js',
  'https://fonts.gstatic.com/s/inconsolata/v17/QldKNThLqRwH-OJ1UHjlKGlZ5qg.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'
]
console.log(navigator)
console.log(navigator.geolocation)

// Respond with cached resources
// This is called everytime the browser requests resources from the server
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {
        // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      // cache everything listed on URLS list 
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under appname.glitch.me domain
      return Promise.all(keyList.map(function (key, i) {
        if (keyList[i] !== CACHE_NAME) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})