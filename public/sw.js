const CACHE_NOME = 'compasso-cache-v2'
const RECURSOS_INICIAIS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/brand/compasso-favicon.svg',
  '/brand/compasso-app-icon.svg',
]

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(RECURSOS_INICIAIS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NOME)
          .map((nome) => caches.delete(nome))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (evento) => {
  const { request } = evento

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    evento.respondWith((async () => {
      const cache = await caches.open(CACHE_NOME)

      try {
        const resposta = await fetch(request)

        if (resposta.ok) {
          cache.put(request, resposta.clone())
          return resposta
        }

        // Em hospedagem estática, refresh de rota SPA pode responder 404: serve o shell do app.
        const fallbackCache = await cache.match('/index.html')
        if (fallbackCache) {
          return fallbackCache
        }

        const indexRede = await fetch('/index.html')
        if (indexRede.ok) {
          cache.put('/index.html', indexRede.clone())
          return indexRede
        }

        return resposta
      } catch {
        const fallbackCache = await cache.match('/index.html')
        if (fallbackCache) {
          return fallbackCache
        }

        return new Response('Offline', { status: 503 })
      }
    })())
    return
  }

  evento.respondWith(
    caches.match(request).then((emCache) => {
      if (emCache) {
        return emCache
      }

      return fetch(request)
        .then((resposta) => {
          const copia = resposta.clone()
          caches.open(CACHE_NOME).then((cache) => cache.put(request, copia))
          return resposta
        })
        .catch(() => caches.match('/index.html'))
    })
  )
})
