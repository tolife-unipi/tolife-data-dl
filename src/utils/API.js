export default class API {

	/**
	 * Collegamento con le REST API
	 * @param {URL} url 
	 * @param {string} username 
	 * @param {string} password 
	 */
	constructor(url, username, password){
		this.url = url;
		this.username = username;
		this.password = password;
		this.token = null;
		this.expires = null;
	}

	/** Aggiorna il token */
	async authorize(){
		const res = await fetch(new URL('authorize',this.url), {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'user': this.username,
				'password': this.password,
			})
		});
		if(res.ok){
			// se il login ha avuto successo mi salvo il token
			const content = await res.json();
			this.token = content.access_token;
			this.expires = new Date(Date.now() + content.expires_in * 1000)
		}
		return res;
	}

	/**
	 * Restituisce i dati dei sensori presi dal database
	 * @param {string} sensor_name 
	 * @param {string} start_date 
	 * @param {string} end_date 
	 */
	async getSensorsData(sensor_name, start_date, end_date){
		if(this.expires < new Date()) await this.authorize();

		const url = new URL(`sensors/${sensor_name}/filterByDate`,this.url);
		url.search = new URLSearchParams({
			start_date: start_date,
			end_date: end_date 
		}).toString();

		const res = await fetch(url, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${this.token}`
			},
		});

		return res;
	}

	/** Restituisce la lista dei nomi dei sensori. */
	async getSensorsName(){
		if(this.expires < new Date()) await this.authorize();

		const url = new URL('sensors',this.url);

		const res = await fetch(url, {
			method: "GET",
			headers: {
				'Authorization': `Bearer ${this.token}`
			},
		});

		return res;
	}
}