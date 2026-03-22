const CACHE_NOME = 'compasso-cache-v1'
const RECURSOS_INICIAIS = ['/', '/index.html', '/manifest.webmanifest', '/vite.svg']

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
    evento.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone()
          caches.open(CACHE_NOME).then((cache) => cache.put(request, copia))
          return resposta
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NOME)
          return (await cache.match(request)) || (await cache.match('/index.html'))
        })
    )
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
