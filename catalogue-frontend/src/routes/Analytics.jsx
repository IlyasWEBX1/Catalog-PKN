import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AdminDashboard from "../components/AdminMenu";
import ProductRevenueChart from "../components/RevenueChart";
import ProductMultiLineChart from "../components/RevenueDetailed";
import formatMultiLineData from "../utils/formatMultiLineData";
import Footer from "../components/Footer";
import ProductQuantityChart from "../components/ProductQuantityChart";
// --- Helpers & Sub-Components (Defined before Analytics to avoid errors) ---

const renderGrowth = (value) => {
  if (value === null || value === undefined)
    return <span className="text-gray-400">-</span>;
  if (value === "NEW" || value === Infinity)
    return <span className="text-blue-600 font-semibold text-xs">NEW</span>;

  const isPositive = value > 0;
  return (
    <span
      className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
    >
      {isPositive ? "↑" : "↓"} {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const DateRangeControls = ({ dateRange, setDateRange }) => {
  const setPreset = (type) => {
    const now = new Date();
    let start, end;
    if (type === "today") {
      const d = now.toISOString().split("T")[0];
      start = d;
      end = d;
    } else if (type === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    }
    setDateRange({ start, end });
  };

  return (
    <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
      <button
        onClick={() => setPreset("today")}
        className="px-3 py-1 hover:bg-gray-100 rounded text-sm text-gray-700"
      >
        Today
      </button>
      <button
        onClick={() => setPreset("month")}
        className="px-3 py-1 hover:bg-gray-100 rounded text-sm text-gray-700"
      >
        Month
      </button>
      <div className="h-4 w-[1px] bg-gray-300 mx-1" />
      <input
        type="date"
        value={dateRange.start}
        onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
        className="text-sm outline-none cursor-pointer text-gray-700"
      />
      <span className="text-gray-400">-</span>
      <input
        type="date"
        value={dateRange.end}
        onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
        className="text-sm outline-none cursor-pointer text-gray-700"
      />
    </div>
  );
};

const getPreviousRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffDays =
    Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const prevEnd = new Date(startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - diffDays + 1);
  return {
    start: prevStart.toISOString().split("T")[0],
    end: prevEnd.toISOString().split("T")[0],
  };
};

// --- Main Analytics Component ---

const Analytics = () => {
  const [topProducts, setTopProducts] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [summary, setSummary] = useState({});
  const [productData, setProductData] = useState([]);
  const [multiLineData, setMultiLineData] = useState([]);
  const [grossingProducts, setGrossingProducts] = useState(null);
  const [activeChart, setActiveChart] = useState("revenue");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    setDateRange({ start, end });
  }, []);

  useEffect(() => {
    if (!dateRange.start || !dateRange.end) return;
    const params = { params: { start: dateRange.start, end: dateRange.end } };

    Promise.all([
      axios.get(
        "http://127.0.0.1:8000/Catalogue_api/analytics/produk-terlaris/",
        params,
      ),
      axios.get(
        "http://127.0.0.1:8000/Catalogue_api/analytics/kategori/",
        params,
      ),
      axios.get(
        "http://127.0.0.1:8000/Catalogue_api/analytics/overview/",
        params,
      ),
      axios.get(
        "http://127.0.0.1:8000/Catalogue_api/analytics/product-multiline/",
        params,
      ),
      axios.get(
        "http://127.0.0.1:8000/Catalogue_api/analytics/pendapatan-terbanyak/",
        params,
      ),
    ])
      .then(([topRes, catRes, overRes, multiRes, grossRes]) => {
        setTopProducts(topRes.data?.[0] || null);
        setCategoryData(catRes.data || []);
        setSummary(overRes.data.summary || {});
        setProductData(overRes.data.produk || []);
        setMultiLineData(multiRes.data || []);
        setGrossingProducts(grossRes.data?.[0] || null);
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, [dateRange]);

  const exportData = () => {
    if (!chartData || chartData.length === 0) return;

    // 1. Tentukan Header (Tanggal, Total, dan tiap Produk)
    const headers = Object.keys(chartData[0]);

    // 2. Format baris data
    const csvRows = [
      headers.join(","), // Baris pertama (header)
      ...chartData.map((row) =>
        headers
          .map((fieldName) => JSON.stringify(row[fieldName] || 0))
          .join(","),
      ),
    ].join("\r\n");

    // 3. Buat file Blob dan download
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_export_${activeChart}_${dateRange.start}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { chartData, productKeys } = useMemo(
    () => formatMultiLineData(multiLineData),
    [multiLineData],
  );
  const productGrowthMetrics = useMemo(() => {
    if (!chartData || chartData.length < 2) return {};

    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    const metrics = {};

    const calculateProperGrowth = (start, end) => {
      // 1. Jika tetap 0, pertumbuhan adalah 0%
      if (start === 0 && end === 0) return 0;

      // 2. Jika dari 0 ke suatu angka (misal 0 ke 2):
      // Kita asumsikan start adalah 1 (atau langsung end * 100)
      // agar menghasilkan persentase (2/1 * 100 = 200%)
      if (start === 0 && end > 0) {
        return end * 100;
      }

      // 3. Rumus standar untuk start > 0
      // ((Akhir - Awal) / Awal) * 100
      const growth = ((end - start) / start) * 100;

      return isFinite(growth) ? growth : 0;
    };

    productKeys.forEach((key) => {
      const startRev = first[`${key}_revenue`] || 0;
      const endRev = last[`${key}_revenue`] || 0;

      // Pastikan key qty sesuai dengan data anda (_sales atau _qty)
      const startQty = first[`${key}_sales`] || first[`${key}_qty`] || 0;
      const endQty = last[`${key}_sales`] || last[`${key}_qty`] || 0;

      metrics[key] = {
        revGrowth: calculateProperGrowth(startRev, endRev),
        qtyGrowth: calculateProperGrowth(startQty, endQty),
      };
    });

    return metrics;
  }, [chartData, productKeys]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminDashboard />

      <div className="flex flex-col flex-1 ml-[250px] min-h-screen">
        <main className="flex-1 p-8 mt-20 space-y-8">
          {/* Section 1: Header */}
          <div className="flex justify-between items-end border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
              <p className="text-gray-500">
                Monitoring performance from {dateRange.start} to {dateRange.end}
              </p>
            </div>
            <DateRangeControls
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>

          {/* Section 2: Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`Rp ${summary.total_revenue?.toLocaleString() || 0}`}
            />
            <StatCard title="Total Orders" value={summary.total_orders || 0} />
            <StatCard
              title="Total Products"
              value={summary.total_products || 0}
            />
            <StatCard title="Active Users" value={summary.active_users || 0} />
          </div>

          {/* Section 3: Table */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Product Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b">
                    <th className="pb-3 font-medium">Product Name</th>
                    <th className="pb-3 font-medium text-center">
                      Revenue Growth
                    </th>
                    <th className="pb-3 font-medium text-center">
                      Unit Sales Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {productKeys.map((key) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-700">{key}</td>
                      <td className="py-4 text-center">
                        {renderGrowth(productGrowthMetrics[key]?.revGrowth)}
                      </td>
                      <td className="py-4 text-center">
                        {renderGrowth(productGrowthMetrics[key]?.qtyGrowth)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Charts & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Outer Card: Protects the grid layout */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                {/* Grup Kiri: Tombol-tombol Tab */}
                <div className="flex gap-2">
                  {["product", "revenue", "quantity"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        activeChart === type
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {type === "revenue"
                        ? "Tren Umum"
                        : type === "product"
                          ? "Detail Revenue"
                          : "Detail Penjualan"}
                    </button>
                  ))}
                </div>

                {/* Grup Kanan: Tombol Export (Otomatis ke kanan karena justify-between) */}
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>

              {/* Inner Chart Area: Ensure this has enough height to show the X-axis labels */}
              <div className="relative w-full min-h-[400px] h-[600px]">
                {activeChart === "product" && (
                  <ProductMultiLineChart data={chartData} />
                )}
                {activeChart === "quantity" && (
                  <ProductQuantityChart data={chartData} />
                )}
                {activeChart === "revenue" && (
                  <ProductRevenueChart data={productData} />
                )}
              </div>
            </div>

            {/* Category Distribution Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="font-semibold mb-6 text-gray-700">
                Category Distribution
              </h2>
              <div className="space-y-6">
                {categoryData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {item.kategori_terlaris}
                      </span>
                      <span className="font-bold text-gray-800">
                        {item.total_terjual}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${item.total_terjual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
