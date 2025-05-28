import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Header(){
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/Login'); // this properly redirects the user
  };
  let isAdmin = false
  const token = localStorage.getItem('authToken');
   if (token && typeof token === 'string') {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.peran === 'admin';
    } catch (e) {
      console.error('Invalid JWT token', e);
      localStorage.removeItem('authToken');
      navigate('/Login'); // Optional: force logout on invalid token
    }
  }
  return (
 <>
  <header className="flex justify-between items-end shadow-2xl p-4 bg-orange-800 font-system w-full overflow-x-hidden z-10">
    {/* Logo */}
    <div className="flex-shrink-0">
      <img src={LOGO} className="w-32 h-32" alt="Logo" />
    </div>

    {/* Navigation */}
    <nav className="flex flex-col md:flex-row gap-4 text-white text-sm md:text-2xl items-center">
      <Link className="px-4 hover:bg-orange-900 py-2 rounded-lg" to="/">Home</Link>
      <Link className="px-4 hover:bg-orange-900 py-2 rounded-lg" to="/About">Tentang Kami</Link>
      <Link className="px-4 hover:bg-orange-900 py-2 rounded-lg" to="/Katalog">Katalog</Link>
      
    </nav>
  </header>

  {/* Small div right below header */}
  <div className="bg-gradient-to-b from-black to-gray-700 text-white text-right p-2 shadow-md">
    <nav>
    {isAdmin && (
            <>
              <Link className="px-4 hover:bg-blue-500 py-2 rounded-lg" to="/Admin">Admin Dashboard</Link>
    <button
                onClick={handleLogout}
                className="px-4 hover:bg-blue-500 py-2 rounded-lg"
              >
                Log Out
              </button>
            </>
          )}

    {!isAdmin && token && (
      <><button
              onClick={handleLogout}
              className="px-4 hover:bg-blue-500 py-2 rounded-lg"
            >
              Log Out
              </button>
            </>
    )}
    {!isAdmin && !token && (
      <Link className="px-4 hover:bg-blue-500 py-2 rounded-lg" to="/Login">Log In</Link>
    )}
    </nav>
  </div>
</>
  );
};

export default Header;