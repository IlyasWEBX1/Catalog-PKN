import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../assets/images/LOGO.png';

function Header(){
  return (
    <header className='flex justify-between shadow-2xl items-center p-4 bg-orange-800 font-system w-full overflow-x-hidden z-10'>
      <div className='mb-4 md:mb-0'><img src={LOGO} className='w-32 h-32'></img></div>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-4 text-white text-2xl items-center self-end">
        <Link className="px-4 hover:bg-orange-900 py-2 rounded-lg" to="/">Home</Link>
        <Link className="px-4 hover:bg-orange-900 py-2 rounded-lg" to="/About">Tentang Kami</Link>
        <Link className="px-4 hover:bg-orange-900 py-2 rounded-lg" to="/Katalog">Katalog</Link>
      </nav>
    </header>
  );
};

export default Header;