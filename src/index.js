import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';

import './index.scss'
import MyServiceWorker from './utils/MyServiceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

MyServiceWorker.register()