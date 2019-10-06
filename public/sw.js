// Version of the offline cache (change this value everytime you want to update cache)
const CACHE_NAME = 'skEditor-1.0.0.6'              

// Add a path you want to cache in this list.

/*
<link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="lib/toast.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js" integrity="sha256-nRoO8HoupfqozUr7YKBRgHXmdx40Hl/04OSBzv7e7L8=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js" integrity="sha256-KsRuvuRtUVvobe66OFtOQfjP8WA2SzYsmm4VPfMnxms=" crossorigin="anonymous"></script>
    <script src="ace/ace.js"></script>
    <script src="lib/codeblast.js"></script>
    <script src="ace/ext-split.js"></script>
    <script src="ace/ext-language_tools.js"></script>
    <script src="lib/toast.js"></script>
    <script src="/blocks/blockly_compressed.js"></script>
    <script src="/blocks/blocks_compressed.js"></script>
    <script src="/blocks/py.js"></script>
    <script src="/blocks/msg/js/en.js"></script>
    <script src="/scripts/script.js"></script>
    <script src="/scripts/blockly.js"></script>
*/
const URLS = [                
  '/',
  '/app',
  'ace/ace.js',
  'lib/codeblast.js',
  'ace/ext-split.js',
  'ace/ext-prompt.js',
  'ace/ext-searchbox.js',
  'ace/ext-language_tools.js',
  'scripts/script.js',
  'styles/main.css',
  'styles/index.css',
  'images/link.svg',
  'images/brush.svg',
  'images/download.svg',
  'images/file.svg',
  'images/options.svg',
  'images/refresh.svg',
  'images/upload.svg',
  'images/share.svg',
  'images/discord.svg',
  'images/home.svg',
  'images/blockly.svg',
  'images/example.svg',
  'ace/mode-skript.js',
  'manifest.json',
  'lib/toast.js',
  'blocks/blockly_compressed.js',
  'blocks/blocks_compressed.js',
  'blocks/py.js',
  'scripts/blockly.js',
  'scripts/main.js',
  'scripts/multi.js',
  'blocks/msg/js/en.js',
  'https://fonts.googleapis.com/css?family=Inconsolata',
  'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js',
  'https://fonts.gstatic.com/s/inconsolata/v17/QldKNThLqRwH-OJ1UHjlKGlZ5qg.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
  'lib/toast.css',
  'favicon.ico'
]

// Respond with cached resources
// This is called everytime the browser requests resources from the server
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(request => {
      if (request) {
        return request
      } else {
        // if there are no cache, try fetching request
        return fetch(e.request)
      }
    })
  )
});

// Cache resources
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
));

// Delete outdated caches
self.addEventListener('activate', e => {
  if (navigator.onLine) self.skipWaiting();
  e.waitUntil(
    caches.keys().then(keyList => {
      // `keyList` contains all cache names under appname.glitch.me domain
      return Promise.all(keyList.map((key, i) => {
        if (keyList[i] !== CACHE_NAME) {
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})