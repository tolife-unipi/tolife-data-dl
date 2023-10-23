import JSZip from "jszip";
import API from "./API"
import PromiseBucket from "./PromiseBucket";
import { toast } from 'react-toastify';

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
	async fetchData(kits:string[], devices:{[device:string]: string[]}, start_date:Date, end_date:Date) {

		/** [device, sensor, Response] */
		const bucket = new PromiseBucket<[string,string,Response]>(5);

		for(const device in devices) {
			const sensors = devices[device]
			for(const sensor of sensors){

				// DA RIMUOVERE QUANDO IL SERVER SARÀ DECENTE
				// await new Promise(r => setTimeout(r, 10000));
				// this.api.authorize();
				/////////////////////////////////////////////

				await bucket.put(
					this.api.getSensorsData(sensor, start_date.toJSON(), end_date.toJSON())
					.then(
						res => [device,sensor,res], 
						err => [device,sensor,new Response((err as Error).message, {status:500})]
					)
				);
			}
		}

		const data:ContentData = {
			start_date: start_date.toJSON(),
			end_date: end_date.toJSON(),
			entries: {}
		};

		console.debug('start_date: ' + start_date + '\nend_date: ' + end_date);
		for await (const [device,sensor,res] of bucket.iter()){
			// Nel caso ci fosse qualche errore
			if(!res.ok){
				toast.error(`${device}.${sensor}: ${await res.text()}`, {autoClose: 5000});
				continue;
			}

			const content = await res.json() as SensorData[];

			console.debug(`${device}.${sensor}: ${content.length.toString()}`);

			for(const kit of kits){
				let tmp = content.filter((elem => elem.kitId == kit));
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
	async download({entries}:ContentData, name:string='data'){
		const zip = new JSZip();

		// const date_folder = zip.folder(start_date)  as JSZip;

		for(const kit in entries){
			const kit_folder = zip.folder(kit) as JSZip;

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





