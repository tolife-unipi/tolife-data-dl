import { Component } from 'react';

import Card from '../Card/Card';
import API from '../../utils/API';
import Toast from '../../utils/Toast';
import './Auth.scss';

export default class Auth extends Component{
	constructor(props){
		super(props);

		this.state = {
			backend: localStorage.getItem('backend') ?? 'https://api-rawdatastore.techedgegroup.es', // url del backend
			username: localStorage.getItem('username') ?? '', // username per ottenere l'accesso
			password: localStorage.getItem('password') ?? '', // password per ottenere l'accesso
			is_logged: false // se il login ha avuto successo
		}
	}

	/** Si collega al backend. */
	login = async () => {
		const {backend, username, password} = this.state;
		const api = new API(new URL(backend), username, password);
		let res = await api.authorize();
		if(!res.ok){
			// Login Fallito
			const content = await res.json();
			// Notifico l'utente
			Toast(content.error_description)
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
		this.setState({is_logged: true});
	}

	/** Si scollega dal backend. */
	logout = () => {
		// Scollego le API al livello App
		this.props.onConnect(null);

		// Confermo il corretto logout
		this.setState({is_logged: false});
	}

	render(){
		const {backend, username, password, is_logged} = this.state;
		return (
			<Card title="Auth">
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