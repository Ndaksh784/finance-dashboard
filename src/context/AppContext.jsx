import { createContext, useContext, useState, useMemo } from "react";
import { SEED_TRANSACTIONS } from "../data/mockData";
import { nextId } from "../utils/helpers";

export const AppContext = createContext(null);

/**
 * Custom hook – throws if used outside the provider so errors are clear.
 */
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Core data ──────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);

  // ── Role ───────────────────────────────────────────────────────────────────
  const [role, setRole] = useState("admin"); // "admin" | "viewer"

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "transactions" | "insights"

  // ── Filters / Sort (Transactions) ──────────────────────────────────────────
  const [search,  setSearch]  = useState("");
  const [fType,   setFType]   = useState("all");   // "all" | "income" | "expense"
  const [fCat,    setFCat]    = useState("all");
  const [sortBy,  setSortBy]  = useState("date");  // "date" | "amount"
  const [sortDir, setSortDir] = useState("desc");  // "asc"  | "desc"

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [modal, setModal] = useState(null);
  // shape: { mode: "add" | "edit", data: { ...transaction } }

  // ── Mobile sidebar ─────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Derived totals ─────────────────────────────────────────────────────────
  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const netBalance = totalIncome - totalExpense;

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const saveTransaction = (txn) => {
    if (txn.id) {
      // Edit
      setTransactions((prev) => prev.map((t) => (t.id === txn.id ? txn : t)));
    } else {
      // Add
      setTransactions((prev) => [{ ...txn, id: nextId(prev) }, ...prev]);
    }
    setModal(null);
  };

  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const openAddModal = () =>
    setModal({
      mode: "add",
      data: { date: "", description: "", amount: "", type: "expense", category: "Food" },
    });

  const openEditModal = (txn) =>
    setModal({ mode: "edit", data: { ...txn } });

  // ── Toggle sort ────────────────────────────────────────────────────────────
  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  // ── Value ──────────────────────────────────────────────────────────────────
  const value = {
    // Data
    transactions,
    totalIncome,
    totalExpense,
    netBalance,

    // Role
    role,
    setRole,

    // Navigation
    activeTab,
    setActiveTab,

    // Filters
    search,  setSearch,
    fType,   setFType,
    fCat,    setFCat,
    sortBy,  sortDir,
    toggleSort,

    // Modal
    modal,
    setModal,
    openAddModal,
    openEditModal,

    // Sidebar
    sidebarOpen,
    setSidebarOpen,

    // Actions
    saveTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}