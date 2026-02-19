import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Katalog() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://127.0.0.1:8000/Catalogue_api/produk/"),
      axios.get("http://127.0.0.1:8000/Catalogue_api/kategori/"),
    ])
      .then(([produkResponse, kategoriResponse]) => {
        setProducts(produkResponse.data);
        setCategories(kategoriResponse.data);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const productTypes = [
    "All",
    ...new Set(categories.map((category) => category.nama)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesName = product.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchedCategory = categories.find(
      (cat) => cat.id === product.kategori,
    );
    const categoryNama = matchedCategory ? matchedCategory.nama : "";
    const matchesType = selectedType === "All" || selectedType === categoryNama;
    const matchesMinPrice = !minPrice || product.harga >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || product.harga <= Number(maxPrice);
    return matchesName && matchesType && matchesMaxPrice && matchesMinPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans mt-32">
      {/* Header & Filter Section */}
      <section className="bg-white border-b pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Katalog Produk
            </h2>
            <p className="text-gray-500 mt-2">
              Temukan koleksi perlengkapan dapur terbaik untuk Anda
            </p>
          </div>

          {/* Search Bar & Price Filters */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 focus:ring-2 focus:ring-orange-800 focus:border-transparent outline-none transition-all shadow-sm bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
              <input
                type="number"
                placeholder="Harga Min"
                className="w-full sm:w-32 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-800 bg-white shadow-sm"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Harga Max"
                className="w-full sm:w-32 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-800 bg-white shadow-sm"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {productTypes.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedType(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedType === category
                    ? "bg-orange-800 text-white shadow-md shadow-orange-900/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-800 hover:text-orange-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/ProductDetail/${product.id}`}>
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={`http://127.0.0.1:8000${product.gambar}`}
                        alt={product.nama}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm text-orange-800 px-3 py-1 rounded-lg font-bold shadow-sm">
                          Rp {parseInt(product.harga).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link to={`/ProductDetail/${product.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-orange-800 transition-colors mb-2 line-clamp-1">
                        {product.nama}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
                      {product.deskripsi}
                    </p>

                    <a
                      href={`https://wa.me/6285877064835?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang ${product.nama}.`)}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-orange-800 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Chat via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-8">
                <div className="text-gray-300 mb-4 flex justify-center">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Produk tidak ditemukan
                </h3>
                <p className="text-gray-500 mt-2">
                  Coba gunakan kata kunci lain atau ubah filter harga.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMinPrice("");
                    setMaxPrice("");
                    setSelectedType("All");
                  }}
                  className="mt-6 text-orange-800 font-bold hover:underline"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Katalog;
