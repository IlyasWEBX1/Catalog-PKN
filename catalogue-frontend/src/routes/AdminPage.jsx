import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminDashboard from "../components/AdminMenu";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const token = localStorage.getItem("authToken");
  const [activeTab, setActiveTab] = useState("products"); // Tab state

  // --- ORIGINAL STATE HOOKS (All Preserved) ---
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedStock, setEditedStock] = useState(null);
  const [editedDesc, setEditedDesc] = useState("");
  const [EditedCategory, setEditedCategory] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState(null);

  // --- ORIGINAL LOGIC (All Preserved) ---
  const refreshProducts = () => {
    Promise.all([
      axios.get("http://localhost:8000/Catalogue_api/produk/"),
      axios.get("http://localhost:8000/Catalogue_api/kategori/"),
      axios.get("http://localhost:8000/Catalogue_api/pesan/"),
      axios.get("http://localhost:8000/Catalogue_api/user/"),
    ])
      .then(([res, res2, res3, res4]) => {
        setProducts(res.data);
        setCategories(res2.data);
        setMessages(res3.data);
        setUsers(res4.data);
      })
      .catch((err) => console.log("Error:", err));
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/Catalogue_api/produk/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => refreshProducts())
      .catch((err) => console.error("Delete error:", err));
  };

  const handleDeleteCategory = (id) => {
    axios
      .delete(`http://localhost:8000/Catalogue_api/kategori/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => refreshProducts())
      .catch((err) => console.error("Delete error:", err));
  };

  const handleDeletePesan = (id) => {
    axios
      .delete(`http://localhost:8000/Catalogue_api/pesan/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => refreshProducts())
      .catch((err) => console.error("Delete error:", err));
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedName(product.nama);
    setEditedPrice(product.harga);
    setEditedStock(product.stok);
    setEditedCategory(product.kategori);
    setEditedDesc(product.deskripsi);
    setEditedImage(product.gambar);
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditedCategoryName(category.nama);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", editedName);
    formData.append("harga", editedPrice);
    formData.append("kategori", EditedCategory);
    formData.append("deskripsi", editedDesc);
    formData.append("stok", editedStock);
    if (editedImage && editedImage instanceof File && editedImage.size > 0) {
      formData.append("gambar", editedImage);
    }
    axios
      .patch(
        `http://localhost:8000/Catalogue_api/produk/${editingId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        setEditingId(null);
        setEditedImage(null);
        refreshProducts();
      })
      .catch((err) =>
        console.error("Update failed:", err.response?.data || err),
      );
  };

  const handleCategoryUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8000/Catalogue_api/kategori/${editingCategoryId}/`,
        { nama: editedCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setEditingCategoryId(null);
        refreshProducts();
      })
      .catch((err) =>
        console.error("Update failed:", err.response?.data || err),
      );
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", newName);
    formData.append("harga", newPrice);
    formData.append("stok", newStock);
    formData.append("kategori", newCategory);
    formData.append("deskripsi", newDesc);
    if (newImage) formData.append("gambar", newImage);
    axios
      .post("http://localhost:8000/Catalogue_api/produk/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setNewName("");
        setNewPrice("");
        setNewStock("");
        setNewCategory("");
        setNewDesc("");
        setNewImage(null);
        refreshProducts();
        setActiveTab("products");
      })
      .catch((err) =>
        console.error("Add product failed:", err.response?.data || err),
      );
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/Catalogue_api/kategori/",
        { nama: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setNewCategoryName("");
        refreshProducts();
        setActiveTab("categories");
      })
      .catch((err) =>
        console.error("Add category failed:", err.response?.data || err),
      );
  };

  const handleConfirm = (produkId, pesanId) => {
    axios
      .post(
        `http://localhost:8000/Catalogue_api/konfirmasi-pesanan/${produkId}/${pesanId}`,
      )
      .then(() => refreshProducts())
      .catch((err) => {
        alert("Gagal mengurangi stok");
      });
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminDashboard />

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] p-8 pt-36">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your inventory, categories, and customer messages.
            </p>
          </header>

          {/* Tab Navigation */}
          <div className="flex space-x-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-8 shadow-inner">
            {["products", "categories", "messages", "forms"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-orange-700 shadow-md transform scale-105"
                    : "text-slate-600 hover:text-orange-600 hover:bg-white/50"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content Cards */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[500px]">
            {/* 1. PRODUCTS TABLE TAB */}
            {activeTab === "products" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">
                    Product List
                  </h2>
                </div>
                <div className="overflow-x-auto px-4 pb-4">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="px-4 py-5">ID</th>
                        <th className="px-4 py-5">Product</th>
                        <th className="px-4 py-5">Price</th>
                        <th className="px-4 py-5">Stock</th>
                        <th className="px-4 py-5">Category</th>
                        <th className="px-4 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-4 py-4 text-slate-400 font-mono text-sm">
                            #{product.id}
                          </td>
                          <td className="px-4 py-4 font-bold text-slate-700">
                            {product.nama}
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-600">
                            Rp {parseInt(product.harga).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${product.stok < 5 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
                            >
                              {product.stok} unit
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-500 text-sm">
                            {categories.find(
                              (cat) => cat.id === product.kategori,
                            )?.nama || "Unknown"}
                          </td>
                          <td className="px-4 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/ProductConfiguration/${product.id}`)
                              }
                              className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                            >
                              Configure
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. CATEGORIES TAB */}
            {activeTab === "categories" && (
              <div className="p-8 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Manage Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:border-orange-200 transition-all shadow-sm"
                    >
                      <div>
                        <span className="text-xs font-mono text-slate-400">
                          ID: {cat.id}
                        </span>
                        <p className="font-bold text-slate-800">{cat.nama}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. MESSAGES TAB */}
            {activeTab === "messages" && (
              <div className="p-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Customer Messages
                </h2>
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-800 text-white">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {messages.map((pesan, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-mono">
                            {pesan.id}
                          </td>
                          <td className="px-6 py-4 font-bold">
                            {users.find((u) => u.id === pesan.user)?.nama ||
                              "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {products.find((p) => p.id === pesan.produk)
                              ?.nama || "Unknown"}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {pesan.laporan}
                            </p>
                            <p className="text-xs text-slate-500">
                              {pesan.isi_pesan}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2 mt-4">
                            <button
                              onClick={() =>
                                handleConfirm(pesan.produk, pesan.id)
                              }
                              className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-200"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleDeletePesan(pesan.id)}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-red-200"
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
            )}

            {/* 4. ADD NEW FORMS TAB (Consolidated all original "Add" forms) */}
            {activeTab === "forms" && (
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in zoom-in-95 duration-300">
                {/* Add Category Form */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2 h-6 bg-orange-600 rounded-full"></span>{" "}
                    Add Category
                  </h3>
                  <form
                    onSubmit={handleAddCategory}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-inner"
                  >
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none font-medium"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all transform hover:-translate-y-1"
                    >
                      Create Category
                    </button>
                  </form>
                </div>

                {/* Add Product Form */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>{" "}
                    Add Product
                  </h3>
                  <form
                    onSubmit={handleAddProduct}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-inner"
                  >
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Price"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200"
                        required
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImage(e.target.files[0])}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200"
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nama}
                        </option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Product Description"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                    >
                      Publish Product
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- ORIGINAL MODALS (All Preserved and Styled) --- */}

      {/* 1. Edit Product Modal */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${editingId ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setEditingId(null)}
      >
        <form
          onSubmit={handleUpdate}
          className={`bg-white p-8 rounded-[2rem] shadow-2xl w-[450px] transform transition-all duration-300 ${editingId ? "scale-100 rotate-0" : "scale-90 rotate-2"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-black text-slate-800 mb-6 border-b pb-4">
            Update Product
          </h2>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                Nama :
              </label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                  Harga :
                </label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                  Stok :
                </label>
                <input
                  type="number"
                  value={editedStock}
                  onChange={(e) => setEditedStock(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                Deskripsi :
              </label>
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                New Image :
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditedImage(e.target.files[0])}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                Kategori :
              </label>
              <select
                value={EditedCategory}
                onChange={(e) => setEditedCategory(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Edit Category Modal */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${editingCategoryId ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setEditingCategoryId(null)}
      >
        <form
          onSubmit={handleCategoryUpdate}
          className={`bg-white p-8 rounded-[2rem] shadow-2xl w-96 transform transition-all duration-300 ${editingCategoryId ? "scale-100" : "scale-90"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-black text-slate-800 mb-6">
            Edit Category
          </h2>
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase mb-1">
              Category Name :
            </label>
            <input
              type="text"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-6 shadow-lg"
          >
            Update Name
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;
