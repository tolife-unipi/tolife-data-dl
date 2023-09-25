import React, { Component } from 'react';

import Card from '../Card/Card';
import API from '../../utils/API';
import Toast from '../../utils/Toast';
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
		backend: localStorage.getItem('backend') ?? 'https://api-rawdatastore.techedgegroup.es',
		username: localStorage.getItem('username') ?? '',
		password: localStorage.getItem('password') ?? '',
		is_logged: false,
		loading: false
	};

	/** Si collega al backend. */
	login = async () => {
		this.setState({loading: true});

		const {backend, username, password} = this.state;

		const api = new API(new URL(backend), username, password);
		let res:Response;
		try {
			res = await api.authorize();
		} catch(error){
			Toast((error as Error).message);
			this.setState({loading: false});
			return;
		}

		if(!res.ok){
			const content = await res.json();
			Toast(content.error_description);
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
		Toast('Success')

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
							type='text'
							name='backend'
							value={backend}
							placeholder={backend}
							id='backend'
							onChange={e => this.setState({backend: e.target.value})}
							readOnly={is_logged}
							required={true}
							pattern="^(http|https)://.+"
						/>
						<label htmlFor='backend'>Backend</label>
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
						/>
						<label htmlFor='password'>Password</label>
					</span>

					<button type='submit'>{is_logged ? 'LOGOUT' : 'LOGIN'}</button>
				</form>
			</Card>
		);
	}
}