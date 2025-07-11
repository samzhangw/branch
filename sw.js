// Service Worker 版本，更新時需要更新此版本號
const CACHE_VERSION = 'v3';
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
    }).then(() => {
      // 確保 Service Worker 立即控制所有頁面
      self.clients.claim();
      
      // 設置每日通知計時器
      setupDailyNotifications();
    })
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

// 設置每日提醒的時間 (24小時制)
const DAILY_NOTIFICATION_HOUR = 8; // 早上8點
const DAILY_NOTIFICATION_MINUTE = 0; // 0分

// 計算距離下一次通知的時間（毫秒）
function getTimeUntilNextNotification() {
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    DAILY_NOTIFICATION_HOUR,
    DAILY_NOTIFICATION_MINUTE
  );
  
  // 如果今天的目標時間已經過了，則設置為明天的同一時間
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  
  return targetTime.getTime() - now.getTime();
}

// 設置每日通知計時器
function setupDailyNotifications() {
  // 獲取目標考試日期 (2026/7/10 - 分科測驗)
  const targetDate = new Date('2026-07-10T08:00:00+08:00');
  
  // 計算下一次通知的延遲時間
  const delayUntilNextNotification = getTimeUntilNextNotification();
  
  // 設置定時器，在指定時間發送通知
  setTimeout(() => {
    // 計算距離考試的剩餘天數
    const now = new Date();
    const timeDifference = targetDate - now;
    
    // 如果考試已經過去，則不發送通知
    if (timeDifference <= 0) {
      console.log('考試已經過去，不發送每日通知');
      return;
    }
    
    // 計算剩餘天數
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
    // 獲取今天是周幾
    const dayOfWeek = now.toLocaleDateString('zh-TW', { weekday: 'long' });
    
    // 根據剩餘天數生成不同的通知內容
    let notificationTitle = `距離115年分科測驗還有 ${daysRemaining} 天`;
    let notificationBody = '加油！持續努力，保持良好狀態！';
    
    // 根據剩餘天數定制消息
    if (daysRemaining <= 7) {
      notificationBody = '最後一週，調整好心態，放鬆備考！';
    } else if (daysRemaining <= 30) {
      notificationBody = '進入最後衝刺階段，做好複習規劃，加油！';
    } else if (daysRemaining <= 100) {
      notificationBody = '善用每一天，堅持不懈，你會看到成果！';
    }
    
    // 添加每週一句鼓勵語
    const motivationalMessages = [
      '今天的努力，決定明天的高度！',
      '堅持到底，才能無所畏懼！',
      '每一天都是變得更好的機會！',
      '別忘了提醒自己，你離成功又近了一步！',
      '即使緩慢，也要不斷前進！',
      '今日復習，明日自信！',
      '專注當下，未來可期！'
    ];
    
    // 根據今天是周幾選擇不同的鼓勵語
    const dayIndex = now.getDay(); // 0 是周日，1-6 是周一到周六
    const motivationalMessage = motivationalMessages[dayIndex];
    
    // 在通知標題中添加今天是星期幾
    notificationTitle = `【${dayOfWeek}】${notificationTitle}`;
    
    // 發送通知
    self.registration.showNotification(notificationTitle, {
      body: `${notificationBody}\n\n${motivationalMessage}`,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-16x16.png',
      vibrate: [100, 50, 100],
      tag: 'daily-notification',
      data: {
        dateOfArrival: Date.now(),
        daysRemaining: daysRemaining,
        url: '/'
      }
    });
    
    // 重新設置每日通知計時器（24小時後）
    setTimeout(() => {
      setupDailyNotifications();
    }, 24 * 60 * 60 * 1000);
    
  }, delayUntilNextNotification);
  
  console.log(`每日通知已設置，將在 ${new Date(Date.now() + delayUntilNextNotification).toLocaleString()} 發送`);
}

// 處理來自頁面的消息
self.addEventListener('message', event => {
  if (event.data) {
    // 處理安排通知
    if (event.data.type === 'SCHEDULE_NOTIFICATION') {
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
    
    // 處理啟用/禁用每日通知的消息
    else if (event.data.type === 'TOGGLE_DAILY_NOTIFICATIONS') {
      const { enabled } = event.data;
      
      // 保存設置
      self.dailyNotificationsEnabled = enabled;
      
      // 如果啟用，立即設置每日通知
      if (enabled) {
        setupDailyNotifications();
        
        // 回覆客戶端
        event.source.postMessage({
          type: 'DAILY_NOTIFICATIONS_STATUS',
          enabled: true,
          message: '每日通知已啟用'
        });
      } else {
        // 回覆客戶端
        event.source.postMessage({
          type: 'DAILY_NOTIFICATIONS_STATUS',
          enabled: false,
          message: '每日通知已禁用'
        });
      }
    }
    
    // 獲取每日通知狀態
    else if (event.data.type === 'GET_DAILY_NOTIFICATIONS_STATUS') {
      event.source.postMessage({
        type: 'DAILY_NOTIFICATIONS_STATUS',
        enabled: !!self.dailyNotificationsEnabled,
        message: self.dailyNotificationsEnabled ? '每日通知已啟用' : '每日通知未啟用'
      });
    }
    
    // 立即發送測試通知
    else if (event.data.type === 'SEND_TEST_DAILY_NOTIFICATION') {
      const now = new Date();
      const targetDate = new Date('2025-07-11T08:00:00+08:00');
      const timeDifference = targetDate - now;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      
      self.registration.showNotification(`測試每日通知：距離分科測驗還有 ${daysRemaining} 天`, {
        body: '這是一條測試通知，確認您的每日通知功能正常運作。\n\n加油！持續努力，保持良好狀態！',
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-16x16.png',
        vibrate: [100, 50, 100],
        tag: 'test-daily-notification'
      });
      
      // 回覆客戶端
      event.source.postMessage({
        type: 'TEST_NOTIFICATION_SENT',
        success: true
      });
    }
  }
}); 