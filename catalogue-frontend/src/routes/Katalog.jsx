import logo from '../logo.svg';
import '../App.css';
import React, {useState, useEffect} from 'react';
import axios from "axios";




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
            let categoryNama = ""
            const matchedCategory = categories.find(cat => cat.id === product.kategori);
            if (matchedCategory) {
                categoryNama = matchedCategory.nama;
            } else {
                categoryNama = "";
            }
            const matchesType = selectedType === "All" || selectedType === categoryNama
            return matchesName && matchesType
    });
    return (
        <div className="min-h-screen font-system">
        <section className="bg-gray-100 py-16">
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
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="text-gray-600">Check out our most popular items that customers love.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredProducts.map((product)=> (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="h-48 overflow-hidden">
                    <img
                        src={product.gambar}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="p-4">
                    <h3 className="text-xl font-semibold">{product.nama}</h3>
                    <p className="text-orange-800 font-bold">Rp. {product.harga}</p>
                    <p className="text-gray-600">{product.deskripsi}</p>
                    <a
                        href="#"
                        className="inline-block mt-4 px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700"
                    >
                        Add to Cart
                    </a>
                    </div>
                </div>
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
