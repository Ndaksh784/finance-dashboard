import { Menu }             from "lucide-react";
import { useApp }           from "../context/AppContext";
import { Sidebar, MobileSidebar } from "../components/Sidebar";
import { DashView }         from "../components/Dashboard";
import { TxnView, TxnModal }from "../components/Transactions";
import { InsightsView }     from "../components/Insights";
import { THEME }            from "../data/mockData";

const { amber: A, blue: BL, surf, border, muted } = THEME;

const TAB_LABELS = {
  dashboard:    "Overview 📊",
  transactions: "Transactions 💳",
  insights:     "Insights 🔍",
};

export default function DashboardPage() {
  const { activeTab, role, modal, setSidebarOpen } = useApp();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* Sidebar */ }
      <Sidebar />

      {/* Mobile Sidebar */ }
      <MobileSidebar />

      {/* Main Content Area */ }
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        { /* Header */ }
        <header
          style={{
            padding: "13px 20px",
            borderBottom: `1px solid ${border}`,
            background: surf,
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0, zIndex: 10,
          }}
        >
          {/* Hamburger Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              id="hamburger"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "none", border: "none",
                color: muted, cursor: "pointer",
                display: "none", padding: 2,
              }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.03em" }}>
              {TAB_LABELS[activeTab]}
            </span>
          </div>

          {/* Role Badge */}
          <div
            style={{
              background: role === "admin"
                ? "rgba(251,191,36,0.13)"
                : "rgba(96,165,250,0.13)",
              color: role === "admin" ? A : BL,
              padding: "3px 11px", borderRadius: 20,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
            }}
          >
            {role === "admin" ? "👑 ADMIN" : "👁 VIEWER"}
          </div>
        </header>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: "18px 20px" }}>
          {activeTab === "dashboard"    && <DashView />}
          {activeTab === "transactions" && <TxnView />}
          {activeTab === "insights"     && <InsightsView />}
        </div>
      </div>

      {/* Transaction Modal */}
      {modal && <TxnModal />}
    </div>
  );
}