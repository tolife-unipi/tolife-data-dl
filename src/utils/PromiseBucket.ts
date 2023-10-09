export default class PromiseBucket<T> {

	/** Elenco di richieste non ancora risolte */
	private readonly promises:Promise<T>[];
	/** Elenco di richieste risolte */
	private readonly items:T[];
	/** Numero massimo di Promise non ancora risolte */
	private readonly limit?:number;

	/**
	 * Classe che gestisce più Promise in parallelo
	 * @param limit Limite massimo di Promise non ancora risolte
	 */
	constructor(limit?:number) {
		this.promises = []
		this.items = [];
		this.limit = limit
	}

	/** Aggiunge una Promise */
	async put(item:Promise<T>) {

		this.promises.push(item);

		// Se c'è un limite ed è stato raggiunto
		if(this.limit && this.promises.length >= this.limit){
			// Attende che una Promise venga risolta
			const res = await this.resolve();
			// L'aggiunge all'elenco delle Promise risolte
			this.items.push(res)
		}
	}

	/** Attende e ottiene la risposta di una Promise fulfilled/rejected */
	private async resolve() {
		const {value, i} = await Promise.race(this.promises.map((promise, i) => promise.then(value => ({ value, i }))));
		this.promises.splice(i,1);
		return value;
	}

	/** Restituisce un elemento risolto o attende la conclusione di una Promise */
	async get() {
		// Se c'è qualcosa in items
		if(this.items.length > 0) return this.items.shift() as T;
		// Altrimenti attende
		else return await this.resolve()
	}

	/** Controlla se il bucket è vuoto */
	empty() {
		return this.items.length == 0 && this.promises.length == 0;
	}

	/** Itera per ogni Promise risolata */
	async * iter() {
		while(!this.empty()){
			yield await this.get();
		}
	}
}