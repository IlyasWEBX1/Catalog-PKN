import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./routes/Home";
import About from "./routes/About";
import Header from "./components/Header";
import Katalog from "./routes/Katalog";
import Footer from "./components/Footer";
import ProductDetail from "./routes/ProductDetail";
import Contact from "./routes/Contact";
import LoginPage from "./routes/Login";
import { AdminRoute } from "./components/AdminRoute";
import AdminPage from "./routes/AdminPage";
import Analytics from "./routes/Analytics";
import ProductConfiguration from "./routes/ProductConfiguration";
import RegisterPage from "./routes/Register";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Tentang Kami" element={<About />} />
        <Route path="/Katalog" element={<Katalog />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route
          path="/ProductConfiguration/:id"
          element={<ProductConfiguration />}
        />
        <Route path="/Contact/" element={<Contact />} />
        <Route path="/Analytics/" element={<Analytics />} />
        <Route
          path="/Admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
