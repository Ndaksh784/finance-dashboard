import { createContext, useContext, useState, useMemo } from "react";
import { SEED_TRANSACTIONS } from "../data/mockData";
import { nextId } from "../utils/helpers";

export const AppContext = createContext(null);


export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);

  const [role, setRole] = useState("admin");

  const [activeTab, setActiveTab] = useState("dashboard"); 

  const [search,  setSearch]  = useState("");
  const [fType,   setFType]   = useState("all");   
  const [fCat,    setFCat]    = useState("all");
  const [sortBy,  setSortBy]  = useState("date");  
  const [sortDir, setSortDir] = useState("desc");  


  const [modal, setModal] = useState(null);
 
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const netBalance = totalIncome - totalExpense;

  const saveTransaction = (txn) => {
    if (txn.id) {
      setTransactions((prev) => prev.map((t) => (t.id === txn.id ? txn : t)));
    } else {
      
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

  
  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const value = {
    
    transactions,
    totalIncome,
    totalExpense,
    netBalance,

    
    role,
    setRole,

    
    activeTab,
    setActiveTab,

    search,  setSearch,
    fType,   setFType,
    fCat,    setFCat,
    sortBy,  sortDir,
    toggleSort,

    
    modal,
    setModal,
    openAddModal,
    openEditModal,

    sidebarOpen,
    setSidebarOpen,

    saveTransaction,
    deleteTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}