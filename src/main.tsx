import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import {IS_ELECTRON} from '@/constants/environment';

if (IS_ELECTRON) {
  import('./api/index').then(server => server.start());
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
);

postMessage({payload: 'removeLoading'}, '*');
