import { useMemo }          from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

import { useApp }                    from "../../context/AppContext";
import { THEME, CATEGORIES, CATEGORY_COLORS } from "../../data/mockData";
import { formatDate }                from "../../utils/helpers";
import { SortBtn }                   from "../Common";

const { green: G, red: R, blue: BL, card, border, text, muted } = THEME;

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${border}`,
  color: text,
  borderRadius: 9,
  padding: "8px 11px",
  fontSize: 13,
  outline: "none",
};

export default function TxnView() {
  const {
    transactions, role,
    search, setSearch,
    fType, setFType,
    fCat,  setFCat,
    sortBy, sortDir, toggleSort,
    openAddModal, openEditModal,
    deleteTransaction,
  } = useApp();

  // ── Filtered + sorted list ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions
      .filter((t) => {
        if (fType !== "all" && t.type     !== fType) return false;
        if (fCat  !== "all" && t.category !== fCat)  return false;
        if (q && !t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q))
          return false;
        return true;
      })
      .sort((a, b) => {
        const d = sortDir === "desc" ? -1 : 1;
        if (sortBy === "date")   return d * b.date.localeCompare(a.date);
        if (sortBy === "amount") return d * (b.amount - a.amount);
        return 0;
      });
  }, [transactions, fType, fCat, search, sortBy, sortDir]);

  const adminSuffix = role === "admin" ? " 64px" : "";
  const gridCols    = `110px 1fr 90px 70px 90px${adminSuffix}`;

  return (
    <div className="anim-fade-up">
      {/* ── Filter bar ───────────────────────────────── */}
      <div
        style={{
          display: "flex", gap: 9, marginBottom: 14,
          flexWrap: "wrap", alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 150 }}>
          <Search
            size={13}
            style={{
              position: "absolute", left: 10, top: "50%",
              transform: "translateY(-50%)", color: muted, pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions…"
            style={{ ...inputStyle, paddingLeft: 30, width: "100%" }}
          />
        </div>

        {/* Type filter */}
        <select value={fType} onChange={(e) => setFType(e.target.value)} style={inputStyle}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select value={fCat} onChange={(e) => setFCat(e.target.value)} style={inputStyle}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Add button (admin only) */}
        {role === "admin" && (
          <button
            onClick={openAddModal}
            style={{
              background: G, color: "#030d09", fontWeight: 700,
              border: "none", cursor: "pointer", borderRadius: 9,
              padding: "8px 14px", fontSize: 13,
              display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
        {/* Header */}
        <div
          className="txn-grid"
          style={{
            display: "grid", gridTemplateColumns: gridCols,
            padding: "10px 16px", borderBottom: `1px solid ${border}`,
            fontSize: 10, fontWeight: 700, color: muted,
            letterSpacing: "0.06em", textTransform: "uppercase", alignItems: "center",
          }}
        >
          <SortBtn col="date"   label="Date"   cur={sortBy} dir={sortDir} onClick={toggleSort} />
          <span>Description</span>
          <span className="txn-col-cat">Category</span>
          <span className="txn-col-type">Type</span>
          <SortBtn col="amount" label="Amount" cur={sortBy} dir={sortDir} onClick={toggleSort} />
          {role === "admin" && <span>Actions</span>}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((t) => (
            <TxnRow
              key={t.id}
              txn={t}
              gridCols={gridCols}
              isAdmin={role === "admin"}
              onEdit={() => openEditModal(t)}
              onDelete={() => deleteTransaction(t.id)}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: muted, textAlign: "right" }}>
        Showing {filtered.length} of {transactions.length} transactions
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TxnRow({ txn, gridCols, isAdmin, onEdit, onDelete }) {
  const { date, description, category, type, amount } = txn;
  const color = type === "income" ? G : R;

  return (
    <div
      className="txn-grid row-hover"
      style={{
        display: "grid", gridTemplateColumns: gridCols,
        padding: "11px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        fontSize: 12, alignItems: "center", transition: "background 0.12s",
      }}
    >
      <span style={{ color: "#94a3b8", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
        {formatDate(date)}
      </span>
      <span style={{ fontWeight: 500, paddingRight: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {description}
      </span>
      <span className="txn-col-cat">
        <Badge text={category} color={CATEGORY_COLORS[category] || "#94a3b8"} />
      </span>
      <span className="txn-col-type">
        <Badge text={type} color={color} />
      </span>
      <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 600, color, fontSize: 13 }}>
        {type === "income" ? "+" : "-"}${amount.toLocaleString()}
      </span>
      {isAdmin && (
        <span style={{ display: "flex", gap: 5 }}>
          <ActionBtn onClick={onEdit}   color={BL} bg="rgba(96,165,250,0.1)"><Edit2  size={11} /></ActionBtn>
          <ActionBtn onClick={onDelete} color={R}  bg="rgba(248,113,113,0.1)"><Trash2 size={11} /></ActionBtn>
        </span>
      )}
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span
      style={{
        background: `${color}18`, color,
        padding: "2px 8px", borderRadius: 20,
        fontSize: 10, fontWeight: 600, textTransform: "capitalize",
      }}
    >
      {text}
    </span>
  );
}

function ActionBtn({ onClick, color, bg, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg, border: "none", color, cursor: "pointer",
        borderRadius: 6, padding: "5px 6px", display: "flex", alignItems: "center",
      }}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: muted }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>No transactions found</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your filters</div>
    </div>
  );
}