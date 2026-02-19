import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Local Assets
import heroImage from "../assets/images/CKA_PAN.jpg";
import heroImage2 from "../assets/images/HERO2.jpg";
import heroImage3 from "../assets/images/HERO3.jpg";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(0);

  const images = [heroImage, heroImage2, heroImage3];

  const prevSlide = () =>
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const nextSlide = () =>
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/Catalogue_api/produk/"),
      axios.get("http://localhost:8000/Catalogue_api/kategori/"),
    ])
      .then(([response, response2]) => {
        setProducts(response.data);
        setCategories(response2.data);
      })
      .catch((err) => console.log("Error :", err));

    // Auto-advance hero carousel
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [current]);

  const categorizedProducts = [];
  const seenCategories = new Set();
  for (const product of products) {
    const matchedCategory = categories.find(
      (cat) => cat.id === product.kategori,
    );
    if (matchedCategory && !seenCategories.has(product.kategori)) {
      categorizedProducts.push({
        ...product,
        categoryName: matchedCategory.nama,
      });
      seenCategories.add(product.kategori);
    }
  }

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {images.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
              style={{ transitionProperty: "opacity, transform" }}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt="Hero"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-left animate-in fade-in slide-in-from-left-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Upgrade Your <span className="text-orange-500">Kitchen</span>{" "}
              Experience
            </h1>
            <p className="text-gray-200 text-lg md:text-2xl mb-10 leading-relaxed">
              Discover high-quality cookware and kitchen essentials designed for
              the modern home chef.
            </p>
            <div className="flex gap-4">
              <a
                href="#categories"
                className="bg-orange-700 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-900/20"
              >
                Explore Categories
              </a>
              <Link
                to="/Katalog"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Full Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Nav Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-12 bg-orange-500" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-gray-50" id="categories">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-500 text-lg font-medium">
                Find exactly what you're looking for.
              </p>
            </div>
            <Link
              to="/Katalog"
              className="text-orange-800 font-bold hover:text-orange-600 transition flex items-center gap-2"
            >
              View All Categories <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorizedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000${product.gambar}`}
                    alt={product.categoryName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {product.categoryName || product.nama}
                  </h3>
                  <Link
                    to="/Katalog"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Slider */}
      <section className="py-24 bg-white" id="featured-products">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-700 font-bold tracking-widest uppercase text-sm">
              Our Favorites
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Featured Products
            </h2>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500 }}
            slidesPerView={1}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-16 featured-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
                  <div className="h-64 overflow-hidden bg-gray-50">
                    <img
                      src={`http://127.0.0.1:8000${product.gambar}`}
                      alt={product.nama}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {product.nama}
                    </h3>
                    <p className="text-orange-700 font-bold mb-4">
                      Rp {parseInt(product.harga).toLocaleString("id-ID")}
                    </p>
                    <Link
                      to={`/ProductDetail/${product.id}`}
                      className="block text-center py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}

export default Home;
