// AINAV.ART Service Worker - PWA缓存和离线支持
// 版本号 - 更新时需要修改
const CACHE_VERSION = 'ainav-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/cn/',
  '/cn/index.html',
  '/en/index.html',
  '/cn/about.html',
  '/compare.html',
  '/faq.html',
  '/assets/css/bootstrap.css',
  '/assets/css/xenon-core.css',
  '/assets/css/xenon-components.css',
  '/assets/css/nav.css',
  '/assets/js/jquery-1.11.1.min.js',
  '/assets/js/bootstrap.min.js',
  '/assets/js/xenon-custom.js',
  '/assets/js/lozad.js',
  '/assets/images/AInavLogo.png',
  '/assets/images/flags/flag-cn.png',
  '/assets/images/flags/flag-us.png',
  '/manifest.json'
];

// 需要缓存的AI工具Logo
const AI_TOOL_LOGOS = [
  '/assets/images/logos/chatgpt.png',
  '/assets/images/logos/claude.png',
  '/assets/images/logos/midjourney.png',
  '/assets/images/logos/DALL-E.png',
  '/assets/images/logos/stable-diffusion.png',
  '/assets/images/logos/gemini.png',
  '/assets/images/logos/suno.png',
  '/assets/images/logos/sora.png',
  '/assets/images/logos/runway.png',
  '/assets/images/logos/leonardo.png',
  '/assets/images/logos/copilot.png',
  '/assets/images/logos/perplexity.png'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      // 缓存AI工具Logo
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching AI tool logos...');
        return cache.addAll(AI_TOOL_LOGOS.map(logo => {
          return new Request(logo, { mode: 'no-cors' });
        }));
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      // 强制激活新的Service Worker
      return self.skipWaiting();
    }).catch(error => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除旧版本的缓存
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// 获取事件 - 处理网络请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }
  
  // 不缓存的请求类型
  if (request.method !== 'GET' || 
      url.pathname.includes('/api/') ||
      url.pathname.includes('ads.txt') ||
      url.pathname.includes('robots.txt') ||
      url.pathname.includes('sitemap.xml')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // 如果有缓存，返回缓存
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', request.url);
        
        // 对于HTML页面，在后台更新缓存
        if (request.headers.get('accept').includes('text/html')) {
          event.waitUntil(updateCache(request));
        }
        
        return cachedResponse;
      }
      
      // 没有缓存，从网络获取
      return fetch(request).then(networkResponse => {
        // 检查响应是否有效
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        // 克隆响应用于缓存
        const responseToCache = networkResponse.clone();
        
        // 决定使用哪个缓存
        const cacheToUse = shouldCacheInStatic(request) ? STATIC_CACHE : DYNAMIC_CACHE;
        
        // 异步缓存响应
        event.waitUntil(
          caches.open(cacheToUse).then(cache => {
            console.log('[SW] Caching new resource:', request.url);
            return cache.put(request, responseToCache);
          })
        );
        
        return networkResponse;
      }).catch(error => {
        console.error('[SW] Fetch failed:', error);
        
        // 如果是HTML页面请求失败，返回离线页面
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/cn/index.html');
        }
        
        // 其他资源请求失败，返回错误
        throw error;
      });
    })
  );
});

// 后台更新缓存
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse);
      console.log('[SW] Cache updated:', request.url);
    }
  } catch (error) {
    console.error('[SW] Cache update failed:', error);
  }
}

// 判断是否应该缓存到静态缓存
function shouldCacheInStatic(request) {
  const url = new URL(request.url);
  
  // CSS, JS, 图片等静态资源
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    return true;
  }
  
  // 主要HTML页面
  if (url.pathname === '/' || 
      url.pathname === '/cn/' || 
      url.pathname === '/en/' ||
      url.pathname.includes('/cn/index.html') ||
      url.pathname.includes('/en/index.html')) {
    return true;
  }
  
  return false;
}

// 消息处理 - 与主线程通信
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// 获取缓存信息
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    cacheInfo[cacheName] = keys.length;
  }
  
  return cacheInfo;
}

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('[SW] All caches cleared');
}

// 后台同步 - 离线时的数据同步
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // 这里可以添加离线时需要同步的数据
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// 推送通知处理
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/images/AInavLogo.png',
    badge: '/assets/images/AInavLogo.png',
    data: data.url,
    actions: [
      {
        action: 'open',
        title: '查看详情'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

// 错误处理
self.addEventListener('error', event => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker loaded successfully');
