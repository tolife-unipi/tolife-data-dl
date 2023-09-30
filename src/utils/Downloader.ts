import JSZip from "jszip";
import API from "./API"

interface SensorData {
	kit_id: string,
	timestamp: number,
	[propName: string]: any
}

interface ContentData {
	start_date: string, 
	end_date: string,
	entries: {
		[kit:string]: {
			[device:string]: {
				[sensor:string]: SensorData[]
			}
		}
	}
}

export default class Downloader {
	api: API;

	constructor(api:API) {
		this.api = api;
	}

	/** Restituisce i dati dei sensori relativi ai kit id selezionati */
	async fetchData(kits:string[], devices:{[device:string]: string[]}, start_date:string, end_date:string) {

		/** [device, sensor, Response][] */
		const requests:Promise<[string,string,Response]>[] = [];

		for(const device in devices) {
			const sensors = devices[device]
			for(const sensor of sensors){
				requests.push((async () => {
					return [
						device,
						sensor,
						await this.api.getSensorsData(sensor, start_date, end_date)
					];
				})());
			}
		}

		const responses = await Promise.all(requests);

		const errors = responses.reduce((accumulator, [,,response]) => {
			if(!response.ok) accumulator.push(response);
			return accumulator;
		}, [] as Response[]);

		if(errors.length > 0){
			// Nel caso ci fosse qualche errore
			throw errors.map(response => Error(response.statusText));
		}

		const contents = await Promise.all(
			responses.map(
				async ([device, sensor, response]):Promise<[string,string,SensorData[]]> => {
					return [
						device,
						sensor,
						await response.json()
					];
				}
			)
		);

		const data:ContentData = {
			start_date: start_date,
			end_date: end_date,
			entries: {}
		};
		
		console.debug('start_date: ' + start_date + '\nend_date: ' + end_date);
		for(const [device, sensor, content] of contents){

			console.debug(`${device}.${sensor}: ${content.length.toString()}`);

			for(const kit of kits){
				let tmp = content.filter((elem => elem.kit_id == kit));
				console.debug(`- ${device}.${sensor}.${kit}: ${tmp.length.toString()}`);

				if(tmp.length == 0) continue;

				if(data.entries[kit] === undefined) data.entries[kit] = {};
				if(data.entries[kit][device] === undefined) data.entries[kit][device] = {};

				data.entries[kit][device][sensor] = tmp;
			}
		}

		return data;
	}

	/** Scarica i file come csv */
	async download({start_date, entries}:ContentData, name:string='data'){
		const zip = new JSZip();

		const date_folder = zip.folder(start_date)  as JSZip;

		for(const kit in entries){
			const kit_folder = date_folder.folder(kit) as JSZip;

			for(const device in entries[kit]){
				const device_folder = kit_folder.folder(device) as JSZip;

				for(const sensor in entries[kit][device]){
					device_folder.file(sensor+'.csv', this._convertToCSV(entries[kit][device][sensor]));
				}
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





