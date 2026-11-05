self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // 空的 fetch 监听器即可满足安卓 Chrome 的 PWA 安装检测
});

// 点击通知栏的交互逻辑
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // 点击后关闭通知
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 看看有没有已经打开的网页
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          // 如果网页开着，发送一条消息让网页跳转，并切回网页
          client.postMessage({ action: 'openChat' });
          return client.focus();
        }
      }
      // 如果网页没开，打开一个新网页，并带一个参数
      if (clients.openWindow) {
        return clients.openWindow('./?action=chat');
      }
    })
  );
});