//login

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useLoginMutation } from "../../redux/api/usersApiSlice"
import { setCredientials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import Loader from '../../components/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const { userInfo } = useSelector(state => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'      // '/' is the home

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]
  );

  const submitHandler = async(e) => {
    e.preventDefault();

    if (!email && !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (!email) {
      toast.error("Please enter email");
      return;
    }
    if (!password) {
      toast.error("Please enter password");
      return;
    }

    // Reset form error/loading state before login attempt
    try {
      await login({email,password}).unwrap()
        .then(res => {
          dispatch(setCredientials({...res}));
        })
        .catch(error => {
          toast.error(error?.data?.message || "Invalid email or password");
        });
    } catch (error) {
      toast.error(error?.data?.message || "Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen">
      <section className="pl-[10rem] flex flex-wrap bg-gray-50 dark:bg-[#18181b] min-h-screen">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sign In</h1>
          <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Password 
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem] hover:bg-pink-600"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {isError && <div className="text-red-500 mt-2">{error?.data?.message || "Invalid email or password"}</div>}
            {isLoading && <Loader/>}
          </form>
          <div className="mt-4">
            <p className="text-gray-800 dark:text-gray-200">
              New Customer ?{" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} 
                className="text-pink-500 hover:underline">Register</Link>
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt=""
          className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
        />
      </section>
    </div>
  )
}

export default Login



<!-- registration.jsx -->

import { usestate, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import Loader from '../../components/Loader'
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from 'react-toastify'
import { useRegisterMutation } from '../../redux/api/usersApiSlice'

const Register = () => {

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()
  const { userInfo } = useSelector(state => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredientials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <section className="pl-[10rem] flex flex-wrap bg-gray-50 min-h-screen">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">Register</h1>

        <form className="container w-[40rem]" onSubmit={submitHandler}>

          <div className="my-[2rem]">
            <label htmlFor="name"
              className="block text-sm font-medium text-gray-900">Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
              placeholder="Enter your name" value={username}
              onChange={e => setUserName(e.target.value)} />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="email"
              className="block text-sm font-medium text-gray-900">Email address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
              placeholder="Enter email" value={email}
              onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="password"
              className="block text-sm font-medium text-gray-900">Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
              placeholder="Enter Password" value={password}
              onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900">Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
              placeholder="Confirm Password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt=""
        className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
      />
    </section>
  );
};

export default Register


//index.css changes /* @import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities"; */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Autofill fixes */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  //box-shadow: 0 0 0px 1000px #fff inset !important;
  //-webkit-text-fill-color: #1a1a1a !important; /* Light mode text */
  transition: background-color 5000s ease-in-out 0s;
     -webkit-text-fill-color: #000 !important; 

}

/* Dark mode autofill support */
.dark input:-webkit-autofill,
.dark input:-webkit-autofill:hover,
.dark input:-webkit-autofill:focus {
     -webkit-text-fill-color: #fff !important; 

  //box-shadow: 0 0 0px 1000px #23272f inset !important;  /* Dark card background */
  //-webkit-text-fill-color: #f4f4f4 !important; /* Light text for dark mode */
}


\\html, body {
\\  overflow: hidden;
\\}

\\ comments are the changes

