const VERSION = process.env.APP_VERSION;
const CACHE_NAME = "cache" + VERSION;

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener('fetch', async (event) => {
    if(event.request.destination === "document" || event.request.destination === "script"){
        // Network first, falling back to cache
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                try {
                    const fetchedResponse = await fetch(event.request);
                    cache.put(event.request, fetchedResponse.clone());
                    return fetchedResponse;
                } catch(error) {
                    return await cache.match(event.request);
                }
            })
        );
    } else {
        // Stale-while-revalidate
        event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(event.request);
            const fetchedResponse = await fetch(event.request)
            .then((networkResponse) => {
				if(event.request.method === 'GET')
                	cache.put(event.request, networkResponse.clone());
                return networkResponse;
            })
            .catch(() => cachedResponse);
            return cachedResponse || fetchedResponse;
        }));
    }
});