# FinTrack — Finance Dashboard

> A clean, interactive personal finance dashboard built as part of a frontend engineering assessment.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Role Based Access](#role-based-access)
- [State Management](#state-management)
- [Design Decisions](#design-decisions)
- [Responsive Design](#responsive-design)
- [Screenshots](#screenshots)

---

## Overview

FinTrack is a frontend-only finance dashboard that lets users track income, expenses, and spending patterns at a glance. Built with React and Context API, it simulates real-world features like role-based access control, live filtering, data visualization, and CRUD operations — all without a backend.

The goal was to build something that feels polished and production-ready while keeping the codebase clean, modular, and easy to reason about.

---

## Live Demo

> > **Deployed Link:** [View Live App](https://finance-dashboard-y3c2-fjijd1xkp-ndaksh784s-projects.vercel.app)
>
> **Repository:** https://github.com/Ndaksh784/finance-dashboard

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, component model, excellent DX |
| Styling | Tailwind CSS v4 + Custom CSS | Utility classes for layout, custom CSS for animations and theme |
| State Management | Context API + useState | Lightweight, no boilerplate, right-sized for this scope |
| Charts | Recharts | React-native API, composable, handles all chart types needed |
| Icons | Lucide React | Tree-shakeable, clean consistent stroke style |
| Fonts | Sora + DM Mono | Sora for UI text, DM Mono for financial numbers |

**Why not Redux?** — The app has one data source (transactions) with a handful of derived states. Context API with `useMemo` handles this cleanly without the overhead of Redux boilerplate.

**Why not a UI library like MUI or Chakra?** — Full design control was a priority. Tailwind + custom styles gave complete flexibility to build a distinctive dark-themed dashboard without fighting component defaults.

---

## Features

### Dashboard Overview
- KPI summary cards — Net Balance, Total Income, Total Expenses
- Area chart showing monthly income vs expense trends with gradient fills
- Donut pie chart showing spending breakdown by category
- Recent transactions list (latest 6 entries)

### Transactions
- Complete transaction table with date, description, category, type, and amount
- **Live search** — filter by description or category as you type
- **Type filter** — All / Income / Expense
- **Category filter** — 10 categories including Food, Transport, Salary, Freelance, and more
- **Column sorting** — sort by date or amount, toggle ascending / descending
- Empty state handled gracefully with a friendly message
- **Add / Edit / Delete** (Admin role only) via a clean modal form

### Insights
- Savings rate card showing percentage of income saved
- Top spending category with total spent
- Best performing month by net income
- Monthly comparison bar chart (Income vs Expenses side by side)
- Category breakdown with animated progress bars and percentage share

### Role-Based UI (RBAC Simulation)
- Switch between **Admin** and **Viewer** roles via sidebar dropdown
- UI adapts instantly — no page reload required
- Full access control table in the [Role Based Access](#role-based-access) section

---

## Project Structure

```
finance-dashboard/
│
├── index.html
├── vite.config.js
├── package.json
├── README.md
│
└── src/
    ├── App.jsx                              # Root: wraps AppProvider → DashboardPage
    ├── main.jsx                             # ReactDOM entry point
    ├── index.css                            # Global reset, Tailwind import, animations, responsive
    │
    ├── data/
    │   └── mockData.js                      # 36 seed transactions, theme colours, category metadata
    │
    ├── utils/
    │   └── helpers.js                       # Pure functions: formatCurrency, formatDate, calcMonthly, calcCategorySpend
    │
    ├── context/
    │   └── AppContext.jsx                   # Global state, CRUD actions, filters, role, modal
    │
    ├── pages/
    │   └── Dashboard.jsx                    # Page layout: topbar + tab routing + modal mount point
    │
    └── components/
        │
        ├── Common/                          # Reusable UI atoms
        │   ├── StatCard.jsx                 # KPI summary card
        │   ├── LegDot.jsx                   # Chart legend dot
        │   ├── ChartTooltip.jsx             # Shared Recharts tooltip (area/bar + pie variants)
        │   ├── InsCard.jsx                  # Insight summary card
        │   ├── SortBtn.jsx                  # Sortable column header button
        │   └── index.js                     # Barrel export
        │
        ├── Dashboard/
        │   ├── DashView.jsx                 # Overview tab (stat cards + charts + recent txns)
        │   └── index.js
        │
        ├── Transactions/
        │   ├── TxnView.jsx                  # Filterable, sortable transaction table
        │   ├── TxnModal.jsx                 # Add / Edit transaction modal
        │   └── index.js
        │
        ├── Insights/
        │   ├── InsightsView.jsx             # Bar chart + category breakdown with progress bars
        │   └── index.js
        │
        └── Sidebar/
            ├── Sidebar.jsx                  # Desktop sidebar + mobile overlay drawer
            └── index.js
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finance-dashboard.git

# 2. Move into the project directory
cd finance-dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Role Based Access

Roles are simulated entirely on the frontend. Switch between them using the dropdown at the bottom of the sidebar. No login required — this demonstrates how UI behavior adapts based on role state.

| Feature | 👑 Admin | 👁 Viewer |
|---|:---:|:---:|
| View dashboard overview | ✅ | ✅ |
| View transaction list | ✅ | ✅ |
| Search and filter transactions | ✅ | ✅ |
| View insights and charts | ✅ | ✅ |
| Add new transaction | ✅ | ❌ |
| Edit existing transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |

When in **Viewer** mode, the Add button and all Edit / Delete row actions are completely removed from the DOM — not just hidden with CSS — so the restriction is enforced at the render level.

---

## State Management

All application state is centralised in `src/context/AppContext.jsx` using React's built-in Context API. A custom `useApp()` hook provides clean access to state and actions from any component without prop drilling.

### State Shape

| State | Type | Purpose |
|---|---|---|
| `transactions` | `array` | Single source of truth for all transaction data |
| `role` | `string` | Active role — `"admin"` or `"viewer"` |
| `activeTab` | `string` | Current page — `"dashboard"`, `"transactions"`, `"insights"` |
| `search` | `string` | Live search query for transaction table |
| `fType` | `string` | Type filter — `"all"`, `"income"`, `"expense"` |
| `fCat` | `string` | Category filter value |
| `sortBy` | `string` | Active sort column — `"date"` or `"amount"` |
| `sortDir` | `string` | Sort direction — `"asc"` or `"desc"` |
| `modal` | `object\|null` | Active modal data — `{ mode, data }` or `null` |
| `sidebarOpen` | `boolean` | Mobile sidebar drawer state |

### Derived State

Heavy computations like monthly aggregations and category totals are memoised using `useMemo` inside `DashView` and `InsightsView` — they only recompute when `transactions` changes, not on every render.

### Actions (defined in context)

```
saveTransaction(txn)       → add or update a transaction
deleteTransaction(id)      → remove a transaction by id
openAddModal()             → open modal in "add" mode
openEditModal(txn)         → open modal in "edit" mode with existing data
toggleSort(col)            → flip sort direction or switch sort column
```

---

## Design Decisions

**Dark theme** — Financial data is dense. A dark background with high-contrast green (`#10d9a0`) for positive values and red (`#f87171`) for negative values makes scanning fast and reduces eye strain.

**DM Mono for numbers** — Monospace font ensures all digits align vertically in tables and cards, which is a small but meaningful touch in financial UIs.

**Barrel exports** — Each component folder has an `index.js` that re-exports everything, keeping import statements clean across the codebase.

**No routing library** — Tab-based navigation via `activeTab` state is sufficient for a single-page dashboard. Adding React Router would be appropriate if the app grew to multiple pages.

**Pure utility functions** — `helpers.js` exports stateless, side-effect-free functions. This makes them trivially testable and reusable anywhere in the app.

**Component size discipline** — Each component has one clear responsibility. `TxnView` handles the table and filters. `TxnModal` handles the form. `AppContext` handles state. Nothing bleeds into each other.

---

## Responsive Design

The layout adapts across three breakpoints with no layout shift or janky reflows.

| Breakpoint | Behaviour |
|---|---|
| `> 768px` | Full sidebar visible, 3-column stat grid, side-by-side charts |
| `≤ 768px` | Sidebar hidden, hamburger opens overlay drawer, charts stack vertically, stat grid goes 2-column, Category and Type columns hidden in table |
| `≤ 480px` | Stat grid goes 1-column |

---

## Folder Conventions

- `components/Common/` — Atoms used across more than one feature
- `components/<Feature>/` — Components that belong to exactly one feature
- `pages/` — Top-level layout shells, not business logic
- `context/` — Global state only, no UI
- `utils/` — Pure functions, no imports from the app itself
- `data/` — Static data and constants

---

## What I Would Add Next

Given more time, here is what I would build on top of this foundation:

- **localStorage persistence** — Persist transactions across sessions using Zustand's `persist` middleware or a custom hook
- **CSV / JSON export** — Let users download their transaction history using `papaparse`
- **Date range filter** — Filter transactions by a custom date range with a calendar picker
- **Budget goals** — Set monthly spending limits per category and visualise progress
- **Mock API layer** — Replace static data with `json-server` or `MSW` to simulate real API calls
- **Unit tests** — Test utility functions with Vitest and component behaviour with React Testing Library

---

## Author

Daksh Negi
Frontend Developer

- GitHub: https://github.com/Ndaksh784
- LinkedIn:https://www.linkedin.com/in/daksh-negi-2060822a3/
- Email: ndaksh874@gmail.com

---

*Built with React, Vite, Tailwind CSS v4, and Recharts.*