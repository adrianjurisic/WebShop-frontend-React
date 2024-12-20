import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import { MainManuItem, MainMenu } from './components/MainMenu/MainMeni';
import { HashRouter, Route, Routes } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import OrderPage from './components/OrdersPage/OrdersPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';

const menuItems = [
  new MainManuItem("Home", "/"),
  new MainManuItem("Contact", "/contact"),
  new MainManuItem("Administrator Login", "/administrator/login"),
  new MainManuItem("User Login", "/user/login"),
  new MainManuItem("Register", "/user/register"),
  new MainManuItem("My Orders", "/user/orders")
];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <MainMenu items={menuItems} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/administrator/login" element={<AdministratorLoginPage />} />
        <Route path="/administrator/dashboard" element={<AdministratorDashboard />} />
        <Route path="/user/register" element={<UserRegistrationPage />} />
        <Route path="/category/:cId" element={<CategoryPage />} />
        <Route path="/user/orders" element={<OrderPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();

