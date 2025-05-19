import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/Catalogue_api/produk/${id}/`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);

  if (!product) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <section className="py-20 px-4 min-h-screen shadow-lg">
      <div className="max-w-7xl mx-auto mt-10 h-full">
        <div className="flex flex-col lg:flex-row gap-8 shadow-lg rounded-md">
          {/* Product Gallery */}
          <div className="w-full lg:w-1/2 space-y-4 px-4 py-4">
            <div className="border rounded overflow-hidden shadow-lg">
              <img
                id="main-product-image"
                src={product.gambar}
                alt={product.nama}
                className="w-full h-auto shadow-lg"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 space-y-4 mt-5">
            <h1 className="text-2xl font-semibold">{product.nama}</h1>
            <div className="text-xl font-bold text-gray-800">Rp {parseInt(product.harga).toLocaleString('id-ID')}<br></br>
                <span className="text-gray-600 text-sm">In Stock :<span className='ml-2 text-green-600 text-xs'>
                        {product.stok}
                    </span>
                </span>
                </div>
            {/* Tabs */}
            <div className="mt-6">
               <a
                        href={`https://wa.me/6285877064835?text=${encodeURIComponent(`Hello, I have a question about ${product.nama}.`)}`}
                        className="inline-block mt-4 px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700"
                >
                Chat with us</a>
              <div className="mt-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Deskripsi Produk</h3>
                <p className="text-gray-700 mb-4">
                  {product.deskripsi}
                </p>

                <h4 className="font-medium">Key Features:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li><strong>Active Noise Cancellation:</strong> Block out external noise...</li>
                  <li><strong>High-Quality Sound:</strong> 40mm dynamic drivers...</li>
                  <li><strong>Long Battery Life:</strong> Up to 30 hours playback...</li>
                  {/* ... */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
