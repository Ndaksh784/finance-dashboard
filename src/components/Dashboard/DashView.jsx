import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { useApp }                    from "../../context/AppContext";
import { THEME, CATEGORY_COLORS, CATEGORY_EMOJI } from "../../data/mockData";
import { calcMonthly, calcCategorySpend, formatCurrency, formatDate } from "../../utils/helpers";
import { StatCard, LegDot, ChartTooltip, PieTooltip } from "../Common";

const { green: G, red: R, blue: BL, card, border, text, muted } = THEME;

export default function DashView() {
  const { transactions, totalIncome, totalExpense, netBalance } = useApp();

  const monthly  = useMemo(() => calcMonthly(transactions),         [transactions]);
  const catSpend = useMemo(() => calcCategorySpend(transactions),   [transactions]);

  const balanceLabel =
    netBalance >= 0
      ? `+${formatCurrency(netBalance)}`
      : `-${formatCurrency(netBalance)}`;

  return (
    <div className="anim-fade-up">
      {/* Summary Cards */ }
      <div
        className="stat-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}
      >
        <StatCard label="Net Balance"    value={balanceLabel}             color={netBalance >= 0 ? G : R} icon={<Wallet size={15} />} />
        <StatCard label="Total Income"   value={formatCurrency(totalIncome)}   color={BL} icon={<ArrowUpRight size={15} />} />
        <StatCard label="Total Expenses" value={`-${formatCurrency(totalExpense)}`} color={R}  icon={<ArrowDownRight size={15} />} />
      </div>

      {/* Monthly Trend & Category Breakdown */ }
      <div
        className="chart-grid"
        style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12, marginBottom: 14 }}
      >
        {/* Monthly Trend */ }
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>Monthly Trend</div>
          <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>Income vs Expenses</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={G} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={G} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={R} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={R} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="income"  stroke={G} strokeWidth={2} fill="url(#gI)" />
              <Area type="monotone" dataKey="expense" stroke={R} strokeWidth={2} fill="url(#gE)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 6, paddingLeft: 4 }}>
            <LegDot color={G} label="Income" />
            <LegDot color={R} label="Expense" />
          </div>
        </div>

        {/* Spending Breakdown */ }
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>Spending Breakdown</div>
          <div style={{ fontSize: 11, color: muted, marginBottom: 8 }}>By category</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={catSpend} cx="50%" cy="50%" innerRadius={32} outerRadius={58} paddingAngle={3} dataKey="value">
                {catSpend.map((e) => (
                  <Cell key={e.name} fill={CATEGORY_COLORS[e.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
            {catSpend.slice(0, 4).map((e) => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: CATEGORY_COLORS[e.name] || "#94a3b8", flexShrink: 0 }} />
                  <span style={{ color: "#94a3b8" }}>{e.name}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono',monospace", color: text }}>${e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */ }
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Recent Transactions</div>
        {transactions.slice(0, 6).map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `${CATEGORY_COLORS[t.category] || "#94a3b8"}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, flexShrink: 0,
                }}
              >
                {CATEGORY_EMOJI[t.category] || "📦"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t.description}</div>
                <div style={{ fontSize: 10, color: muted, marginTop: 1 }}>
                  {formatDate(t.date)} · {t.category}
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontWeight: 600,
                color: t.type === "income" ? G : R,
                fontSize: 13,
                flexShrink: 0,
                marginLeft: 12,
              }}
            >
              {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}