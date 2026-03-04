import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // Tambahkan ini untuk titik
  LineElement, // Tambahkan ini untuk garis
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen Line
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const ProductRevenueChart = ({ data = [] }) => {
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
    labels: data.map((item) => item.nama_produk),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: data.map((item) => Number(item.total_revenue || 0)),
        borderColor: "rgb(54, 162, 235)", // Warna garis biru
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Warna titik
        tension: 0.4, // Membuat garis sedikit melengkung (smooth)
        pointRadius: 5,
        yAxisID: "y",
      },
      {
        label: "Unit Terjual",
        data: data.map((item) => item.total_terjual || 0),
        borderColor: "rgb(255, 99, 132)", // Warna garis merah
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
        pointRadius: 5,
        yAxisID: "y1",
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
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="h-[500px] bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="font-bold text-lg mb-4 text-gray-700">
        Tren Performa Per Produk
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProductRevenueChart;
