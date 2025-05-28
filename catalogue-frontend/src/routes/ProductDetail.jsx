import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({}) {
  const user_id = null;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("")
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/Catalogue_api/produk/${id}/`)
      .then((response) =>{
        setProduct(response.data)
        setMessage(`Hello, I have a question about ${response.data.nama}.`)
  })
      .catch((error) => console.error('Error fetching product:', error));
  }, [id]);
  const handleChat = async () => {

  await axios.post('http://localhost:8000/Catalogue_api/send-message/', {
    product_id: product.id,
    message: message,
    user_id: null  // if user is authenticated
  });

  setShowModal(false);

  // After saving, open WhatsApp
  window.open(`https://wa.me/6285877064835?text=${encodeURIComponent(message)}`, "_blank");
};
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
          <div className="w-full lg:w-1/2 space-y-4 mt-5 py-4 px-4">
            <h1 className="text-2xl font-semibold">{product.nama}</h1>
            <div className="text-xl font-bold text-gray-800">Rp {parseInt(product.harga).toLocaleString('id-ID')}<br></br>
                <span className="text-gray-600 text-sm">In Stock :<span className='ml-2 text-green-600 text-xs'>
                        {product.stok}
                    </span>
                </span>
            </div>
             <div className="mt-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Deskripsi Produk</h3>
                <p className="text-gray-700 mb-4">
                  {product.deskripsi}
                </p>
              </div>
            {/* Tabs */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit your message</h2>
                <textarea
                  className="w-full p-2 border rounded shadow mb-4"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChat}
                    className="px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700"
                  >
                    Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
            {/* Chat Button */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-block mt-4 mb-4 px-4 py-2 bg-orange-800 text-white rounded hover:bg-orange-700"
            >
              Chat with us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
