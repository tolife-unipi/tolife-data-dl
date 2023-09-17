import { Component } from 'react';

import './App.scss';
import logo from './logo.png'
import Auth from '../Auth/Auth';
import Dashboard from '../Dashboard/Dashboard';


export default class App extends Component{

	constructor(props){
		super(props);

		this.state = {
			api: null
		}
	}

	render(){
		
		const version = 'DEV';

		return (
			<>
				<header>
					<h1>TOLIFE</h1>
					<img width="65" height="65" align="right" alt="TOLIFE" src={logo}/>
				</header>
				<main>
					<Auth onConnect={x => this.setState({api: x})}/>

					{this.state.api &&
						<Dashboard api={this.state.api}/>
					}
				</main>
				<footer>Ver. {version}</footer>
			</>
		);
	}
	
}