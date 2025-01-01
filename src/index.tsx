import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import OrderPage from './components/OrdersPage/OrdersPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorCategoryPage from './components/AdministratorCategoryPage/AdministratorCategoryPage';
import AdministratorFeaturePage from './components/AdministratorFeaturePage/AdministratorFeaturePage';
import AdministratorArticlePage from './components/AdministratorArticlePage/AdministratorArticlePage';
import AdministratorAddPhoto from './components/AdministratorAddPhoto/AdministratorAddPhoto';
import { AdministratorLogoutPage } from './components/AdministratorLogoutPage/AdministratorlogoutPage';
import { UserLogoutPage } from './components/UserLogoutPage/UserLogoutPage';
import AdministratorDashboardOrder from './components/AdministratorDashboardOrder/AdministratorDashboardOrder';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/logout" element={<UserLogoutPage />} />
        <Route path="/administrator/login" element={<AdministratorLoginPage />} />
        <Route path="/administrator/logout" element={<AdministratorLogoutPage />} />
        <Route path="/administrator/dashboard" element={<AdministratorDashboard />} />
        <Route path="/administrator/dashboard/category" element={<AdministratorCategoryPage />} />
        <Route path="/administrator/dashboard/feature/:cId" element={<AdministratorFeaturePage/>} />
        <Route path="/administrator/dashboard/article" element={<AdministratorArticlePage />} />
        <Route path="/administrator/dashboard/order" element={<AdministratorDashboardOrder />} />
        <Route path="/administrator/dashboard/photo/:aId" element={<AdministratorAddPhoto />} />
        <Route path="/user/register" element={<UserRegistrationPage />} />
        <Route path="/category/:cId" element={<CategoryPage />} />
        <Route path="/user/orders" element={<OrderPage />} />

      </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();