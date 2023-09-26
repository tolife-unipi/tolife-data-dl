import { Component } from "react";
import Card from "../Card/Card";
import Toast from '../../utils/Toast';
import './Dashboard.scss';
import Downloader from "../../utils/Downloader";

interface DashboardProps {
	/** Classe per il download dei dati */
	downloader: Downloader
}

interface DashboardState {
	/** elenco di kit id selezionati */
	kit_ids: string[],
	/** elenco di sensori selezionati */
	sensors_name: string[],
	/** data di inizio della ricerca */
	start_date: string,
	/** data di fine della ricerca */
	end_date: string,
	/** se qualche cosa sta ancora lavorando */
	loading: boolean
}


export default class Dashboard extends Component<DashboardProps,DashboardState> {

	state:DashboardState = {
		kit_ids: [],
		sensors_name: [],
		start_date: '',
		end_date: '',
		loading: false,
	};

	/** Gestisce l'invio e la ricezione dei dati */
	formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		this.setState({loading: true});

		const {kit_ids, sensors_name, start_date, end_date} = this.state;
		const {downloader} = this.props;

		let data = {}
		try {
			data = await downloader.fetchData(kit_ids, sensors_name, start_date, end_date);
		} catch (error) {
			Toast((error as Error).message);
			console.error(error);
			this.setState({loading: false});
			return;
		}

		if(Object.keys(data).length === 0){
			Toast('Empty');
		} else {
			await downloader.download(data);
		}

		this.setState({loading: false});
	}

	/** Gestisce l'input dei kit Id */
	kitIdsInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({kit_ids: event.target.value.split(',').map(elem => elem.trim())});

	/**
	 * Gestisce l'input della data di inizio
	 * @param {Event} event 
	 */
	startDateInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({start_date: event.target.value});

	/**
	 * Gestisce l'input della data di fine
	 * @param {Event} event 
	 */
	endDateInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({end_date: event.target.value});

	/**
	 * Gestisce l'input dei sensori
	 * @param {Event} event 
	 */
	sensorsInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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