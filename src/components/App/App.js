import { Component } from 'react';

import './App.scss';
import logo from './logo.png'
import Auth from '../Auth/Auth';
import Dashboard from '../Dashboard/Dashboard';
import Downloader from '../../utils/Downloader';

export default class App extends Component{

	constructor(props){
		super(props);

		this.state = {
			api: null // API
		}
	}

	render(){
		
		const version = process.env.NODE_ENV === 'development' ? 'DEV' : '1.0.0';

		return (
			<>
				<header>
					<h1>TOLIFE</h1>
					<img width="65" height="65" align="right" alt="TOLIFE" src={logo}/>
				</header>
				<main>
					<Auth onConnect={x => this.setState({api: x})}/>

					{this.state.api &&
						<Dashboard downloader={new Downloader(this.state.api)}/>
					}
				</main>
				<footer>Ver. {version}</footer>
			</>
		);
	}
	
}