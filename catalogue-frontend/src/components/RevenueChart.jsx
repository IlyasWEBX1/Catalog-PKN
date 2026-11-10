import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ProductRevenueChart = ({ data = [] }) => {
  // Guarding: Jika data bukan array atau kosong
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-gray-500">
          Pilih rentang tanggal untuk melihat statistik produk
        </p>
      </div>
    );
  }

  const chartData = {
    // Sumbu X: Nama-nama produk
    labels: data.map((item) => item.nama_produk),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: data.map((item) => Number(item.total_revenue || 0)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        yAxisID: "y", // Menggunakan sumbu Y kiri
      },
      {
        label: "Unit Terjual",
        data: data.map((item) => item.total_terjual || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        yAxisID: "y1", // Menggunakan sumbu Y kanan agar skala tidak jomplang
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Revenue (Rp)" },
        ticks: {
          callback: (value) => "Rp " + value.toLocaleString(),
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Unit Terjual" },
        grid: { drawOnChartArea: false }, // Agar grid tidak tumpang tindih
      },
    },
  };

  return (
    <div className="h-[500px] bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="font-bold text-lg mb-4 text-gray-700">
        Performa Penjualan Per Produk
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProductRevenueChart;
