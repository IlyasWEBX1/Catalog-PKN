import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data = [] }) => {
  // Guarding jika data kosong
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-center text-gray-500">Tidak ada data kategori</p>;
  }

  const chartData = {
    // Sesuai JSON: kategori_terlaris
    labels: data.map((item) => item.kategori_terlaris),
    datasets: [
      {
        label: "Total Unit Terjual",
        // Sesuai JSON: total_terjual
        data: data.map((item) => item.total_terjual),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // Biru untuk Panci
          "rgba(255, 99, 132, 0.7)", // Merah untuk Wajan
          "rgba(255, 206, 86, 0.7)", // Kuning (jika ada kategori lain)
          "rgba(75, 192, 192, 0.7)", // Hijau
        ],
        borderColor: [
          "#ffffff", // Putih agar ada celah antar potongan
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(1) + "%";
            return ` ${label}: ${value.toLocaleString()} unit (${percentage})`;
          },
        },
      },
    },
    elements: {
      arc: {
        angle: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const minAngle = 10; // Memberikan minimal 10 derajat agar terlihat
          return Math.max(minAngle, (value / total) * 360);
        },
      },
    },
  };

  return (
    <div className="h-[450px] bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h2 className="font-bold text-lg mb-4 text-gray-700 text-center">
        Proporsi Penjualan Kategori
      </h2>
      <div className="flex-grow">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryPieChart;
