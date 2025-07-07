import React, { Profiler } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Route, RouterProvider, Routes, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { HelmetProvider } from 'react-helmet-async'; 

//Private Route
import PrivateRoute from './components/PrivateRoute.jsx';

// Auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

// import AdminRoute from "./pages/Admin/AdminRoute";
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
import Home from './Home.jsx';

import Favorites from '././pages/Products/Favorites.jsx'
import ProductDetails from './pages/Products/ProductDetails.jsx';

import Cart from './pages/cart.jsx';

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
      {/* <Route path="/shop" element={<Shop />} /> */}

      <Route path='' element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
      </Route>


    {/* Admin Routes */}
    <Route path='/admin' element={<AdminRoute />}>
      <Route path='userlist' element={<UserList />} />
      <Route path='categorylist' element={<CategoryList />} />
      {/* <Route path='productlist/:pageNumber' element={<ProductList />} /> */}
      <Route path='productlist' element={<ProductList />} />
      <Route path='allproductslist' element={<AllProducts/>} />
      <Route path='product/update/:id' element={<ProductUpdate />} />
    </Route>

    </Route>
  )
);



const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider> {/* ✅ ADD THIS WRAPPER */}
        <RouterProvider router={router} />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);