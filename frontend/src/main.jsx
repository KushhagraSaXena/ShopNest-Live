import React, { Profiler } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
import './index.css';
import { Route, RouterProvider, Routes, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async'; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Private Route
import PrivateRoute from './components/PrivateRoute.jsx';

// Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

import Profile from './pages/User/Profile.jsx';

import AdminRoute from './pages/Admin/AdminRoute.jsx';
import UserList from './pages/Admin/UserList.jsx';

// import { createBrowserHistory } from 'history';
import CategoryList from './pages/Admin/CategoryList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import ProductUpdate from './pages/Admin/ProductUpdate.jsx';
import AllProducts from './pages/Admin/AllProducts.jsx'

//for the home pages
import HomeLayout from './components/HomeLayout.jsx';
import Home from './pages/Home.jsx';

import Favorites from '././pages/Products/Favorites.jsx'
import ProductDetails from './pages/Products/ProductDetails.jsx';

import store from './redux/store.js';
import Cart from './pages/cart.jsx';
import Shop from './pages/Shop.jsx';


import Shipping from './pages/orders/Shipping.jsx';
import PlaceOrder from './pages/orders/PlaceOrder.jsx';
import Order from './pages/orders/Order.jsx';
import OrderList from "./pages/Admin/OrderList.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";


import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import UserOrder from './pages/User/UserOrder.jsx';
import Success from '../src/pages/orders/Success.jsx';
import Cancel from '../src/pages/orders/Cancel.jsx';
// import ErrorPage from './pages/ErrorPage';
// Custom Error Page

const ErrorPage = () => (
  <div>
    <h1>Something went wrong!</h1>
    <p>Please try again later.</p>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />} errorElement={<ErrorPage />}>
    {/* <Route path="/" element={<App />} errorElement={<ErrorPage />}> */}
  
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path='favorites' element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/user-orders" element={<UserOrder />} />

      <Route path='' element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/order/:id' element={<Order />} />
      </Route>


    {/* Admin Routes */}
    <Route path='/admin' element={<AdminRoute />}>
      <Route path='userlist' element={<UserList />} />
      <Route path='categorylist' element={<CategoryList />} />
      {/* <Route path='productlist/:pageNumber' element={<ProductList />} /> */}
      <Route path='productlist' element={<ProductList />} />
      <Route path='allproductslist' element={<AllProducts/>} />
      <Route path='product/update/:id' element={<ProductUpdate />} />
      <Route path="orderlist" element={<OrderList />} />
      <Route path="dashboard" element={<AdminDashboard />} />
    </Route>

      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/orders" element={<Order />} />

    </Route>
  )
);



const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider> 
    <PayPalScriptProvider>
        <RouterProvider router={router} />
              <ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light" 
/>

    </PayPalScriptProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);