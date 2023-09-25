export default class API {
	url: URL;
	username: string;
	password: string;
	token: string | null;
	expires: Date | null;

	/** Collegamento con le REST API */
	constructor(url:URL, username:string, password:string){
		this.url = url;
		this.username = username;
		this.password = password;
		this.token = null;
		this.expires = null;
	}

	/** Aggiorna il token */
	async authorize(): Promise<Response> {
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

	/** Restituisce i dati dei sensori presi dal database */
	async getSensorsData(sensor_name:string, start_date:string, end_date:string): Promise<Response> {
		if(!this.expires || this.expires < new Date()) await this.authorize();

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
	async getSensorsName(): Promise<Response> {
		if(!this.expires || this.expires < new Date()) await this.authorize();

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