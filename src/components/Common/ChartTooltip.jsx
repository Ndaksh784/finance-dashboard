import { THEME } from "../../data/mockData";

/** Shared Recharts tooltip for area / bar charts. */
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#151c2c",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: THEME.text }}>
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{
            color: p.color || p.fill,
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <span style={{ textTransform: "capitalize", color: THEME.muted }}>
            {p.dataKey}:
          </span>
          <span style={{ fontFamily: "monospace" }}>
            ${p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Pie-chart specific tooltip. */
export function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      style={{
        background: "#151c2c",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
      }}
    >
      <span style={{ color: "#94a3b8" }}>{p.name}: </span>
      <span style={{ fontFamily: "monospace" }}>${p.value?.toLocaleString()}</span>
    </div>
  );
}