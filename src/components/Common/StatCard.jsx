import { THEME } from "../../data/mockData";

const { card, border, muted } = THEME;

export default function StatCard({ label, value, color, icon }) {
  return (
    <div
      style={{
        background: card,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: muted,
            fontWeight: 600,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 20,
          fontWeight: 700,
          color,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
    </div>
  );
}