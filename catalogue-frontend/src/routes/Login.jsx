import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();

    axios.post('http://localhost:8000/Catalogue_api/token/', { username, password })
      .then(res => {
        const token = res.data.access;
        localStorage.setItem('authToken', token);

        const decoded = jwtDecode(token);

        if (decoded.peran === 'admin') {
          navigate('/Admin'); // Redirect to admin dashboard
        } else {
          navigate('/'); // Redirect to user homepage
        }
      })
      .catch(() => alert('Login failed'));
  };
  const handleGuestLogin = () => {
    axios.post('http://localhost:8000/Catalogue_api/token/', {
      username: 'guest',
      password: 'guest123',
    })
    .then(res => {
      const token = res.data.access;
      localStorage.setItem('authToken', token);

      const decoded = jwtDecode(token);

      if (decoded.peran === 'admin') {
        navigate('/Admin');
      } else {
        navigate('/');
      }
    })
    .catch(() => alert('Guest login failed'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-orange-800">Login</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-800 focus:border-orange-800"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Login as Guest
        </button>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-orange-800 text-white rounded-md hover:bg-orange-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;