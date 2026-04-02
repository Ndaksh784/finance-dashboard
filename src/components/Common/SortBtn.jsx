import { ChevronUp, ChevronDown } from "lucide-react";
import { THEME } from "../../data/mockData";

export default function SortBtn({ col, label, cur, dir, onClick }) {
  const active = cur === col;
  return (
    <button
      onClick={() => onClick(col)}
      style={{
        background: "none",
        border: "none",
        color: active ? THEME.green : THEME.muted,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: 3,
        padding: 0,
      }}
    >
      {label}
      <span style={{ opacity: active ? 1 : 0.3 }}>
        {dir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
      </span>
    </button>
  );
}