const formatMultiLineData = (rawData = []) => {
  // 🛑 Guard clause
  if (!Array.isArray(rawData)) {
    return {
      chartData: [],
      productKeys: [],
    };
  }

  const productSet = new Set();

  // 1️⃣ kumpulin semua nama produk
  rawData.forEach((item) => {
    if (!item || typeof item !== "object") return;
    if (!item.products) return;

    Object.keys(item.products).forEach((productName) => {
      productSet.add(productName);
    });
  });

  const productKeys = Array.from(productSet);

  // 2️⃣ flatten per tanggal (AMAN)
  const chartData = rawData.map((item) => {
    const row = {
      tanggal: item.tanggal,
      total_revenue: Number(item.total_revenue) || 0,
      total_qty: Number(item.total_qty) || 0,
    };

    productKeys.forEach((product) => {
      const productData = item.products?.[product];

      row[`${product}_revenue`] = productData
        ? Number(productData.revenue) || 0
        : 0;

      row[`${product}_sales`] = productData
        ? Number(productData.qty) || 0
        : 0;
    });

    return row;
  });
  console.log("Formatted Multi-Line Chart Data:", { chartData, productKeys });
  return { chartData, productKeys };
};

export default formatMultiLineData;
