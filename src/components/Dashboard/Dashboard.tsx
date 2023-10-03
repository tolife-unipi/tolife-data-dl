import { Component } from "react";
import Card from "../Card/Card";
import Toast from '../../utils/Toast';
import './Dashboard.scss';
import Downloader from "../../utils/Downloader";

/** Descrizione di tutti i sensori */
const DEVICES = {
	PHONE: ['ACC_PHONE', 'BAT_PHONE', 'GPS_PHONE', 'GYR_PHONE', 'MIC_PHONE', 'STEP_PHONE', 'ORI_PHONE', 'LOG_PHONE'],
	WATCH: ['ACC_WATCH', 'BAT_WATCH', 'GPS_WATCH', 'GYR_WATCH', 'MIC_WATCH', 'STEP_WATCH', 'LIGHT_WATCH', 'PPG_WATCH', 'HEART_RATE_WATCH', 'LOG_WATCH'],
	SHOE_LEFT: ['ACC_SHOE_LEFT', 'BAT_SHOE_LEFT', 'GYR_SHOE_LEFT', 'PRESS_SHOE_LEFT'],
	SHOE_RIGHT: ['ACC_SHOE_RIGHT', 'BAT_SHOE_RIGHT', 'GYR_SHOE_RIGHT', 'PRESS_SHOE_RIGHT']
}

interface DashboardProps {
	/** Classe per il download dei dati */
	downloader: Downloader
}

interface DashboardState {
	/** elenco di kit id selezionati */
	kits: string[],
	/** elenco di sensori selezionati */
	devices: {[device: string]:string[]},
	/** data di inizio della ricerca */
	start_date: string,
	/** data di fine della ricerca */
	end_date: string,
	/** se qualche cosa sta ancora lavorando */
	loading: boolean
}

export default class Dashboard extends Component<DashboardProps,DashboardState> {

	state:DashboardState = {
		kits: [],
		devices: Object.fromEntries(Object.keys(DEVICES).map(device => [device, []])),
		start_date: '',
		end_date: '',
		loading: false,
	};

	/** Gestisce l'invio e la ricezione dei dati */
	formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		this.setState({loading: true});

		const {kits, devices, start_date, end_date} = this.state;
		const {downloader} = this.props;

		let data:any = {};
		try {
			data = await downloader.fetchData(kits, devices, start_date, end_date);
		} catch (error) {
			Toast((error as Error).message);
			console.error(error);
			this.setState({loading: false});
			return;
		}

		if(Object.keys(data).length === 0){
			Toast('Empty');
		} else {
			await downloader.download(data, start_date);
		}

		this.setState({loading: false});
	}

	/** Gestisce l'input dei kit Id */
	kitIdsInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({kits: event.target.value.split(',').map(elem => elem.trim())});

	/** Gestisce l'input della data di inizio */
	startDateInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({start_date: event.target.value});

	/** Gestisce l'input della data di fine */
	endDateInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({end_date: event.target.value});

	/** Sovrascrive la lista dei sensori selezionati */
	sensorInputOverride = (device:string, sensors:string[]) => {
		let tmp = {...this.state.devices}
		tmp[device] = [...sensors];
		this.setState({devices: tmp});
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
						<legend>Device</legend>

						{Object.entries(DEVICES).map(([key, value]) => (
							<DeviceInput 
								key={key}
								device_name={key}
								sensors={value}
								onUpdate={(sensors:string[]) => this.sensorInputOverride(key, sensors)}
							/>
						))}

					</fieldset>

					<button type='submit'>DOWNLOAD</button>
				</form>
			</Card>
		);
	}
}

interface DeviceInputProps {
	/** Nome del dispositivo */
	device_name: string,
	/** Lista dei sensori */
	sensors: string[],
	/** Funzione da chiamare quando viene selezionato un sensore */
	onUpdate: (sensors:string[]) => void;
}

interface DeviceInputState {
	[sensor:string]: boolean
}

class DeviceInput extends Component<DeviceInputProps,DeviceInputState> {
	state:DeviceInputState
	constructor(props:DeviceInputProps){
		super(props);
		this.state = Object.fromEntries(props.sensors.map(sensor => [sensor, false]));
	}

	/** Handler per la selezione di un sensore */
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		const sensor = event.target.value;

		this.setState({[sensor]: checked}, ()=>{
			const sensors:string[] = Object.entries(this.state).filter(([, checked])=>checked).map(([sensor,]) => sensor);
			this.props.onUpdate(sensors);
		});	
	}

	/** Handler per attivare o disattivare tutti i sensori */
	onSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		this.setState(Object.fromEntries(this.props.sensors.map(sensor => [sensor, checked])), ()=>{
			const sensors:string[] = checked ? Object.keys(this.state) : [];
			this.props.onUpdate(sensors);
		})
	}

	render(){
		const {device_name, sensors} = this.props;
		return (
			<fieldset>
				<legend>{device_name}</legend>
				{sensors.map(sensor_name => (
					<span key={sensor_name}>
						<input
							type="checkbox"
							name={device_name}
							id={sensor_name}
							value={sensor_name}
							onChange={this.onChange}
							checked={this.state[sensor_name]}
						/>
						<label htmlFor={sensor_name}>{sensor_name}</label>
					</span>
				))}
				<hr/>
				<span>
					<input
						type="checkbox"
						name={device_name}
						id={`${device_name}_ALL`}
						value={`${device_name}_ALL`}
						onChange={this.onSelectAll}
						checked={Object.entries(this.state).every(([,checked])=>checked)}
					/>
					<label htmlFor={`${device_name}_ALL`}>ALL</label>
				</span>
			</fieldset>
		);
	}
}