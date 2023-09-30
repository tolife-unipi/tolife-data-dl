export default class PromiseBucket<T> {

	private readonly items:Promise<T>[];

	constructor() {
		this.items = [];
	}

	/** Aggiunge una Promise */
	put(item:Promise<T>) {
		this.items.push(item);
	}

	/** Attende e ottiene la risposta di una Promise fulfilled/rejected */
	async get() {
		const {value, i} = await Promise.race(this.items.map((promise, i) => promise.then(value => ({ value, i }))));
		this.items.splice(i,1);
		return value;
	}

	/** Controlla se il bucket è vuoto */
	empty() {
		return this.items.length == 0;
	}

	/** Itera per ogni Promise risolata */
	async * iter() {
		while(!this.empty()){
			yield await this.get();
		}
	}
}