import { Bar } from "react-chartjs-2"; // Gunakan Bar Chart lebih cocok untuk data ini
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ProductRevenueChart = ({ data }) => {
  // 1. Ambil array produk dari key "produk"
  const produkList = data?.produk || [];

  if (produkList.length === 0) {
    return <p className="text-center p-4">No product data available</p>;
  }

  const chartData = {
    // Menggunakan nama_produk sebagai label (Sumbu X)
    labels: produkList.map((item) => item.nama_produk),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: produkList.map((item) => Number(item.total_revenue)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Jumlah Terjual",
        data: produkList.map((item) => item.total_terjual),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "Rp " + value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="h-[400px] bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-bold text-lg mb-4">Revenue per Produk</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProductRevenueChart;
