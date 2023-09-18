import JSZip from "jszip";

/**
 * Scarica i file come csv
 * @param {Object} data data da scaricare
 * @param {Object} data.kit_id
 * @param {Object} data.kit_id.sensor_name
 */
export default async function download(data, name='data') {

	const zip = new JSZip();

	for(const kit_id in data){
		const kit_id_folder = zip.folder(kit_id);

		for(const sensor_name in data[kit_id]){
			kit_id_folder.file(sensor_name+'.csv', convertToCSV(data[kit_id][sensor_name]))
		}
	}

	const blob = await zip.generateAsync({type:"blob"});
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `data.zip`;
	link.click();
	URL.revokeObjectURL(link.href);
}

/**
 * Converte JSON a CSV
 * @param {Array} data 
 * @returns 
 */
function convertToCSV(data) {
	const array = [Object.keys(data[0])].concat(data)
  
	return array.map(it => {
	  return Object.values(it).toString()
	}).join('\n')
  }