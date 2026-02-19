import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiEye,
  FiMessageCircle,
  FiTrendingUp,
  FiPackage,
  FiBarChart2,
  FiInfo,
  FiDollarSign,
  FiShoppingBag,
  FiStar,
  FiActivity,
} from "react-icons/fi";
import ProductChart from "../components/ProductChart";

const ProductConfiguration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/Login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [prodRes, perfRes] = await Promise.all([
          axios.get(
            `http://127.0.0.1:8000/Catalogue_api/produk/configuration/${id}/`,
            { headers },
          ),
          axios.get(
            `http://127.0.0.1:8000/Catalogue_api/produk/configuration/${id}/performance/`,
            { headers },
          ),
        ]);
        setProduct(prodRes.data);
        setPerformance(perfRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/Login");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-bold">Loading Studio Data...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900 p-4 md:p-10 mt-[80px]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex items-center gap-6 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Product Stats
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Analytics Dashboard
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KOLOM KIRI: Identitas & Insight */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Card Produk */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
              <img
                src={product?.gambar}
                alt={product?.nama}
                className="w-full h-72 object-cover"
              />
              <div className="p-8">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                  {product?.nama_kategori}
                </span>
                <h2 className="text-2xl font-black mt-4 mb-2">
                  {product?.nama}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">
                  "{product?.deskripsi || "No product description available."}"
                </p>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">
                    Current Stock
                  </span>
                  <span
                    className={`font-black ${product?.stok > 5 ? "text-green-600" : "text-orange-500"}`}
                  >
                    {product?.stok} Units
                  </span>
                </div>
              </div>
            </div>

            {/* STUDIO INSIGHT (Sekarang di bawah Gambar) */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <FiStar size={20} />
                </div>
                <h4 className="text-lg font-bold">Studio Insight</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed font-medium mb-6">
                {performance?.sales_performance?.quantity_sold > 0
                  ? `Produk ini telah terjual sebanyak ${performance?.sales_performance?.quantity_sold} unit dengan total pendapatan Rp ${performance?.sales_performance?.total_revenue?.toLocaleString("id-ID")}.`
                  : "Belum ada catatan penjualan. Disarankan untuk meninjau ulang strategi harga atau promosi."}
              </p>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-2">
                  <FiActivity /> Recommendation
                </div>
                <p className="text-xs text-slate-400">
                  {parseFloat(performance?.engagement?.conversion_rate) > 5
                    ? "Konversi tinggi! Pertahankan performa dengan menjaga ketersediaan stok."
                    : "Konversi rendah. Coba tambahkan lebih banyak foto atau testimoni pelanggan."}
                </p>
              </div>
            </div>
          </aside>

          {/* KOLOM KANAN: Analytics Data */}
          <main className="lg:col-span-8 space-y-6">
            {/* Metric Row 1: Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<FiEye />}
                color="blue"
                label="Awareness"
                value={performance?.engagement?.views}
                suffix="Views"
              />
              <StatCard
                icon={<FiMessageCircle />}
                color="emerald"
                label="Interest"
                value={performance?.engagement?.inquiries}
                suffix="Chats"
              />
              <StatCard
                icon={<FiTrendingUp />}
                color="violet"
                label="Conversion"
                value={performance?.engagement?.conversion_rate}
              />
            </div>

            {/* Metric Row 2: Sales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard
                icon={<FiDollarSign />}
                color="amber"
                label="Total Revenue"
                value={`Rp ${performance?.sales_performance?.total_revenue?.toLocaleString("id-ID")}`}
              />
              <StatCard
                icon={<FiShoppingBag />}
                color="rose"
                label="Sales Volume"
                value={performance?.sales_performance?.quantity_sold}
                suffix="Pcs"
              />
            </div>

            {/* Chart Section */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiBarChart2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Growth Trajectory</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Monthly Performance Analytics
                  </p>
                </div>
              </div>
              <div className="h-[400px]">
                <ProductChart data={performance?.chart_data} isMonthly={true} />
              </div>
            </section>

            {/* Inventory Value Section */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-1">
                  Total Inventory Asset Value
                </p>
                <h4 className="text-3xl font-black tracking-tighter">
                  Rp {performance?.total_stock_value?.toLocaleString("id-ID")}
                </h4>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${i <= 3 ? "bg-blue-500" : "bg-slate-100"}`}
                    ></div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Warehouse Status: Healthy
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, suffix = "" }) => {
  const themes = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    violet: "text-violet-600 bg-violet-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${themes[color]}`}
      >
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-1">
        {label}
      </p>
      <h4 className="text-xl font-black tracking-tight">
        {value || 0}{" "}
        <span className="text-xs text-slate-300 ml-1 font-bold">{suffix}</span>
      </h4>
    </div>
  );
};

export default ProductConfiguration;
