const cacheName = 'cache-todolist';
const appInterfaz = [
    '/',
    'index.html',
    'css/style.css',
    'css/bootstrap.min.css',
    'js/bootstrap.min.js',
    'manifest.json',
    'firebase.js',
    'config.js',
    'app.js',
    'sw.js',
    'images/android-icon-36x36.png',
    'images/android-icon-48x48.png',
    'images/android-icon-72x72.png',
    'images/android-icon-96x96.png',
    'images/android-icon-144x144.png',
    'images/android-icon-192x192.png',
    'images/apple-icon-57x57.png',
    'images/apple-icon-60x60.png',
    'images/apple-icon-72x72.png',
    'images/apple-icon-76x76.png',
    'images/apple-icon-114x114.png',
    'images/apple-icon-120x120.png',
    'images/apple-icon-144x144.png',
    'images/apple-icon-152x152.png',
    'images/apple-icon-180x180.png',
    'images/apple-icon-precomposed.png',
    'images/apple-icon.png',
    'browserconfig.xml',
    'images/favicon-16x16.png',
    'images/favicon-32x32.png',
    'images/favicon-96x96.png',
    'images/favicon.ico',
    'images/ms-icon-70x70.png',
    'images/ms-icon-144x144.png',
    'images/ms-icon-150x150.png',
    'images/ms-icon-310x310.png',
    
]

self.addEventListener('install', (evento) => {    
    const cache = caches.open(cacheName).then(cache => {
        return cache.addAll(appInterfaz);
    });
    // Espero hasta que la promesa se resuelva
    evento.waitUntil(cache);
});

self.addEventListener('activate', (evento) => {
console.log(appInterfaz)
})

// self.addEventListener('fetch', (evento) => {
//     const respCache = caches.match(evento.request).then(res => {
//         if (res) {
//             return res;
//         } else {
//             return fetch(evento.request).then(repsNet => {
//                 return repsNet
//             })
//         }
//     })


//     //console.log(respCache)
//     evento.respondWith(respCache);
// })
self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        const respuesta = fetch(event.request).then(respuestaNetwork => {
            return caches.open('mi-cache-1').then(cache => {
                cache.put(event.request, respuestaNetwork.clone());
                return respuestaNetwork;
            });
        }).catch(error => {
            return caches.match(event.request);
        });

        event.respondWith(respuesta);
    } else {
        // Si el método no es GET, simplemente continuamos con la solicitud sin intentar almacenarla en caché
        event.respondWith(fetch(event.request));
    }
});
