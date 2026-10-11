// Service worker — reçoit les notifications push et ouvre l'app au toucher.
// Aucune mise en cache ici : il ne sert qu'aux notifications.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  const title = data.title || 'Mon Petit Vote 2027'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/favicon.png',
      tag: data.tag || undefined,
      data: { url: data.url || '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (new URL(c.url).origin === self.location.origin && 'focus' in c) return c.focus()
      }
      return self.clients.openWindow(target)
    }),
  )
})
