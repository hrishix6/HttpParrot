import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/domain/app/app.tsx';
import './common/css/index.css';
import './common/css/vendor/prism.css';
import { Provider } from 'react-redux';
import { store } from './common/store.ts';
import { ThemeWrapper } from './components/domain/theme/theme.wrapper.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </Provider>
  </React.StrictMode>
);
