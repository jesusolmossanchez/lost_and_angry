// sw.js
self.addEventListener('install', e => {
 e.waitUntil(
   // after the service worker is installed,
   // open a new cache
   caches.open('my-pwa-cache').then(cache => {
     // add all URLs of resources we want to cache
     return cache.addAll([
       '/',
       '/index.html',
       '/Bullet.js',
       '/Zapatilla.js',
       '/Explosion.js',
       '/Enemigo.js',
       '/Boss.js',
       '/Player.js',
       '/tiny_music.js',
       '/player-small.js',
       '/Game.js',
     ]);
   })
 );
});