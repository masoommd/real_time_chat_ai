import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios'
import {UserContext} from '../context/user_context'
import Navbar from '../components/Navbar';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser,setLoggedInUser} = useContext(UserContext);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', {email,password});
      if(res.data){
        console.log(res.data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', res.data.user);
        setUser(res.data.user)
        setLoggedInUser(res.data.user)
        navigate('/');
      }
    } catch (err) {
      alert("Failed");``
      console.log(err);
    }

  }

  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              onChange={(e) =>(setEmail(e.target.value))}
              value={email}
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              onChange={(e) =>(setPassword(e.target.value))}
              value={password}
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 cursor-pointer rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;