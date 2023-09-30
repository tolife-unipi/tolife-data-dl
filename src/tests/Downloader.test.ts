import Downloader from "../utils/Downloader";
import APIMocks from "./mocks/APIMock"

describe('Downloader Unit Test', () => {
	const KITS = ['D_0', 'D_1', 'D_2'];
	const DEVICES = {
		PHONE: ['ACC_PHONE', 'BAT_PHONE', 'GPS_PHONE', 'GYR_PHONE', 'MIC_PHONE', 'STEP_PHONE'],
		WATCH: ['ACC_WATCH', 'BAT_WATCH', 'GPS_WATCH', 'GYR_WATCH', 'MIC_WATCH', 'STEP_WATCH', 'LIGHT_WATCH', 'PPG_WATCH', 'HEART_RATE_WATCH'],
		SHOE_LEFT: ['ACC_SHOE_LEFT', 'BAT_SHOE_LEFT', 'GYR_SHOE_LEFT', 'PRESS_SHOE_LEFT'],
		SHOE_RIGHT: ['ACC_SHOE_RIGHT', 'BAT_SHOE_RIGHT', 'GYR_SHOE_RIGHT', 'PRESS_SHOE_RIGHT']
	}

	const api = new APIMocks(KITS);
	const downloader = new Downloader(api);

	test('fetchData', async () => {

		const data = await downloader.fetchData(KITS, DEVICES, '2022-01-01', '2023-01-01');

		expect(data.start_date).toBeDefined();
		expect(data.end_date).toBeDefined();

		const entries = data.entries;

		expect(entries).toBeDefined();

		for(const kit of KITS){
			const kit_entry = entries[kit];

			expect(kit_entry).toBeDefined();

			for(const [device, sensors] of Object.entries(DEVICES)){
				const device_entry = kit_entry[device];

				expect(device_entry).toBeDefined();

				for(const sensor of sensors){
					const sensor_entry = device_entry[sensor];

					let tmp:any[] = await (await api.getSensorsData(sensor, data.start_date, data.end_date)).json();

					if(tmp.length == 0){
						expect(sensor_entry).toBeUndefined();
					}else{
						expect(sensor_entry).toBeDefined();
						expect(sensor_entry.length).toBeGreaterThan(0);
						for(const entry of sensor_entry){
							expect(entry).toHaveProperty('kit_id');
						}
					}
				}
			}
		}	
	});	
});