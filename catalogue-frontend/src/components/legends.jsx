const RenderLegend = ({ payload, hidden, setHidden }) => {
  return (
    <ul style={{ display: "flex", gap: 16, cursor: "pointer" }}>
      {payload.map((item) => {
        const key = item.dataKey;
        const isHidden = hidden[key];

        return (
          <li
            key={key}
            onClick={() =>
              setHidden(prev => ({
                ...prev,
                [key]: !prev[key],
              }))
            }
            style={{
              textDecoration: isHidden ? "line-through" : "none",
              opacity: isHidden ? 0.4 : 1,
              color: item.color,
            }}
          >
            ● {key}
          </li>
        );
      })}
    </ul>
  );
};

export default RenderLegend;
