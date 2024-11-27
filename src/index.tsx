import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import { MainManuItem, MainMenu } from './components/MainMenu/MainMeni';

const menuItems = [
  new MainManuItem("Home", "/"),
  new MainManuItem("About us", "/page/about-us/"),
  new MainManuItem("Contact", "/contact/"),
  new MainManuItem("Log in", "/user/login/"),
]


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainMenu items= {menuItems}></MainMenu>
    <App />
  </React.StrictMode>
);

reportWebVitals();
