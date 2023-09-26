import Downloader from "../utils/Downloader";
import APIMocks from "./mocks/APIMock"

describe('Downloader Unit Test', () => {
	const kits = ['D_0', 'D_1', 'D_2'];

	const api = new APIMocks(kits);
	const downloader = new Downloader(api);

	test('fetchData', async () => {
		const sensors = await (await api.getSensorsName()).json();
		const data = await downloader.fetchData(kits, sensors, '2022-01-01', '2023-01-01');

		for(const kit_id of kits){
			for(const sensor_name of sensors){
				expect(data[kit_id]).toBeDefined();

				let tmp:any[] = await (await api.getSensorsData(sensor_name, '2022-01-01', '2023-01-01')).json();

				if(tmp.length == 0){
					expect(data[kit_id][sensor_name]).toBeUndefined();
				}else{
					expect(data[kit_id][sensor_name]).toBeDefined();
					expect(data[kit_id][sensor_name].length).toBeGreaterThan(0);
				}
			}
		}	
	});	
});