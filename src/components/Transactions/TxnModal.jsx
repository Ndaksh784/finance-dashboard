import { useState }        from "react";
import { X }              from "lucide-react";
import { useApp }         from "../../context/AppContext";
import { THEME, CATEGORIES, CATEGORY_EMOJI } from "../../data/mockData";

const { green: G, text, muted, border } = THEME;

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: text,
  borderRadius: 9,
  padding: "9px 12px",
  fontSize: 13,
  outline: "none",
  width: "100%",
};

const labelStyle = {
  fontSize: 10,
  color: muted,
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: 5,
  display: "block",
};

export default function TxnModal() {
  const { modal, setModal, saveTransaction } = useApp();
  const [form, setForm] = useState(modal.data);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (!form.date || !form.description || !form.amount) return;
    saveTransaction({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
        zIndex: 100, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20,
      }}
    >
      <div
        className="anim-scale-in"
        style={{
          background: "#0f1420",
          border: `1px solid rgba(255,255,255,0.1)`,
          borderRadius: 18, padding: 26,
          width: "100%", maxWidth: 400,
        }}
      >
        { Header }
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.03em" }}>
            {modal.mode === "add" ? "✨ Add Transaction" : "✏️ Edit Transaction"}
          </span>
          <button
            onClick={() => setModal(null)}
            style={{
              background: "rgba(255,255,255,0.06)", border: "none",
              color: "#94a3b8", cursor: "pointer", borderRadius: 8,
              padding: "6px 7px", display: "flex",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {/* Date */}
          <div>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Grocery Shopping"
              style={inputStyle}
            />
          </div>

          {/* Amount & Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Amount ($)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} style={inputStyle}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} style={inputStyle}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_EMOJI[c] || "📦"} {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={() => setModal(null)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8", cursor: "pointer",
              borderRadius: 10, padding: 10,
              fontFamily: "inherit", fontSize: 13, fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1.4,
              background: G, color: "#030d09",
              fontWeight: 700, border: "none",
              cursor: "pointer", borderRadius: 10,
              padding: 10, fontFamily: "inherit", fontSize: 13,
            }}
          >
            {modal.mode === "add" ? "Add Transaction" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}