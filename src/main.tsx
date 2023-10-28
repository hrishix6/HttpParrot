import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './common/App.tsx';
import './common/css/index.css';
import './common/css/vendor/prism.css';
import { Provider } from 'react-redux';
import { store } from './common/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
