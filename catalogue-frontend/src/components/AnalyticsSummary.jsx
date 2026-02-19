const AnalyticsSummary = ({ data }) => {
  if (!Array.isArray(data) || !data.length) return null;

  const last = data[data.length - 1];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-gray-500">Revenue Share</p>
        <p className="text-2xl font-bold text-blue-600">
          {last.RevenuePercent}%
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded">
        <p className="text-sm text-gray-500">Items Sold Share</p>
        <p className="text-2xl font-bold text-green-600">
          {last.QtyPercent}%
        </p>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
