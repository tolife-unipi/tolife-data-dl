import JSZip from "jszip";
import API from "./API"
import PromiseBucket from "./PromiseBucket";

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

		/** [device, sensor, Response] */
		const bucket = new PromiseBucket<[string,string,Response]>();

		for(const device in devices) {
			const sensors = devices[device]
			for(const sensor of sensors){

				//////////////////////////////////////////////
				//TODO: Da rimuovere in fase di produzione, si spera
				await new Promise(r => setTimeout(r, 75));
				//////////////////////////////////////////////

				bucket.put(
					this.api.getSensorsData(sensor, start_date, end_date)
					.then(res => [device,sensor,res])
				);
			}
		}

		const data:ContentData = {
			start_date: start_date,
			end_date: end_date,
			entries: {}
		};

		console.debug('start_date: ' + start_date + '\nend_date: ' + end_date);
		for await (const [device,sensor,res] of bucket.iter()){
			// Nel caso ci fosse qualche errore
			if(!res.ok) throw Error(await res.text());

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





