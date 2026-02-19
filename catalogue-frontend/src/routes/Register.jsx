import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUserPlus,
  FiSmartphone,
  FiUser,
  FiLock,
  FiMail,
} from "react-icons/fi";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nama: "",
    no_whatsapp: "",
    password: "",
    password_confirm: "",
    peran: "pengguna", // Default sesuai model
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/Catalogue_api/register/",
        formData,
      );
      alert("Pendaftaran Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data);
      alert(JSON.stringify(err.response?.data) || "Gagal mendaftar.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4 py-12">
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-orange-900/10 w-full max-w-lg border border-slate-50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-800 text-white rounded-2xl mb-4 shadow-lg shadow-orange-800/30">
            <FiUserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Daftar Akun
          </h2>
          <p className="text-slate-500 mt-2">
            Lengkapi data untuk pengalaman belanja terbaik
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-800"
              placeholder="Contoh: Budi Setiawan"
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-800"
              placeholder="budi_s"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-800"
              placeholder="budi@email.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              No. WhatsApp
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-800"
              placeholder="08123456789"
              onChange={(e) =>
                setFormData({ ...formData, no_whatsapp: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-800"
              placeholder="••••••••"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-800"
              placeholder="••••••••"
              onChange={(e) =>
                setFormData({ ...formData, password_confirm: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-orange-800 shadow-lg transition-all active:scale-[0.98] mt-4"
          >
            Buat Akun Sekarang
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-orange-800 font-bold hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
