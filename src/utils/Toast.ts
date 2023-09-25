
/** Crea un messaggio Toast. */
export default function Toast(msg: string) {
	let toast = document.createElement('div');
	toast.classList.add('Toast');

	let time = 3000;

	toast.appendChild(document.createTextNode(msg));
	document.body.appendChild(toast);

	setTimeout(function(){
		toast.classList.add("active");
		setTimeout(function(){
			toast.classList.remove("active");
			setTimeout(function(){
				document.body.removeChild(toast);
			}, time+500);
		},time);
	}, 1);
}