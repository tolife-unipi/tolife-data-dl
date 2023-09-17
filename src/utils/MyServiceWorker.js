// const isLocalhost = Boolean(
// 	window.location.hostname === 'localhost' ||
// 	// [::1] is the IPv6 localhost address.
// 	window.location.hostname === '[::1]' ||
// 	// 127.0.0.0/8 are considered localhost for IPv4.
// 	window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
// );

export default class MyServiceWorker {
	static register(){

		if(process.env.NODE_ENV !== 'production') return;

		if ('serviceWorker' in navigator) {
			// The URL constructor is available in all browsers that support SW.
			const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
			if (publicUrl.origin !== window.location.origin) {
				// Our service worker won't work if PUBLIC_URL is on a different origin
				// from what our page is served on. This might happen if a CDN is used to
				// serve assets; see https://github.com/facebook/create-react-app/issues/2374
				return;
			}
	
			window.addEventListener('load', async () => {
				const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
				await navigator.serviceWorker.register(swUrl);
			});
		}
	}
}
