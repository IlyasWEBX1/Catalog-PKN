// src/pages/AdminPage.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const token = localStorage.getItem('authToken');
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editedStock, setEditedStock] = useState(null);
  const [editedDesc, setEditedDesc] = useState('');
  const [EditedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const refreshProducts = () => {
  Promise.all([axios.get('http://127.0.0.1:8000/Catalogue_api/produk/'), 
    axios.get('http://127.0.0.1:8000/Catalogue_api/kategori/'),
  axios.get('http://127.0.0.1:8000/Catalogue_api/pesan/'),
    axios.get('http://127.0.0.1:8000/Catalogue_api/user/'),
])
    .then(([res, res2, res3, res4]) => {
      setProducts(res.data) 
      setCategories(res2.data)
      setMessages(res3.data)
      setUsers(res4.data)
    })
    .catch((err) => console.log("Error:", err));
};
  useEffect(()=> {
      refreshProducts();
  },[])
  const handleDelete = (id) => {
  axios.delete(`http://127.0.0.1:8000/Catalogue_api/produk/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(() => refreshProducts())
  .catch((err) => console.error('Delete error:', err));
};
 const handleDeleteCategory = (id) => {
  axios.delete(`http://127.0.0.1:8000/Catalogue_api/kategori/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(() => refreshProducts())
  .catch((err) => console.error('Delete error:', err));
};
const handleDeletePesan = (id) => {
  axios.delete(`http://127.0.0.1:8000/Catalogue_api/pesan/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(() => refreshProducts())
  .catch((err) => console.error('Delete error:', err));
};
  const productTypes = [0, ...new Set(categories.map((category) => category.nama))];
  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedName(product.nama);
    setEditedPrice(product.harga);
    setEditedStock(product.stok);
    setEditedCategory(product.kategori)
    setEditedDesc(product.deskripsi)
  };
    const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditedCategoryName(category.nama);
  };
 const handleUpdate = (e) => {
  e.preventDefault();

  axios.put(
    `http://127.0.0.1:8000/Catalogue_api/produk/${editingId}/`,
    {
      nama: editedName,
      harga: editedPrice,
      kategori: EditedCategory,
      deskripsi: editedDesc,
      stok: editedStock

      // gambar: not included
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then(() => {
    setEditingId(null);
    refreshProducts();
  }).catch(err => {
    console.error('Update failed:', err.response?.data || err);
  });
};
 const handleCategoryUpdate = (e) => {
  e.preventDefault();

  axios.put(
    `http://127.0.0.1:8000/Catalogue_api/kategori/${editingCategoryId}/`,
    {
      nama: editedCategoryName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then(() => {
    setEditingCategoryId(null);
    refreshProducts();
  }).catch(err => {
    console.error('Update failed:', err.response?.data || err);
  });
};

const handleAddProduct = (e) => {
  e.preventDefault();
  axios.post(
    'http://127.0.0.1:8000/Catalogue_api/produk/',
    {
      nama: newName,
      harga: newPrice,
      stok: newStock,
      kategori: newCategory,
      deskripsi: newDesc,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then(() => {
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewCategory('');
    setNewDesc('');
    refreshProducts();
  }).catch(err => {
    console.error('Add product failed:', err.response?.data || err);
  });
};
const handleAddCategory = (e) => {
  e.preventDefault();
  axios.post(
    'http://127.0.0.1:8000/Catalogue_api/kategori/',
    {
      nama: newCategoryName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then(() => {
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewCategory('');
    setNewDesc('');
    refreshProducts();
  }).catch(err => {
    console.error('Add product failed:', err.response?.data || err);
  });
};
const handleConfirm = (produkId, pesanId) => {
  axios.post(`http://127.0.0.1:8000/Catalogue_api/kurangi-stok/${produkId}/${pesanId}`)
    .then(() => {
      // Fetch both updated products and messages
      refreshProducts()
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Gagal mengurangi stok');
    });
};
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-orange-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-700">Add, update, or delete products from the catalog.</p>
          <table className="mt-6 min-w-full table-auto border">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2">{product.nama}</td>
                  <td className="px-4 py-2">Rp. {parseInt(product.harga).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">{product.stok}</td>
                  <td className="px-4 py-2">
                    {categories.find(cat => cat.id === product.kategori)?.nama || 'Unknown'}
                  </td>
                  <td className="px-4 py-2">{product.deskripsi}</td>
                  <td className="flex flex-row px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
          <p className="text-gray-700">Add, update, or delete categories.</p>
          <table className="mt-6 min-w-full table-auto border">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.id}</td>
                  <td className="px-4 py-2">{product.nama}</td>
                  <td className="flex flex-row px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditCategory(product)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(product.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
    editingId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}
            onClick={() => setEditingId(null)} // Close modal if click outside form
          >
            <form
              onSubmit={handleUpdate}
              className="bg-white p-6 rounded shadow w-96 transform transition-transform duration-300 ease-in-out
    ${editingId ? 'scale-100' : 'scale-90'}"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside form
            >
              {/* Your form fields here */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-semibold">Nama :</label>
                  <input
                    id="name"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block mb-1 font-semibold">Harga :</label>
                  <input
                    id="price"
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block mb-1 font-semibold">Stok :</label>
                  <input
                    id="stock"
                    type="number"
                    value={editedStock}
                    onChange={(e) => setEditedStock(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block mb-1 font-semibold">Deskripsi :</label>
                  <input
                    id="description"
                    type="text"
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>

                <div>
                  <label htmlFor="category-select" className="block mb-1 font-semibold">Kategori :</label>
                  <select
                    id="category-select"
                    value={EditedCategory}
                    onChange={(e) => setEditedCategory(Number(e.target.value))}
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option value="">--Please choose a category--</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                            {EditedCategory && (
                <p>You selected: <strong>{EditedCategory}</strong></p>
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              >
                Update
              </button>
            </form>
          </div>
           <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
    editingCategoryId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`}
            onClick={() => setEditingCategoryId(null)} // Close modal if click outside form
          >
            <form
              onSubmit={handleCategoryUpdate}
              className="bg-white p-6 rounded shadow w-96 transform transition-transform duration-300 ease-in-out
    ${editingCategoryId ? 'scale-100' : 'scale-90'}"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside form
            >
              {/* Your form fields here */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-semibold">Nama :</label>
                  <input
                    id="name"
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              >
                Update
              </button>
            </form>
          </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Manage Messages</h2>
          <p className="text-gray-700">View Messages and confirm order.</p>
          {/* Add user-related actions here */}
          <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-orange-800 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Produk</th>
                <th className="border px-4 py-2">Laporan</th>
                <th className="border px-4 py-2">Isi Pesan</th>
                <th className="border px-4 py-2">Waktu</th>
                 <th className="border px-4 py-2">Confirmation</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((pesan, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">{pesan.id}</td>
                  <td className="border px-4 py-2">{users.find((user)=>user.id === pesan.user)?.nama || "Uknown"}</td>
                  <td className="border px-4 py-2">{products.find((product) => product.id === pesan.produk)?.nama || "Unknown"}</td>
                  <td className="border px-4 py-2">{pesan.laporan}</td>
                  <td className="border px-4 py-2">{pesan.isi_pesan}</td>
                  <td className="border px-4 py-2">{new Date(pesan.waktu).toLocaleString("id-ID")}</td>
                  <td className="border px-4 py-2 flex flex-row gap-2">
                    <button
                      onClick={() => handleConfirm(pesan.produk, pesan.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDeletePesan(pesan.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-2">
            <input
              type="text"
              placeholder="Nama Produk"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-2">
            <input
              type="text"
              placeholder="Nama Produk"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              required
            />
            <input
              type="number"
              placeholder="Harga"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              required
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(Number(e.target.value))}
              className="border px-2 py-1 rounded w-full"
              required
            >
              <option value="">--Pilih Kategori--</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Deskripsi"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
