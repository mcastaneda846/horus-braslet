// Service Worker mejorado para HORUS AID - Offline First
const CACHE_NAME = 'horus-v3';
const STATIC_CACHE = 'horus-static-v3';

// Instalar: cachear la página principal
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(['/'])
          .catch((err) => console.log('Cache addAll warning:', err));
      }),
      caches.open(CACHE_NAME), // Crear cache dinámico
    ])
  );
  self.skipWaiting();
});

// Activar: limpiar cachés viejos y controlar todas las páginas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first con caching inteligente
self.addEventListener('fetch', (event) => {
  // Solo cachear GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar extensiones del navegador
  if (event.request.url.includes('chrome-extension') || 
      event.request.url.includes('about:')) {
    return;
  }

  event.respondWith(
    fetch(event.request, { credentials: 'same-origin' })
      .then((response) => {
        // Cachear TODAS las respuestas HTML, JSON, CSS, JS exitosas
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Cachear la URL exacta
            cache.put(event.request, responseToCache);
            // Para navegación, también cachear sin query params (útil para Next.js)
            if (event.request.mode === 'navigate') {
              const urlNoQuery = new URL(event.request.url);
              urlNoQuery.search = '';
              cache.put(urlNoQuery.toString(), responseToCache.clone());
            }
          });
        }
        return response;
      })
      .catch(() => {
        // OFFLINE: buscar en cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback: intent sin query params
            const urlNoQuery = new URL(event.request.url);
            urlNoQuery.search = '';
            return caches.match(urlNoQuery.toString());
          })
          .then((response) => {
            if (response) {
              return response;
            }
            // Última oportunidad: devolver la página principal si es navegación
            if (event.request.mode === 'navigate') {
              return caches.match('/').then((homePage) => {
                if (homePage) return homePage;
                // Si ni homepage existe, mostrar error offline
                return new Response(
                  '<html><body style="font-family:system-ui;text-align:center;margin-top:100px;color:#666;"><h1>⚠️ Sin conexión</h1><p>Navega primero a través de la app antes de ir offline.</p><p style="margin-top:30px;"><a href="/" style="color:#e11d48;text-decoration:none;font-weight:bold;">← Ir al inicio</a></p></body></html>',
                  {
                    status: 503,
                    statusText: 'Offline',
                    headers: { 'Content-Type': 'text/html; charset=utf-8' }
                  }
                );
              });
            }
            // Para fetch/API, devuelve JSON error
            return new Response(
              JSON.stringify({ offline: true, error: 'Content not available offline' }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
      })
  );
});

