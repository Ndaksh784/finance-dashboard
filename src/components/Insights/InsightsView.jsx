import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

import { useApp }                              from "../../context/AppContext";
import { THEME, CATEGORY_COLORS, CATEGORY_EMOJI } from "../../data/mockData";
import { calcMonthly, calcCategorySpend }      from "../../utils/helpers";
import { InsCard, LegDot, ChartTooltip }       from "../Common";

const { green: G, red: R, amber: A, blue: BL, card, border, text, muted } = THEME;

export default function InsightsView() {
  const { transactions, totalIncome, totalExpense } = useApp();

  const monthly  = useMemo(() => calcMonthly(transactions),       [transactions]);
  const catSpend = useMemo(() => calcCategorySpend(transactions), [transactions]);

  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : "0.0";

  const bestMonth = monthly.length
    ? monthly.reduce((best, m) => (m.net > best.net ? m : best), monthly[0])
    : null;

  return (
    <div className="anim-fade-up">
      {}
      <div
        className="ins-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}
      >
        <InsCard
          emoji="💰"
          label="Savings Rate"
          value={`${savingsRate}%`}
          color={G}
          sub="of total income saved"
        />
        <InsCard
          emoji="🏆"
          label="Top Expense"
          value={catSpend[0]?.name || "—"}
          color={A}
          sub={`$${catSpend[0]?.value.toLocaleString() || 0} total`}
        />
        <InsCard
          emoji="📈"
          label="Best Month"
          value={bestMonth?.month || "—"}
          color={BL}
          sub={bestMonth ? `+$${bestMonth.net.toLocaleString()} net` : "No data"}
        />
      </div>

      {}
      <div
        style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18, marginBottom: 14 }}
      >
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>Monthly Comparison</div>
        <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>
          Income vs Expenses by month
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={monthly} barGap={4} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: muted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="income"  fill={G} radius={[5, 5, 0, 0]} maxBarSize={36} />
            <Bar dataKey="expense" fill={R} radius={[5, 5, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 6, paddingLeft: 4 }}>
          <LegDot color={G} label="Income" />
          <LegDot color={R} label="Expense" />
        </div>
      </div>

      {}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Spending by Category</div>

        {catSpend.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: muted, fontSize: 13 }}>
            No expense data available
          </div>
        ) : (
          catSpend.map((cat, i) => (
            <CategoryBar
              key={cat.name}
              cat={cat}
              total={totalExpense}
              max={catSpend[0].value}
              isTop={i === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}


function CategoryBar({ cat, total, max, isTop }) {
  const pct     = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
  const barPct  = max  > 0 ? ((cat.value / max)   * 100).toFixed(1) : 0;
  const color   = CATEGORY_COLORS[cat.name] || "#94a3b8";

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 7,
        }}
      >
        {}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <span style={{ fontSize: 17 }}>{CATEGORY_EMOJI[cat.name] || "📦"}</span>
          <span style={{ fontWeight: 500 }}>{cat.name}</span>
          {isTop && (
            <span
              style={{
                fontSize: 9,
                background: "rgba(251,191,36,0.14)",
                color: "#fbbf24",
                padding: "1px 7px",
                borderRadius: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              TOP
            </span>
          )}
        </div>

        {}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>{pct}%</span>
          <span
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ${cat.value.toLocaleString()}
          </span>
        </div>
      </div>

      {}
      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: 4, height: 5, overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: color,
            borderRadius: 4,
            width: `${barPct}%`,
            transition: "width 0.7s ease",
          }}
        />
      </div>
    </div>
  );
}