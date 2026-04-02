export const formatCurrency = (n) =>
  `$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const calcMonthly = (txns) => {
  const map = {};

  txns.forEach((t) => {
    const d = new Date(t.date + "T00:00:00");
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const lbl = d.toLocaleDateString("en-US", { month: "short" });

    if (!map[key]) map[key] = { month: lbl, income: 0, expense: 0 };

    t.type === "income"
      ? (map[key].income += t.amount)
      : (map[key].expense += t.amount);
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ ...v, net: v.income - v.expense }));
};

export const calcCategorySpend = (txns) => {
  const map = {};

  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const nextId = (txns) =>
  txns.length ? Math.max(...txns.map((t) => t.id)) + 1 : 1;