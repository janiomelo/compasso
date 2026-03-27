async function desregistrarServiceWorkers() {
  const obterRegistros = navigator.serviceWorker.getRegistrations?.bind(navigator.serviceWorker)

  if (!obterRegistros) {
    return
  }

  const registros = await obterRegistros()

  await Promise.all(registros.map((registro) => registro.unregister()))
}

async function limparCachesCompasso() {
  if (!('caches' in window)) {
    return
  }

  const nomes = await caches.keys()
  const cachesCompasso = nomes.filter((nome) => nome.startsWith('compasso-cache-'))

  await Promise.all(cachesCompasso.map((nome) => caches.delete(nome)))
}

export function registrarServiceWorker(opcoes?: { emProducao?: boolean }) {
  if (!('serviceWorker' in navigator)) {
    return
  }

  const emProducao = opcoes?.emProducao ?? import.meta.env.PROD

  if (!emProducao) {
    void desregistrarServiceWorkers()
    void limparCachesCompasso()
    return
  }

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}
