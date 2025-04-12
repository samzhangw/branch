// Service Worker 版本，更新時需要更新此版本號
const CACHE_VERSION = 'v1';
const CACHE_NAME = `notification-app-${CACHE_VERSION}`;

// 需要緩存的資源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png'
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已開啟緩存');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 處理請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

// 處理推送通知
self.addEventListener('push', event => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || '重要提醒！',
      icon: data.icon || '/favicon-32x32.png',
      badge: data.badge || '/favicon-16x16.png',
      vibrate: data.vibrate || [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || '/'
      },
      actions: data.actions || [
        {
          action: 'explore',
          title: '查看詳情',
          icon: '/favicon-16x16.png'
        },
        {
          action: 'close',
          title: '關閉',
          icon: '/favicon-16x16.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '考試倒數提醒', options)
    );
  } catch (error) {
    console.error('處理推送通知時出錯:', error);
  }
});

// 處理通知點擊事件
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // 點擊通知時打開頁面
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      // 檢查是否已經有窗口打開
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // 如果沒有打開的窗口，則打開新窗口
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 處理通知關閉事件
self.addEventListener('notificationclose', event => {
  // 可以在這裡記錄用戶關閉通知的行為
  console.log('用戶關閉通知');
});

// 處理來自頁面的消息
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay, notificationId } = event.data;
    
    // 調度延遲通知
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: '/favicon-32x32.png',
        badge: '/favicon-16x16.png',
        vibrate: [100, 50, 100],
        tag: notificationId
      });
    }, delay);
  }
}); 