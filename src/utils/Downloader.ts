import JSZip from "jszip";
import API from "./API"

interface SensorData {
	kit_id: string,
	timestamp: number,
	[propName: string]: any
}

interface KitData {
	[sensor_name:string]: SensorData[]
}

interface ContentData {
	[kit_id:string]: KitData
}

export default class Downloader {
	api: API;

	constructor(api:API) {
		this.api = api;
	}

	/** Restituisce i dati dei sensori relativi ai kit id selezionati */
	async fetchData(kits:string[], sensors:string[], start_date:string, end_date:string) {

		const data:ContentData = {}

		const requests = sensors.map(
			async (sensor_name):Promise<[string, Response]> => {
				return [
					sensor_name, 
					await this.api.getSensorsData(sensor_name, start_date, end_date)
				];
			}
		);
		const responses = await Promise.all(requests);
		const errors = responses.filter(([_, response]) => !response.ok);
		if(errors.length > 0){
			// Nel caso ci fosse qualche errore
			throw errors.map(([_, response]) => Error(response.statusText));
		}
		const contents = await Promise.all(
			responses.map(
				async ([sensor_name, response]):Promise<[string, SensorData[]]> => {
					return [
						sensor_name,
						await response.json()
					];
				}
			)
		);
		
		console.debug('start_date: ' + start_date + '\nend_date: ' + end_date);

		for(const [sensor_name, content] of contents) {

			console.debug(sensor_name + ': ' + content.length.toString());

			for(const kit_id of kits){

				let tmp = content.filter((elem => elem.kit_id == kit_id));
				console.debug('- ' + sensor_name + '.' + kit_id +': ' + tmp.length.toString());

				if(tmp.length == 0) continue;

				if(data[kit_id] === undefined) data[kit_id] = {};

				data[kit_id][sensor_name] = tmp;
			}
		}

			
		
		// for(const sensor_name of sensors){
		// 	let res = await this.api.getSensorsData(sensor_name, start_date, end_date);
	
		// 	if(!res.ok) {
		// 		if(res.status === 401){/* ERROR: Non deve accadere perchè l'autenticazione automatica all'interno delle api non ha funzionato*/}
		// 		throw new Error(res.statusText);
		// 	}
	
		// 	let content:SensorData[] = await res.json();

		// 	console.debug(sensor_name + ': ' + content.length.toString());

		// 	for(const kit_id of kits){
		// 		// eslint-disable-next-line
		// 		let tmp = content.filter((elem => elem.kit_id == kit_id));
		// 		console.debug('- ' + sensor_name + '.' + kit_id +': ' + tmp.length.toString());
		// 		if(tmp.length > 0){
		// 			if(data[kit_id] === undefined){
		// 				// se la proprietà kit_id non è stata ancora inizializzata
		// 				data[kit_id] = {};
		// 			}
		// 			data[kit_id][sensor_name] = tmp;
		// 		}
		// 	}	
		// }


		return data;
	}

	/** Scarica i file come csv */
	async download(data:ContentData, name:string='data'){
		const zip = new JSZip();

		for(const kit_id in data){
			const kit_id_folder = zip.folder(kit_id) as JSZip;

			for(const sensor_name in data[kit_id]){
				kit_id_folder.file(sensor_name+'.csv', this._convertToCSV(data[kit_id][sensor_name]))
			}
		}

		const blob = await zip.generateAsync({type:"blob"});
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${name}.zip`;
		link.click();
		URL.revokeObjectURL(link.href);
	}

	/** Converte JSON a CSV */
	_convertToCSV(data:any[]) {
		const array = [Object.keys(data[0])].concat(data)
	
		return array.map(it => {
			return Object.values(it).toString()
		}).join('\n')
	}
}





