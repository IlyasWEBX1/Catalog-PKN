import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ProductRevenueChart = ({ data = [] }) => {
  // HARD GUARD (ini yang nyelametin kamu dari map undefined)

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500">No product data available</p>;
  }

  const chartData = {
    labels: data.map(item => item.nama_produk),
    datasets: [
      {
        label: "Revenue (Rp)",
        data: data.map(item => Number(item.total_revenue)),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        pointRadius: 5,
      },
      {
        label: "Jumlah Terjual",
        data: data.map(item => item.total_terjual),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        pointRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="h-[500px] bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-4">
        Revenue & Sales per Product
      </h2>
      <Line data={chartData} options={options} />

    </div>
  );
};

export default ProductRevenueChart;
