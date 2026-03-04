import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const ProductRevenueChart = ({ data = [] }) => {
  // Guard untuk data kosong atau bukan array
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500">
          No trend data available for selected period
        </p>
      </div>
    );
  }

  // 1. Urutkan data secara kronologis
  const sortedData = [...data].sort(
    (a, b) => new Date(a.tanggal) - new Date(b.tanggal),
  );

  // 2. Ambil label tanggal (Sumbu X)
  const labels = sortedData.map((item) => item?.tanggal || "N/A");

  // 3. Ekstrak daftar produk unik dengan proteksi Object.keys
  const allProductNames = new Set();
  sortedData.forEach((item) => {
    // Cek apakah item dan item.products benar-benar ada sebelum di-loop
    if (item?.products && typeof item.products === "object") {
      Object.keys(item.products).forEach((name) => {
        if (name) allProductNames.add(name);
      });
    }
  });

  // 4. Buat Dataset untuk setiap produk
  const colors = [
    { border: "rgb(54, 162, 235)", bg: "rgba(54, 162, 235, 0.2)" },
    { border: "rgb(255, 99, 132)", bg: "rgba(255, 99, 132, 0.2)" },
    { border: "rgb(75, 192, 192)", bg: "rgba(75, 192, 192, 0.2)" },
    { border: "rgb(255, 205, 86)", bg: "rgba(255, 205, 86, 0.2)" },
  ];

  const datasets = Array.from(allProductNames).map((productName, index) => {
    const color = colors[index % colors.length];
    return {
      label: productName,
      // Menggunakan ?. untuk akses aman ke properti revenue
      data: sortedData.map((item) =>
        Number(item?.products?.[productName]?.revenue || 0),
      ),
      borderColor: color.border,
      backgroundColor: color.bg,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Tanggal Transaksi" },
        ticks: { maxTicksLimit: 12 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Revenue (Rp)" },
        ticks: {
          callback: (value) => "Rp " + value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="h-[500px] bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-bold text-lg mb-4 text-gray-800">
        Trend Penjualan Produk (Historical)
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProductRevenueChart;
