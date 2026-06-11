const CACHE = 'eitango-v19';
const PRECACHE = [
  '/kood/',
  '/kood/index.html',
  '/kood/icon-192.png',
  '/kood/icon-512.png',
  '/kood/icon-180.png',
  '/kood/manifest.json',
];

// インストール：必要ファイルをキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// アクティベート：古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ：キャッシュ優先、なければネット
self.addEventListener('fetch', e => {
  // Googleフォント等の外部リソースはネットを優先
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
