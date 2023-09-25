import Downloader from "../utils/Downloader";
import APIMocks from "./mocks/APIMock"

describe('Downloader Unit Test', () => {
	test('async', async () => {
		const kits = ['D_0', 'D_1', 'D_2'];

		const api = new APIMocks(kits);
		const downloader = new Downloader(api);

		const sensors:string[] = await (await api.getSensorsName()).json();

		const data = await downloader.fetchData(kits, sensors, '2022-01-01', '2023-01-01');

		test('fetchData', () => {
			for(const kit_id of kits){
				for(const sensor_name of sensors){
					expect(data[kit_id]).toHaveProperty(sensor_name);
				}
			}
		});

		test('download', () => {
			expect(async () => await downloader.download(data)).not.toThrow();
		});
	});
});