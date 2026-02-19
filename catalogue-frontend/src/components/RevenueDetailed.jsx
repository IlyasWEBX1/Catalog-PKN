import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

// Menggunakan palet warna yang sama dengan Quantity Chart agar konsisten
const COLOR_PALETTE = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#6366f1", "#ec4899", "#8b5cf6", "#14b8a6",
];

const ProductMultiLineChart = ({ data }) => {
  const [hiddenKeys, setHiddenKeys] = useState([]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Tidak ada data pendapatan tersedia</p>
      </div>
    );
  }

  // Mengambil key yang berakhiran _revenue
  const productKeys = Object.keys(data[0]).filter((key) => 
    key.endsWith("_revenue")
  );

  const handleLegendClick = (e) => {
    const { dataKey } = e;
    setHiddenKeys(prev => 
      prev.includes(dataKey) ? prev.filter(k => k !== dataKey) : [...prev, dataKey]
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        
        <XAxis 
          dataKey="tanggal" 
          tick={{ fontSize: 12 }} 
          dy={10} 
        />
        
        <YAxis 
          tick={{ fontSize: 12 }} 
          tickFormatter={(value) => `Rp${value.toLocaleString()}`}
          label={{ value: 'Revenue', angle: -90, position: 'insideLeft', fontSize: 12, offset: -10 }}
        />
        
        <Tooltip 
          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          formatter={(value, name) => [`Rp ${value.toLocaleString()}`, name]}
        />
        
        <Legend 
          verticalAlign="top" 
          height={40} 
          onClick={handleLegendClick}
          wrapperStyle={{ cursor: 'pointer', userSelect: 'none', paddingBottom: '20px' }}
        />

        {/* Garis Total Revenue - Gaya Tebal (Hitam) */}
        <Line
          type="monotone"
          dataKey="total_revenue" // Menggunakan total_revenue sesuai struktur JSON Anda
          stroke="#1f2937"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Total Pendapatan"
          hide={hiddenKeys.includes("total_revenue")}
        />

        {/* Garis Produk Individual */}
        {productKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            strokeWidth={2}
            dot={false}
            // Membersihkan nama produk dari "_revenue" dan "_"
            name={key.replace("_revenue", "").replace("_", " ")}
            stroke={COLOR_PALETTE[index % COLOR_PALETTE.length]}
            hide={hiddenKeys.includes(key)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProductMultiLineChart;