import logo from '../logo.svg';
import '../App.css';
import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  useEffect(()=> {
    Promise.all([
      axios.get('http://127.0.0.1:8000/Catalogue_api/produk/')
      ,axios.get('http://127.0.0.1:8000/Catalogue_api/kategori/')])
    .then(([response, response2]) => {
      setProducts(response.data)
      setCategories(response2.data)
    })
    .catch((err) => console.log("Error :", err))
  },[])
  const categorizedProducts = [];
  const seenCategories = new Set();
  for (const product of products) {
    const matchedCategory = categories.find(cat => cat.id === product.kategori);
    if (matchedCategory && !seenCategories.has(product.kategori)) {
      categorizedProducts.push(product);
      seenCategories.add(product.kategori);
    }
}
  return (
      <div className="Home">
  <div className="flex flex-col min-h-screen min-w-screen">

    {/* Hero Section */}
    <section className="min-h-[40vh] bg-gray-100 py-16 bg-center bg-no-repeat bg-cover mt-5" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_1280.jpg')`}}>
      <div className="flex flex-col max-w-6xl mx-auto px-4 text-center gap-10 items-center justify-center" >
        <h1 className="text-7xl font-bold text-white">Discover Our Collection</h1>
        <p className="text-white text-4xl">Explore our wide range of high-quality products carefully selected for you.</p>
        <a href="#categories" className="inline-block top-0 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">Shop Now</a>
      </div>
    </section>

    {/* Our Categories */}
    <section className="py-16 bg-white" id="categories">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Our Categories</h2>
          <p className="text-gray-600">Browse through our diverse categories and find exactly what you need.</p>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row justify-center gap-2">
          {categorizedProducts.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition w-full max-w-sm">
              <img src={`http://localhost:8000${product.gambar}`} alt={product.kategori} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{product.nama}</h3>
                <Link to='/Katalog' className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  View All
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Products */}
    <section className="py-16 bg-gray-100" id="featured-products">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Featured Products</h2>
          <p className="text-gray-600">Produk yang tersedia saat ini.</p>
        </div>
        <div className="flex md:flex-col lg:flex-row justify-center md:items-center gap-2">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition w-full max-w-sm">
              <img src={`http://localhost:8000${product.gambar}`} alt={product.kategori} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{product.nama}</h3>
                <Link to={`/ProductDetail/${product.id}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Product Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  </div>
</div>

  );
}

export default Home;
