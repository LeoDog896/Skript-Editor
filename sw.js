self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('skript-editor').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.html?',
       '/styles.css',
       '/script.js',
     ]);
   })
 );
});