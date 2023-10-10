import { Component } from 'react';
import './App.scss';
import Auth from '../Auth/Auth';
import Dashboard from '../Dashboard/Dashboard';
import Downloader from '../../utils/Downloader';
import API from '../../utils/API';
import logo from './logo.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppState {
	/** REST API */
	api: API|null
}

export default class App extends Component<{},AppState>{

	state:AppState = {api: null};

	render(){
		
		/** Numero di versione uguale a quello scritto in package.json */
		const version = process.env.NODE_ENV === 'development' ? 'DEV' : process.env.APP_VERSION as string;

		return (
			<>
				<ToastContainer
					position="top-right"
					newestOnTop={true}
					closeOnClick={false}
					hideProgressBar={true}
					pauseOnFocusLoss={false}
					pauseOnHover={false}
					theme="dark"
				/>
				<header>
					<h1>TOLIFE</h1>
					<img width="65" height="65" alt="TOLIFE" src={logo} style={{float: 'right'}}/>
				</header>
				<main>
					<Auth onConnect={(x:API|null) => this.setState({api: x})}/>

					{this.state.api &&
						<Dashboard downloader={new Downloader(this.state.api)}/>
					}
				</main>
				<footer>Ver. {version}</footer>
				
			</>
		);
	}
	
}