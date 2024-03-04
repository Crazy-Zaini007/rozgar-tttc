import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from './redux/reducers/authSlice';
import './App.css';
import App from './App';
import { store } from './redux/store'
import { Provider } from 'react-redux'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <React.StrictMode>
    <Provider store={store}>
   <App />
   </Provider>
  </React.StrictMode>
  </AuthContextProvider>
);
