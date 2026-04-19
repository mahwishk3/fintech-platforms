# FinPulse — Dynamic Financial Product Discovery Platform

A React-based FinTech application that transforms raw API data into financial instruments, enabling users to explore, compare, and build investment portfolios with personalized recommendations.

---

## Features

- **Product Discovery** — Browse 20 financial products across 4 categories (Savings, Investment, Insurance, Crypto)
- **Advanced Filtering** — 6 simultaneous filters with AND logic (risk, return range, category, liquidity, time horizon, budget)
- **Product Detail** — Compound return calculator, side-by-side product comparison, dynamic decision insights
- **Financial Profile** — Validated form capturing risk tolerance, investment horizon, liquidity preference, and budget
- **Portfolio Management** — Weighted return, risk distribution %, diversification score 0–100
- **Recommendation Engine** — 5-step filtering algorithm driven by user profile
- **Dark Mode** — Full light/dark theme via CSS variables
- **Persistent Storage** — Portfolio and profile saved to localStorage
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## Tech Stack

- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Context API** for global state (no Redux)
- **Plain CSS** — no UI libraries (Bootstrap, MUI, Tailwind all prohibited)
- **Fake Store API** — transformed deterministically into financial products
- **Vite** build tool

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/mahwishk3/fintech-platforms.git
cd fintech-platforms

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## Pages and Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, featured products, category navigation, quick stats |
| `/products` | Product Listing | All products with 6 filters + search + sort |
| `/product/:id` | Product Detail | Full details, return calculator, comparison |
| `/profile` | User Profile | Financial profile form with validation |
| `/portfolio` | Portfolio | Portfolio summary, risk distribution, diversification |
| `/recommendations` | Recommendations | AI-driven product recommendations based on profile |
| `*` | Not Found | 404 page |

---

## Component Hierarchy

```
App
├── Navbar (portfolioCount, currentRoute)
├── Home
│   ├── Hero Section
│   ├── QuickStats
│   ├── CategoryNav → navigates to /products?category=X
│   └── FeaturedProducts → ProductCard[]
├── ProductListing
│   ├── FilterPanel (filters, onFilterChange, productCount)
│   └── ProductList → ProductCard[]
│       └── ProductCard (product, onAddToPortfolio, isInPortfolio)
│           ├── RiskBadge (riskLevel, size)
│           └── ReturnDisplay (value, showTrend)
├── ProductDetail (/product/:id)
│   ├── ReturnProjectionCalculator
│   ├── DecisionInsight (generated dynamically)
│   └── ComparisonPanel
├── UserProfile (/profile)
│   └── ProfileForm (profile, onSubmit, onChange)
├── Portfolio (/portfolio)
│   ├── PortfolioSummary (portfolio)
│   └── PortfolioItem[] (item, onRemove, onUpdateAmount)
└── Recommendations (/recommendations)
    └── RecommendationList (recommendations, profile)
```

---

## Financial Logic

### 1. Data Transformation (Fake Store API → Financial Products)

The Fake Store API returns generic products (jackets, jewelry, electronics). These are systematically transformed into financial instruments using deterministic mappings — the same product always maps to the same financial attributes:

```typescript
const categoryMapping = {
  'electronics':    'investment',  // medium risk
  'jewelery':       'savings',     // low risk
  "men's clothing": 'insurance',   // low risk
  "women's clothing": 'crypto',    // high risk
};

function deterministicReturn(riskLevel, id) {
  const seed = id % 10;  // same id always gives same return
  if (riskLevel === 'low')    return 3 + seed * 0.4;   // 3–7%
  if (riskLevel === 'medium') return 7 + seed * 0.5;   // 7–12%
  return 12 + seed * 1.5;                               // 12–27%
}
```

No `Math.random()` is used — returns are fully deterministic.

### 2. Recommendation Engine (5-Step Algorithm)

```typescript
function getRecommendations(products, userProfile) {
  // Step 1: Map risk tolerance to allowed risk levels
  const riskMapping = {
    conservative: ['low'],
    moderate:     ['low', 'medium'],
    aggressive:   ['low', 'medium', 'high'],
  };

  // Step 2: Map investment horizon to allowed time horizons
  const horizonMapping = {
    short:  ['short'],
    medium: ['short', 'medium'],
    long:   ['short', 'medium', 'long'],
  };

  // Step 3: Map liquidity preference to allowed liquidity types
  const liquidityMapping = {
    easy:     ['easy'],
    moderate: ['easy', 'moderate'],
    locked:   ['easy', 'moderate', 'locked'],
  };

  // Step 4: Filter by monthly budget
  const affordable = products.filter(p =>
    p.minInvestment <= userProfile.monthlyCapacity
  );

  // Step 5: Apply all 3 filters with AND logic, then sort
  return affordable
    .filter(p =>
      allowedRisk.includes(p.riskLevel) &&
      allowedHorizon.includes(p.timeHorizon) &&
      allowedLiquidity.includes(p.liquidity)
    )
    .sort((a, b) =>
      profile.riskTolerance === 'conservative'
        ? a.expectedReturn - b.expectedReturn   // lowest return first
        : b.expectedReturn - a.expectedReturn   // highest return first
    );
}
```

### 3. Portfolio Calculations

```typescript
// Weighted Expected Return
weightedReturn = sum((allocation / totalInvested) * product.expectedReturn)

// Risk Distribution
lowRisk%    = (sum of low-risk allocations / totalInvested) * 100
mediumRisk% = (sum of medium-risk allocations / totalInvested) * 100
highRisk%   = (sum of high-risk allocations / totalInvested) * 100

// Diversification Score (0-100)
score = (uniqueCategories / 4) * 40   // up to 40 pts for category spread
      + (uniqueRisks / 3) * 30         // up to 30 pts for risk spread
      + max(0, 30 - highRiskPercent)   // penalty for high-risk concentration
```

### 4. Filtering Logic (AND Logic)

All active filters must be satisfied simultaneously:

```typescript
const passes =
  (riskFilter.length === 0 || riskFilter.includes(product.riskLevel)) &&
  (product.expectedReturn >= minReturn && product.expectedReturn <= maxReturn) &&
  (categoryFilter.length === 0 || categoryFilter.includes(product.category)) &&
  (liquidityFilter === 'all' || product.liquidity === liquidityFilter) &&
  (timeHorizonFilter === 'all' || product.timeHorizon === timeHorizonFilter) &&
  (product.minInvestment <= userBudget);
```

---

## Context API Structure

### PortfolioContext
Manages global portfolio state with:
- `addToPortfolio(product, amount)` — adds product with allocated amount
- `removeFromPortfolio(productId)` — removes product
- `updateAllocation(productId, newAmount)` — edits investment amount
- `calculatePortfolioStats()` — computes weighted return, risk distribution, diversification score
- Persists to `localStorage` under key `fintech_portfolio`

### UserProfileContext
Manages global user profile with:
- `updateProfile(newProfile)` — saves profile
- `isProfileComplete()` — validates all required fields are filled
- `getRecommendations(products)` — runs the 5-step recommendation algorithm
- Persists to `localStorage` under key `fintech_profile`

---

## Bonus Features Implemented

| Feature | Status |
|---------|--------|
| TypeScript | ✅ Full TypeScript with interfaces |
| localStorage Persistence | ✅ Portfolio + Profile |
| Return Calculator | ✅ Compound interest with time periods |
| Product Comparison | ✅ Side-by-side on product detail page |
| Search Functionality | ✅ Debounced search by name |
| Sorting Options | ✅ By return, risk, minimum investment |
| Diversification Score | ✅ 0–100 score with formula |
| Dark Mode | ✅ CSS variable-based theming |

---

## Deployment

Live URL: [https://fintech-platforms.vercel.app](https://fintech-platforms.vercel.app)

Deployed on **Vercel** with automatic GitHub integration.

---

## Academic Integrity

This project was developed as part of a React assignment. All financial logic, data transformation, and portfolio calculations are implemented from scratch using React, TypeScript, and plain CSS only.
