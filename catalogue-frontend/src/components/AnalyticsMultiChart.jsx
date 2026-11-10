import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4F7CFF", "#39D98A", "#FF5C8A", "#F5C542"];

const AnalyticsMultiChart = ({ data }) => {
  if (!Array.isArray(data) || !data.length) return null;

  const productKeys = Object.keys(data[0]).filter(
    (k) =>
      ![
        "tanggal",
        "TotalRevenue",
        "TotalQty",
        "RevenuePercent",
        "QtyPercent",
      ].includes(k)
  );

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tanggal" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="TotalRevenue"
          stroke="#4F7CFF"
          strokeWidth={3}
          name="Total Revenue"
        />

        <Line
          type="monotone"
          dataKey="TotalQty"
          stroke="#39D98A"
          strokeWidth={3}
          name="Total Sold"
        />

        {productKeys.map((p, i) => (
          <Line
            key={p}
            type="monotone"
            dataKey={p}
            stroke={COLORS[i % COLORS.length]}
            strokeDasharray="5 5"
            name={p}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsMultiChart;
