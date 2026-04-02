import { X, Wallet, LayoutDashboard, Receipt, Lightbulb } from "lucide-react";
import { useApp }    from "../../context/AppContext";
import { THEME }     from "../../data/mockData";
import { formatCurrency } from "../../utils/helpers";

const { green: G, amber: A, blue: BL, surf, border, text, muted } = THEME;

const NAV_ITEMS = [
  { id: "dashboard",    icon: <LayoutDashboard size={15} />, label: "Dashboard" },
  { id: "transactions", icon: <Receipt size={15} />,         label: "Transactions" },
  { id: "insights",     icon: <Lightbulb size={15} />,       label: "Insights" },
];


export function Sidebar() {
  const { setActiveTab } = useApp();

  return (
    <aside
      id="sidebar"
      style={{
        width: 210, minWidth: 210,
        background: surf,
        borderRight: `1px solid ${border}`,
        display: "flex", flexDirection: "column",
        padding: "20px 12px", gap: 4,
        height: "100vh", flexShrink: 0,
      }}
    >
      <SidebarContent onNavigate={setActiveTab} />
    </aside>
  );
}

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen, setActiveTab } = useApp();

  const navigate = (tab) => { setActiveTab(tab); setSidebarOpen(false); };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)",
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed", left: 0, top: 0,
          width: 240, background: surf,
          borderRight: `1px solid ${border}`,
          display: "flex", flexDirection: "column",
          padding: "20px 12px", gap: 4,
          height: "100vh", zIndex: 50,
        }}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "absolute", top: 14, right: 14,
            background: "none", border: "none",
            color: muted, cursor: "pointer", padding: 4,
          }}
        >
          <X size={17} />
        </button>
        <SidebarContent onNavigate={navigate} />
      </aside>
    </>
  );
}

function SidebarContent({ onNavigate }) {
  const { activeTab, role, setRole, netBalance } = useApp();

  return (
    <>
      {/* Brand */}
      <div
        style={{
          display: "flex", alignItems: "center",
          gap: 9, marginBottom: 22, paddingLeft: 4,
        }}
      >
        <div
          style={{
            width: 30, height: 30, borderRadius: 9,
            background: "rgba(16,217,160,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Wallet size={15} color={G} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.04em" }}>
          FinTrack
        </span>
      </div>

      {/* Navigation */}
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "9px 10px", borderRadius: 10,
            border: "none", fontFamily: "inherit",
            fontSize: 13, fontWeight: 500,
            cursor: "pointer", textAlign: "left", width: "100%",
            background: activeTab === item.id ? "rgba(16,217,160,0.1)" : "transparent",
            color:      activeTab === item.id ? G : muted,
            transition: "all 0.15s",
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Net Balance */}   
      <div
        style={{
          background: "rgba(16,217,160,0.06)",
          border: "1px solid rgba(16,217,160,0.14)",
          borderRadius: 13, padding: "13px 14px", marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 10, color: muted, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5,
          }}
        >
          Net Balance
        </div>
        <div
          style={{
            fontSize: 20, fontWeight: 700, color: G,
            fontFamily: "'DM Mono',monospace", letterSpacing: "-0.03em",
          }}
        >
          {netBalance >= 0 ? "" : "-"}{formatCurrency(netBalance)}
        </div>
      </div>

      {/* Role Switcher */}
      <div>
        <div
          style={{
            fontSize: 10, color: muted, fontWeight: 600,
            marginBottom: 6, paddingLeft: 2,
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}
        >
          Switch Role
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${border}`,
            color: text, borderRadius: 9,
            padding: "8px 10px", fontSize: 13, width: "100%", cursor: "pointer",
          }}
        >
          <option value="admin">👑 Admin</option>
          <option value="viewer">👁 Viewer</option>
        </select>

        <div style={{ fontSize: 11, color: muted, marginTop: 6, paddingLeft: 2 }}>
          {role === "admin" ? "Can add, edit & delete" : "View only access"}
        </div>
      </div>
    </>
  );
}