import { Component } from 'react';

import Card from '../Card/Card';
import API from '../../utils/API';
// import APIMock from '../../tests/mocks/APIMock';
import { toast } from 'react-toastify';
import './Auth.scss';

interface AuthProps {
	/** Funzione utilizzata per aggiornare le API della classe App */
	onConnect: (api:API|null) => void
}

interface AuthState {
	/** url del backend */
	backend: string,
	/** username per ottenere l'accesso */
	username: string,
	/** password per ottenere l'accesso */
	password: string,
	/** se il login ha avuto successo */
	is_logged: boolean,
	/** se qualche cosa sta ancora lavorando */
	loading: boolean
}

export default class Auth extends Component<AuthProps,AuthState>{
	
	state:AuthState = {
		backend: localStorage.getItem('backend') ?? 'http://131.114.51.61:3100/', // Valore di default: http://131.114.51.61:3100/
		username: localStorage.getItem('username') ?? '',
		password: localStorage.getItem('password') ?? '',
		is_logged: false,
		loading: false
	};

	/** Si collega al backend. */
	login = async () => {
		// Abilita la barra di caricamento
		this.setState({loading: true});
		const toast_id = toast.loading("Please wait...");

		const {backend, username, password} = this.state;

		// Crea un istanza della clase API da usare nella Dashboard
		const api = new API(new URL(backend), username, password);
		// const api = new APIMock(['D_0', 'D_1'], 500);


		let res:Response;
		try {
			res = await api.authorize();
			// se la risposta ha un valore di ritorno != 200
			if(!res.ok) throw new Error(await res.text())
		} catch(error){
			// Nel caso di errore notifica l'utente
			toast.update(toast_id, { render: (error as Error).message, type: "error", isLoading: false, autoClose: 5000 });
			// Lo scrive nella console
			console.error(error);
			// Rimuove la barra di caricamento
			this.setState({loading: false});
			return;
		}
		
		// Sincronizzo il contenuto dello stato con quello del localStorage
		localStorage.setItem('backend', backend);
		localStorage.setItem('username', username);
		localStorage.setItem('password', password);

		// Collego le API al livello App
		this.props.onConnect(api);

		// Notifico l'utente
		toast.update(toast_id, { render: 'Success', type: "success", isLoading: false, autoClose: 5000 });

		// Confermo la corretta autenticazione
		this.setState({is_logged: true, loading: false});
	}

	/** Si scollega dal backend. */
	logout = () => {
		// Scollego le API al livello App
		this.props.onConnect(null);

		// Confermo il corretto logout
		this.setState({is_logged: false});
	}

	render(){
		const {backend, username, password, is_logged, loading} = this.state;
		return (
			<Card title="Auth" loading={loading}>
				<form 
					className='Auth'
					method='POST'
					onSubmit={(e) =>{
						is_logged ? this.logout() : this.login();
						e.preventDefault();
					}}
				>

					<span>
						<input 
							type='url'
							name='backend'
							value={backend}
							placeholder={backend}
							id='backend'
							onChange={e => this.setState({backend: e.target.value})}
							readOnly={is_logged}
							required={true}
							pattern="^(http|https)://[^\s]+"
							autoComplete='url'
							list='backend-list'
						/>
						<label htmlFor='backend'>Backend</label>
						<datalist id="backend-list">
							<option value="http://131.114.51.61:3100/"></option>
							<option value="https://api-rawdatastore.techedgegroup.es/"></option>
						</datalist>
					</span>

					<span>
						<input
							type='text'
							name='username'
							value={username}
							placeholder={username}
							id='username'
							onChange={e => this.setState({username: e.target.value})}
							readOnly={is_logged}
							required={true}
							autoComplete='username'
						/>
						<label htmlFor='username'>Username</label>
					</span>

					<span>
						<input
							type='password'
							name='password'
							value={password}
							placeholder={password}
							id='password'
							onChange={e => this.setState({password: e.target.value})}
							readOnly={is_logged}
							required={true}
							autoComplete='current-password'
						/>
						<label htmlFor='password'>Password</label>
					</span>

					<button type='submit'>{is_logged ? 'LOGOUT' : 'LOGIN'}</button>
				</form>
			</Card>
		);
	}
}