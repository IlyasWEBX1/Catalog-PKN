import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale, // Tambahkan ini jika ingin skala waktu yang lebih akurat
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
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] border-2 border-dashed rounded-lg">
        <p className="text-gray-500">
          Tidak ada data transaksi pada rentang tanggal ini
        </p>
      </div>
    );
  }

  // MENGURUTKAN DATA BERDASARKAN TANGGAL (PENTING!)
  // Supaya garis chart tidak lompat-lompat jika data dari backend tidak urut
  const sortedData = [...data].sort(
    (a, b) => new Date(a.tanggal) - new Date(b.tanggal),
  );

  const chartData = {
    // UBAH: Gunakan tanggal sebagai label sumbu X
    labels: sortedData.map((item) => item.tanggal),
    datasets: [
      {
        label: "Total Revenue (Rp)",
        data: sortedData.map((item) => Number(item.total_revenue)),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
        pointRadius: 4,
        fill: true,
      },
      {
        label: "Total Qty Terjual",
        data: sortedData.map((item) => item.total_qty),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
        pointRadius: 4,
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
      x: {
        grid: { display: false },
        title: { display: true, text: "Tanggal Transaksi" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString("id-ID"),
        },
      },
    },
  };

  return (
    <div className="h-[500px] bg-white p-4 rounded-lg shadow border">
      <h2 className="font-semibold mb-4 text-gray-700">
        Tren Pendapatan & Penjualan Harian
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProductRevenueChart;
