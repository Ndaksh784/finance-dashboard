import { THEME } from "../../data/mockData";

const { card, border, muted } = THEME;

export default function InsCard({ emoji, label, value, color, sub }) {
  return (
    <div
      style={{
        background: card,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 10 }}>{emoji}</div>

      <div
        style={{
          fontSize: 10,
          color: muted,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 19,
          fontWeight: 700,
          color,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "-0.02em",
          marginBottom: 4,
        }}
      >
        {value}
      </div>

      <div style={{ fontSize: 11, color: muted }}>{sub}</div>
    </div>
  );
}