import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/CKA.png';
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
<header className="fixed top-0 left-0 right-0 z-50 bg-red-800 text-gray-100 border-b border-red-900/40 px-4 lg:px-6 py-2.5 shadow-lg backdrop-blur flex items-center justify-between">
  {/* Logo */}
  <div className="flex-shrink-0">
    <Link to="/" className="block rounded hover:bg-red-700/60 p-1 transition">
      <img src={LOGO} className="w-20 h-20 object-contain" alt="Logo" />
    </Link>
  </div>

  {/* Navigation */}
  <nav className="flex-1 flex gap-2 ml-4 text-xl md:text-base">
    {["Home", "Katalog"].map((item) => (
      <Link
        key={item}
        to={item === "Home" ? "/" : `/${item.replace(" ", "")}`}
        className="px-3 py-2 rounded text-gray-200 hover:text-white hover:bg-red-700/60 transition text-xl font-semibold"
      >
        {item}
      </Link>
    ))}
     <Link
        to={"/Tentang Kami"}
        className="px-3 py-2 rounded text-gray-200 hover:text-white hover:bg-red-700/60 transition text-xl font-semibold"
      >
        {"Tentang Kami"}
      </Link>
  </nav>

  {/* Auth / Admin */}
  <div className="flex gap-2 items-center">
    {isAdmin && (
      <><Link
            to="/Admin"
            className="px-3 py-2 rounded bg-gray-100 text-red-800 hover:bg-white transition text-xl font-medium"
          >
            Admin
          </Link><Link
            to="/Analytics/"
            className="px-3 py-2 rounded bg-gray-100 text-red-800 hover:bg-white transition text-xl font-medium"
          >
              Analytics
            </Link></>
    )}

    {token ? (
      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded border border-red-300/50 hover:bg-red-700/60 transition text-xl font-medium"
      >
        Log Out
      </button>
    ) : (
      <Link
        to="/Login"
        className="px-3 py-2 rounded bg-gray-100 text-red-800 hover:bg-white transition text-xl font-medium"
      >
        Log In
      </Link>
    )}
  </div>
</header>



  );
};

export default Header;