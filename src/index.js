import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main.tsx';
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import { store } from "./store.ts";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
