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
			kit_ids: [], // elenco di kit id selezionati
			sensors_name: [], // elenco di sensori selezionati
			start_date: '', // data di inizio della ricerca
			end_date: '', // data di fine della ricerca
			loading: false // se qualche cosa sta ancora lavorando
		}
	}

	/**
	 * Gestisce l'invio e la ricezione dei dati
	 * @param {Event} event 
	 */
	formSubmitHandler = async (event) => {
		event.preventDefault();

		this.setState({loading: true});

		/** @type {API} */
		const api = this.props.api;

		const {kit_ids, sensors_name, start_date, end_date} = this.state;

		/**
		 * data = {
		 * 	 [kit_id]: {
		 * 	   [sensor_name]: {
		 *       content
		 *     },...	
		 * 	 },...
		 * }
		 */
		let data = {}
		
		for(const sensor_name of sensors_name){
			let res = await api.getSensorsData(sensor_name, start_date, end_date);

			if(!res.ok) {
				if(res.status === 401){/* ERROR: Non deve accadere perchè l'autenticazione automatica all'interno delle api non ha funzionato*/}
				Toast('Error: ' + res.statusText);
				this.setState({loading: false});
				return;
			}

			/** @type {Array} */
			let content = await res.json();
			for(const kit_id of kit_ids){
				// eslint-disable-next-line
				let tmp = content.filter((elem => elem.kit_id == kit_id));
				if(tmp.length > 0){
					if(!Object.hasOwn(data, kit_id)){
						// se la proprietà kit_id non è stata ancora inizializzata
						data[kit_id] = {};
					}
					data[kit_id][sensor_name] = tmp;
				}
			}	
		}

		if(Object.keys(data).length === 0){
			Toast('Empty');
			this.setState({loading: false});
			return;
		}

		await download(data);
		this.setState({loading: false});
	}

	/**
	 * Gestisce l'input dei kit Id
	 * @param {Event} event 
	 */
	kitIdsInputHandler = (event) => this.setState({kit_ids: event.target.value.split(',').map(elem => elem.trim())});

	/**
	 * Gestisce l'input della data di inizio
	 * @param {Event} event 
	 */
	startDateInputHandler = (event) => this.setState({start_date: event.target.value});

	/**
	 * Gestisce l'input della data di fine
	 * @param {Event} event 
	 */
	endDateInputHandler = (event) => this.setState({end_date: event.target.value});

	/**
	 * Gestisce l'input dei sensori
	 * @param {Event} event 
	 */
	sensorsInputHandler = (event) => {
		if(event.target.checked)
			this.setState({sensors_name: this.state.sensors_name.concat([event.target.value])});
		else
			this.setState({sensors_name: this.state.sensors_name.filter(elem => elem !== event.target.value)});
	}

	render(){
		return (
			<Card title='Dashboard' loading={this.state.loading}>
				<form
					className="Dashboard"
					onSubmit={this.formSubmitHandler}
				>
					<span>
						<input 
							type='text'
							name='kits_id'
							id='kits_id'
							onChange={this.kitIdsInputHandler}
							pattern="^\w+(\s*,\s*\w+)*"
							placeholder="64, 32, 123, ..."
							required={true}
						/>
						<label htmlFor='kits_id'>Kit IDs</label>
					</span>

					<span>
						<input 
							type='datetime-local'
							name='start_date'
							id='start_date'
							onChange={this.startDateInputHandler}
							required={true}
						/>
						<label htmlFor='start_date'>Start Date</label>
					</span>

					<span>
						<input 
							type='datetime-local'
							name='end_date'
							id='end_date'
							onChange={this.endDateInputHandler}
							required={true}
						/>
						<label htmlFor='end_date'>End Date</label>
					</span>

					<fieldset>
						<legend>Sensor Name</legend>

						<fieldset>
							<legend>Phone</legend>
							{['ACC_PHONE', 'BAT_PHONE', 'GPS_PHONE', 'GYR_PHONE', 'MIC_PHONE', 'STEP_PHONE'].map(sensor_name => (
								<span key={sensor_name}>
									<input
										type="checkbox"
										name={sensor_name}
										id={sensor_name}
										value={sensor_name}
										onChange={this.sensorsInputHandler}
									/>
									<label htmlFor={sensor_name}>{sensor_name}</label>
								</span>
							))}
						</fieldset>

						<fieldset>
							<legend>Watch</legend>
							{['ACC_WATCH', 'BAT_WATCH', 'GPS_WATCH', 'GYR_WATCH', 'MIC_WATCH', 'STEP_WATCH', 'LIGHT_WATCH', 'PPG_WATCH', 'HEART_RATE_WATCH'].map(sensor_name => (
								<span key={sensor_name}>
									<input
										type="checkbox"
										name={sensor_name}
										id={sensor_name}
										value={sensor_name}
										onChange={this.sensorsInputHandler}
									/>
									<label htmlFor={sensor_name}>{sensor_name}</label>
								</span>
							))}
						</fieldset>

						<fieldset>
							<legend>Left Shoe</legend>
							{['ACC_SHOE_LEFT', 'BAT_SHOE_LEFT', 'GYR_SHOE_LEFT', 'PRESS_SHOE_LEFT'].map(sensor_name => (
								<span key={sensor_name}>
									<input
										type="checkbox"
										name={sensor_name}
										id={sensor_name}
										value={sensor_name}
										onChange={this.sensorsInputHandler}
									/>
									<label htmlFor={sensor_name}>{sensor_name}</label>
								</span>
							))}
						</fieldset>

						<fieldset>
							<legend>Right Shoe</legend>
							{['ACC_SHOE_RIGHT', 'BAT_SHOE_RIGHT', 'GYR_SHOE_RIGHT', 'PRESS_SHOE_RIGHT'].map(sensor_name => (
								<span key={sensor_name}>
									<input
										type="checkbox"
										name={sensor_name}
										id={sensor_name}
										value={sensor_name}
										onChange={this.sensorsInputHandler}
									/>
									<label htmlFor={sensor_name}>{sensor_name}</label>
								</span>
							))}
						</fieldset>
					</fieldset>

					<button type='submit'>DOWNLOAD</button>
				</form>
			</Card>
		);
	}
}