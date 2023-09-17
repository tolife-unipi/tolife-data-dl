import { Component } from "react";
import Card from "../Card/Card";
// eslint-disable-next-line
import API from "../../utils/API";
import Toast from '../../utils/Toast';
import download from "../../utils/Downloader";
import './Dashboard.scss';

export default class Dashboard extends Component {
	constructor(props){
		super(props);

		this.state = {
			kit_id: null,
			sensor_name: '',
			start_date: '',
			end_date: ''
		}
	}

	/** Scarica i dati. */
	downloadHandler = async () => {

		/** @type {API} */
		const api = this.props.api;

		const {kit_id, sensor_name, start_date, end_date} = this.state;

		let res = await api.getSensorsData(sensor_name, start_date, end_date);

		if(!res.ok) {
			if(res.status === 401){/* ERROR: Non deve accadere perchè l'autenticazione automatica all'interno delle api non ha funzionato*/}
			Toast('Error: ' + res.statusText);
			return;
		}

		/** @type {Array} */
		let content = await res.json();
		// console.debug(content);

		// eslint-disable-next-line
		content = content.filter((elem => elem.kitId == kit_id));

		if(content.length === 0){
			Toast('Empty set.');
			return;
		}
		
		download(content, `${kit_id}.${sensor_name}.${start_date.split('T')[0]}.${end_date.split('T')[0]}`);
		// console.debug(content);
	}

	render(){
		return (
			<Card title='Dashboard'>
				<form
					className="Dashboard"
					onSubmit={(e) => {
						this.downloadHandler();
						e.preventDefault();
					}}
				>
					<span>
						<input 
							type='number'
							name='kit_id'
							id='kit_id'
							min={0}
							onChange={e => this.setState({kit_id: e.target.value})}
							required={true}
						/>
						<label htmlFor='kit_id'>Kit ID</label>
					</span>

					<span>
						<select
							name='sensor_name'
							id="sensor_name"
							onChange={e => this.setState({sensor_name: e.target.value})}
							required={true}
						>
							<option></option>
							<optgroup label="Phone">
								<option>ACC_PHONE</option>
								<option>BAT_PHONE</option>
								<option>GPS_PHONE</option>
								<option>GYR_PHONE</option>
								<option>MIC_PHONE</option>
								<option>STEP_PHONE</option>
							</optgroup>
							<optgroup label="Watch">
								<option>ACC_WATCH</option>
								<option>BAT_WATCH</option>
								<option>GPS_WATCH</option>
								<option>GYR_WATCH</option>
								<option>MIC_WATCH</option>
								<option>STEP_WATCH</option>
								<option>LIGHT_WATCH</option>
								<option>PPG_WATCH</option>
								<option>HEART_RATE_WATCH</option>
							</optgroup>
							<optgroup label="Left Shoe">
								<option>ACC_SHOE_LEFT</option>
								<option>BAT_SHOE_LEFT</option>
								<option>GYR_SHOE_LEFT</option>
								<option>PRESS_SHOE_LEFT</option>
							</optgroup>
							<optgroup label="Right Shoe">
								<option>ACC_SHOE_RIGHT</option>
								<option>BAT_SHOE_RIGHT</option>
								<option>GYR_SHOE_RIGHT</option>
								<option>PRESS_SHOE_RIGHT</option>
							</optgroup>
						</select>
						<label htmlFor='sensor_name'>Sensor Name</label>
					</span>

					<span>
						<input 
							type='datetime-local'
							name='start_date'
							id='start_date'
							onChange={e => this.setState({start_date: e.target.value})}
							required={true}
						/>
						<label htmlFor='start_date'>Start Date</label>
					</span>

					<span>
						<input 
							type='datetime-local'
							name='end_date'
							id='end_date'
							onChange={e => this.setState({end_date: e.target.value})}
							required={true}
						/>
						<label htmlFor='end_date'>End Date</label>
					</span>

					<button type='submit'>DOWNLOAD</button>
				</form>
			</Card>
		);
	}
}