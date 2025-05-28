import logo from '../logo.svg';
import '../App.css';
import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';



function Katalog() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:8000/Catalogue_api/produk/"),
            axios.get("http://localhost:8000/Catalogue_api/kategori/"),
        ])
            .then(([produkResponse, kategoriResponse]) => {
            setProducts(produkResponse.data);
            setCategories(kategoriResponse.data);
            })
            .catch((error) => {
            console.error("Error fetching products or categories:", error);
            });
        }, []);

    const productTypes = ["All", ...new Set(categories.map((category) => category.nama))];
    const filteredProducts = products.filter((product) =>{
            const matchesName = product.nama.toLowerCase().includes(searchQuery.toLowerCase())
            const matchedCategory = categories.find(cat => cat.id === product.kategori);
            const categoryNama = matchedCategory ? matchedCategory.nama : "";
            const matchesType = selectedType === "All" || selectedType === categoryNama
            return matchesName && matchesType
    });
    return (
        <div className="min-h-screen font-system mt-5">
        <section className="bg-gray-100 py-16">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-bold">Katalog</h2>
            </div>
            <div className="flex-1 flex justify-center px-4">
            <input
                type="text"
                placeholder="Search..."
                className="w-full max-w-md px-4 py-2 rounded-md border border-white focus:outline-none focus:ring-2 focus:ring-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
             <div className="flex flex-wrap justify-center gap-2">
            {productTypes.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedType(category)}
                className={`px-4 py-2 rounded-md border ${
                  selectedType === category
                    ? "bg-orange-800 text-white"
                    : "bg-white text-black"
                } hover:bg-orange-700`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredProducts.map((product)=> (
                <Link to={`/ProductDetail/${product.id}`}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                    <div className="h-48 overflow-hidden">
                    <img
                        src={`http://localhost:8000${product.gambar}`}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="p-4">
                    <h3 className="text-xl font-semibold">{product.nama}</h3>
                    <p className="text-orange-800 font-bold">Rp. {parseInt(product.harga).toLocaleString('id-ID')}</p>
                    <p className="text-gray-600">{product.deskripsi}</p>
                    <a
                        href={`https://wa.me/6285877064835?text=${encodeURIComponent(`Hello, I have a question about ${product.nama}.`)}`}
                        className="inline-block mt-4 px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700"
                    >
                        Chat with us
                    </a>
                    </div>
                </div>
                </Link>
                 ))}
             {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 mt-8">
                No products match your search.
                </p>
            )}
            </div>
            </div>
        </section>
</div>

    );
}


export default Katalog;
