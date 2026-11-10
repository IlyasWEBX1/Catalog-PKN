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

const ProductChart = ({ data = [], isMonthly = false }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">
          Belum ada data transaksi untuk grafik ini
        </p>
      </div>
    );
  }

  const chartData = {
    // Jika isMonthly true, pakai item.month. Jika false (global), pakai item.nama_produk
    labels: data.map((item) => (isMonthly ? item.month : item.nama_produk)),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: data.map((item) => Number(item.total_revenue || item.revenue)),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        pointRadius: 5,
        yAxisID: "y", // Sumbu Y kiri untuk Rupiah
      },
      {
        label: "Jumlah Terjual",
        data: data.map((item) => item.total_terjual || item.qty),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        pointRadius: 5,
        yAxisID: "y1", // Sumbu Y kanan untuk Quantity (biar tidak "tenggelam" karena angkanya kecil)
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        title: { display: true, text: "Revenue (Rp)" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false }, // Biar grid lines tidak tumpang tindih
        beginAtZero: true,
        title: { display: true, text: "Qty Terjual" },
      },
    },
  };

  return (
    <div className="h-[400px] w-full bg-white p-2 rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
};
export default ProductChart;
