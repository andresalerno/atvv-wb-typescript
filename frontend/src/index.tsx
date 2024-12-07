import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' para React 18
import Roteador from './componentes/roteador';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// cria o ponto de entrada principal da aplicação React
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Roteador />
  </React.StrictMode>
);

reportWebVitals();
