/**
 * Scarica i file come csv
 * @param {Array} data data da scaricare
 * @param {string} name nome del file
 */
export default function download(data, name='data') {
	const link = document.createElement("a");

	const file = new Blob([convertToCSV(data)], { type: 'text/csv' });

	link.href = URL.createObjectURL(file);

	link.download = `${name}.csv`;

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