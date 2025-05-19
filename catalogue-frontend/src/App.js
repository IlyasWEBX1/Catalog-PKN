import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './routes/Home';
import About from './routes/About';
import Header from './components/Header';
import Katalog from './routes/Katalog'
import Footer from './components/Footer';
import ProductDetail from './routes/ProductDetail';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Katalog" element={<Katalog />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
