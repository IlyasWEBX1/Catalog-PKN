import React from 'react';
import { Link } from 'react-router-dom';

function Header(){
  return (
    <nav className="p-4 bg-orange-800 text-white">
      <Link className="px-2" to="/">Home</Link>
      <Link className="px-2" to="/About">Tentang Kami</Link>
      <Link className="px-2" to="/Catalog">Katalog</Link>
    </nav>
  );
};

export default Header;