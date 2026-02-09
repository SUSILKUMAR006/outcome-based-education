import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const url = 'http://localhost:4000';
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`${url}/users/api/login`, { email, password });
      const { token, message: respMessage, user } = response.data || {};

      if (token && user) {
        // Save username and token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", user.userName);
        localStorage.setItem("loginTime", Date.now().toString());

        alert("Login Successful!");
        navigate('/');
      } else {
        setMessage(respMessage || 'Invalid Credentials');
      }
    } catch (error) {
      console.error("Login failed", error);
      const errorMsg = error.response?.data?.message || "Invalid Credentials";
      setMessage(errorMsg);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex justify-center items-center px-4 py-8 lg:px-0 relative overflow-hidden'>
      {/* Animated Background Decorations */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Floating Circles */}
        <div className='absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
        <div className='absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-20 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
        
        {/* Grid Pattern */}
        <div className='absolute inset-0 bg-grid-pattern opacity-5'></div>
        
        {/* Geometric Shapes */}
        <div className='absolute top-10 right-1/4 w-20 h-20 border-4 border-green-300 rounded-lg transform rotate-45 opacity-20'></div>
        <div className='absolute bottom-20 left-1/4 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20'></div>
        <div className='absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-br from-green-300 to-blue-300 rounded-lg transform rotate-12 opacity-20'></div>
      </div>

      <div className='w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 min-h-[600px]'>
          {/* Left side - Image Section */}
          <div className='hidden lg:block w-full h-full relative overflow-hidden'>
            <img className='rounded-l-2xl w-full h-full object-cover object-center' src={assets.login_Background} alt="Login Background" />
          </div>

          {/* Right side - Login Form */}
          <div className='flex flex-col justify-center p-8 lg:p-12'>
            <div className='mb-8 text-center lg:text-left'>
              <img src={assets.college_logo} alt="College Logo" className='h-16 mb-6 mx-auto lg:mx-0' />
              <h2 className='text-3xl font-bold text-gray-800 mb-2'>Sign In</h2>
              <p className='text-gray-500'>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className='space-y-6'>
              <div className='relative'>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder='Enter your email'
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200 text-gray-700'
                    required
                  />
                </div>
              </div>

              <div className='relative'>
                <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder='Enter your password'
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200 text-gray-700'
                    required
                  />
                </div>
              </div>

              {message && (
                <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
                  <p className='text-red-700 text-sm font-medium'>{message}</p>
                </div>
              )}

              <button 
                type='submit' 
                className='w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300'
              >
                Sign In
              </button>
            </form>

            <div className='mt-6 text-center text-sm text-gray-500'>
              <p>© 2026 OBE Portal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
