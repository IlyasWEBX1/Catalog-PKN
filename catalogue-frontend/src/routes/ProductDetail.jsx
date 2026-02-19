import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FiMoreVertical, FiSettings, FiEdit } from "react-icons/fi";

// Components
import ItemCarousel from "../components/slider";
import ItemCarousel2 from "../components/slider2";
import HybridCarousel from "../components/slider3";

const API_BASE = "http://127.0.0.1:8000/Catalogue_api";

function ProductDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("authToken");

  // --- STATE UTAMA ---
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeList, setActiveList] = useState("recommendations");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");

  // State untuk Data List (Rekomendasi)
  const [lists, setLists] = useState({
    recommendations: [],
    mostBought: [],
    hybrid: { data: [], target_basis: "" },
  });

  // State untuk Edit Modal
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nama: "",
    harga: "",
    stok: "",
    deskripsi: "",
    kategori: null,
    gambar: null,
  });

  // --- 1. LOGIKA AUTH ---
  const getDecodedToken = useCallback(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Konversi ke detik

      // Jika waktu sekarang lebih besar dari waktu exp, token hangus
      if (decoded.exp < currentTime) {
        console.warn("Token expired");
        localStorage.removeItem("authToken"); // Hapus token yang basi
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }, [token]);

  const isAdmin = () => getDecodedToken()?.peran === "admin";
  const currentUserId = getDecodedToken()?.user_id || getDecodedToken()?.id;

  // --- 2. LOGIKA DURASI INTERAKSI (Efek Cleanup) ---
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent > 2) {
        const payload = {
          produk: id,
          user: currentUserId,
          tipe_interaksi: "view",
          durasi: timeSpent,
        };
        axios
          .post(`${API_BASE}/interaction-logs/`, payload, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
          .catch((err) => console.error("Log failed", err));
      }
    };
  }, [id, currentUserId, token]);

  // --- 3. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = getDecodedToken();

        // REDIRECT JIKA TOKEN TIDAK ADA ATAU EXPIRED
        if (!decoded) {
          window.location.href = "/Login";
          return;
        }
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [prod, rec, most, hyb, cat] = await Promise.all([
          axios.get(`${API_BASE}/produk/${id}/`),
          axios.get(`${API_BASE}/recommendations/${id}/`),
          axios
            .get(`${API_BASE}/analytics/produk-terlaris/`)
            .catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/recommendations/hybrid/`, { headers }),
          axios.get(`${API_BASE}/kategori/`),
        ]);

        setProduct(prod.data);
        setCategories(cat.data);
        setWhatsappMessage(
          `Halo, saya ingin bertanya tentang produk ${prod.data.nama}.`,
        );
        setLists({
          recommendations: rec.data,
          mostBought: most.data,
          hybrid: hyb.data,
        });
      } catch (err) {
        console.error("Critical Fetch Error:", err);
      }
    };
    fetchData();
  }, [id, token]);

  // --- 4. HANDLERS ---
  const handleOpenEdit = () => {
    setEditForm({
      nama: product.nama,
      harga: product.harga,
      stok: product.stok,
      deskripsi: product.deskripsi,
      kategori: product.kategori_id || product.kategori,
      gambar: null,
    });
    setEditingId(product.id);
    setShowAdminMenu(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editForm).forEach((key) => {
      if (key === "gambar" && !editForm[key]) return;
      formData.append(key, editForm[key]);
    });

    try {
      await axios.patch(`${API_BASE}/produk/${editingId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Update UI lokal agar instan
      setProduct({
        ...product,
        ...editForm,
        harga: Number(editForm.harga),
        stok: Number(editForm.stok),
      });
      setEditingId(null);
    } catch (err) {
      console.error("Update failed", err.response?.data);
    }
  };

  const handleWhatsAppChat = async () => {
    try {
      await axios.post(`${API_BASE}/send-message/`, {
        product_id: product.id,
        message: whatsappMessage,
        user_id: currentUserId,
      });
      setShowWhatsAppModal(false);
      window.open(
        `https://wa.me/6285877064835?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank",
      );
    } catch (err) {
      alert("Gagal mengirim pesan.");
    }
  };

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 animate-pulse">
        Loading product details...
      </div>
    );

  return (
    <section className="bg-gray-50 min-h-screen pb-20 mt-16">
      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible grid grid-cols-1 lg:grid-cols-2">
          {/* Gambar Produk */}
          <div className="p-6 bg-white flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 rounded-t-2xl lg:rounded-l-2xl overflow-hidden relative">
            {/* LABEL ADMIN VIEW */}
            {isAdmin() && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-200 shadow-sm">
                  Admin View
                </span>
              </div>
            )}

            <div className="relative group w-full max-w-md">
              <img
                src={product.gambar}
                alt={product.nama}
                className="w-full h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Info Produk */}
          <div className="p-8 lg:p-12 flex flex-col justify-center relative">
            <nav className="text-sm text-gray-400 mb-4">
              Products / {product.kategori_nama || product.kategori || "Detail"}
            </nav>

            <div className="flex justify-between items-start mb-4 relative">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 pr-8">
                {product.nama}
              </h1>

              {isAdmin() && (
                <div className="relative">
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                  >
                    <FiMoreVertical size={24} />
                  </button>
                  {showAdminMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowAdminMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-40 py-2 animate-in fade-in zoom-in duration-200">
                        <Link
                          to={`/ProductConfiguration/${id}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <FiSettings size={18} className="text-blue-500" />{" "}
                          <span className="font-semibold">
                            Product Analytics
                          </span>
                        </Link>
                        <button
                          onClick={handleOpenEdit}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <FiEdit size={18} className="text-orange-500" />{" "}
                          <span className="font-semibold">Edit Basic Info</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-orange-700">
                Rp {parseInt(product.harga).toLocaleString("id-ID")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.stok > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {product.stok > 0 ? `Stok: ${product.stok}` : "Habis"}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                {product.deskripsi || "No description available."}
              </p>
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="w-full sm:w-auto px-10 py-4 bg-orange-800 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                Chat via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABS & CAROUSELS --- */}
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <div className="flex border-b border-gray-200 w-full justify-center mb-8">
          {[
            { id: "recommendations", label: "SIMILAR PRODUCTS" },
            { id: "mostBought", label: "MOST BOUGHT" },
            { id: "hybrid", label: "INTERACTION-BASED RECOMMENDATIONS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveList(tab.id)}
              className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeList === tab.id ? "border-orange-800 text-orange-800" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full">
          {activeList === "recommendations" && (
            <ItemCarousel items={lists.recommendations} />
          )}
          {activeList === "mostBought" && (
            <ItemCarousel2 items={lists.mostBought} />
          )}
          {activeList === "hybrid" && (
            <HybridCarousel
              items={lists.hybrid.data}
              basis={lists.hybrid.target_basis}
            />
          )}
        </div>
      </div>

      {/* --- MODAL WHATSAPP --- */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl mb-6 bg-gray-50 outline-none"
              rows="4"
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="flex-1 py-3 font-semibold hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleWhatsAppChat}
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT PRODUK --- */}
      {editingId && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setEditingId(null)}
        >
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-lg transform transition-all"
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
                  value={editForm.nama}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nama: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                    Harga :
                  </label>
                  <input
                    type="number"
                    value={editForm.harga}
                    onChange={(e) =>
                      setEditForm({ ...editForm, harga: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                    Stok :
                  </label>
                  <input
                    type="number"
                    value={editForm.stok}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stok: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                  Deskripsi :
                </label>
                <textarea
                  value={editForm.deskripsi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, deskripsi: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                  Kategori :
                </label>
                <select
                  value={editForm.kategori}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      kategori: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1">
                  New Image :
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm({ ...editForm, gambar: e.target.files[0] })
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;
