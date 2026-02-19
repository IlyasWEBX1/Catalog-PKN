const formatChartData = (rawData) => {
  if (!Array.isArray(rawData) || !rawData.length) return [];

  const totalRevenueAll = rawData.reduce(
    (sum, d) => sum + Number(d.total_revenue || 0),
    0
  );

  const totalQtyAll = rawData.reduce(
    (sum, d) => sum + Number(d.total_qty || 0),
    0
  );

  return rawData.map((row) => {
    const entry = {
      tanggal: row.tanggal,
      TotalRevenue: Number(row.total_revenue || 0),
      TotalQty: Number(row.total_qty || 0),
      RevenuePercent: totalRevenueAll
        ? ((row.total_revenue / totalRevenueAll) * 100).toFixed(1)
        : 0,
      QtyPercent: totalQtyAll
        ? ((row.total_qty / totalQtyAll) * 100).toFixed(1)
        : 0,
    };

    if (row.products) {
      Object.entries(row.products).forEach(([name, p]) => {
        entry[name] = Number(p.revenue || 0);
      });
    }

    return entry;
  });
};

export default formatChartData;
