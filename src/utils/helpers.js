/**
 * Format a number as a dollar amount (absolute value).
 * @param {number} n
 * @returns {string}  e.g.  "$1,234.56"
 */
export const formatCurrency = (n) =>
  `$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Format an ISO date string (YYYY-MM-DD) to a readable label.
 * @param {string} d
 * @returns {string}  e.g.  "Apr 2, 2025"
 */
export const formatDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Aggregate transactions into monthly income / expense / net totals,
 * sorted chronologically.
 * @param {Array} txns
 * @returns {Array<{month, income, expense, net}>}
 */
export const calcMonthly = (txns) => {
  const map = {};

  txns.forEach((t) => {
    const d   = new Date(t.date + "T00:00:00");
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const lbl = d.toLocaleDateString("en-US", { month: "short" });

    if (!map[key]) map[key] = { month: lbl, income: 0, expense: 0 };
    t.type === "income"
      ? (map[key].income  += t.amount)
      : (map[key].expense += t.amount);
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ ...v, net: v.income - v.expense }));
};

/**
 * Sum expenses per category, sorted descending by total.
 * @param {Array} txns
 * @returns {Array<{name, value}>}
 */
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

/**
 * Generate a unique numeric id that is one above the current max.
 * @param {Array} txns
 * @returns {number}
 */
export const nextId = (txns) =>
  txns.length ? Math.max(...txns.map((t) => t.id)) + 1 : 1;