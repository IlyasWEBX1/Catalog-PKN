import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './routes/Home';
import About from './routes/About';
import Header from './components/Header';
import Katalog from './routes/Katalog'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Katalog" element={<Katalog />} />
      </Routes>
    </Router>
  );
}

export default App;
