export default class MyServiceWorker {
	static register(){

		// Se non siamo in ambiente di produzione
		if(process.env.NODE_ENV !== 'production') return;

		if ('serviceWorker' in navigator) {
			const publicUrl = new URL(import.meta.env.BASE_URL as string, window.location.href);
			if (publicUrl.origin !== window.location.origin) {
				return;
			}
	
			window.addEventListener('load', async () => {
				const swUrl = `${import.meta.env.BASE_URL}/service-worker.js`;
				await navigator.serviceWorker.register(swUrl);
			});
		}
	}
}
