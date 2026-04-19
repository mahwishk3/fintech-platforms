import { useState, useEffect, useMemo } from 'react';
import { useSearch } from 'wouter';
import { useProducts } from '../context/ProductsContext';
import { usePortfolio } from '../context/PortfolioContext';
import FilterPanel, { type Filters } from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import type { FinancialProduct } from '../data/products';

const defaultFilters: Filters = {
  riskLevels: [],
  categories: [],
  minReturn: 0,
  maxReturn: 30,
  liquidity: 'all',
  timeHorizon: 'all',
  maxMinInvestment: 10000000,
};

type SortKey = 'return-desc' | 'return-asc' | 'risk-asc' | 'risk-desc' | 'investment-asc';

const riskOrder = { low: 1, medium: 2, high: 3 };

function applyFilters(products: FinancialProduct[], filters: Filters, search: string): FinancialProduct[] {
  return products.filter(p => {
    const passRisk = filters.riskLevels.length === 0 || filters.riskLevels.includes(p.riskLevel);
    const passReturn = p.expectedReturn >= filters.minReturn && p.expectedReturn <= filters.maxReturn;
    const passCategory = filters.categories.length === 0 || filters.categories.includes(p.category);
    const passLiquidity = filters.liquidity === 'all' || p.liquidity === filters.liquidity;
    const passHorizon = filters.timeHorizon === 'all' || p.timeHorizon === filters.timeHorizon;
    const passInvestment = p.minInvestment <= filters.maxMinInvestment;
    const passSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return passRisk && passReturn && passCategory && passLiquidity && passHorizon && passInvestment && passSearch;
  });
}

function applySorting(products: FinancialProduct[], sortKey: SortKey): FinancialProduct[] {
  const copy = [...products];
  switch (sortKey) {
    case 'return-desc': return copy.sort((a, b) => b.expectedReturn - a.expectedReturn);
    case 'return-asc': return copy.sort((a, b) => a.expectedReturn - b.expectedReturn);
    case 'risk-asc': return copy.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    case 'risk-desc': return copy.sort((a, b) => riskOrder[b.riskLevel] - riskOrder[a.riskLevel]);
    case 'investment-asc': return copy.sort((a, b) => a.minInvestment - b.minInvestment);
    default: return copy;
  }
}

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryParam = params.get('category') || '';

  const { products, loading, error } = useProducts();
  const { addToPortfolio, isInPortfolio } = usePortfolio();

  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    categories: categoryParam ? [categoryParam] : [],
  });
  const [sortKey, setSortKey] = useState<SortKey>('return-desc');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    if (categoryParam) {
      setFilters(f => ({ ...f, categories: [categoryParam] }));
    }
  }, [categoryParam]);

  const filtered = useMemo(
    () => applySorting(applyFilters(products, filters, debouncedSearch), sortKey),
    [products, filters, debouncedSearch, sortKey]
  );

  return (
    <div className="page-wrapper" data-testid="page-products">
      <div className="container">
        <div className="mb-32">
          <h1 className="section-title">Financial Products</h1>
          <p className="section-subtitle">Discover and filter from {products.length} financial instruments</p>
        </div>

        <div className="products-layout">
          <div>
            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(v => !v)}
              data-testid="btn-toggle-filters"
              style={{ marginBottom: 16 }}
            >
              {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
            </button>
            <div className={showFilters ? '' : 'filter-panel'} style={showFilters ? {} : { display: 'none' }}>
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                productCount={filtered.length}
              />
            </div>
          </div>

          <div>
            <div className="products-header">
              <div className="products-count">
                Showing <strong>{filtered.length}</strong> of {products.length} products
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div className="search-bar">
                  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    data-testid="input-search"
                  />
                </div>
                <select
                  className="sort-select"
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value as SortKey)}
                  data-testid="select-sort"
                >
                  <option value="return-desc">Highest Return</option>
                  <option value="return-asc">Lowest Return</option>
                  <option value="risk-asc">Lowest Risk</option>
                  <option value="risk-desc">Highest Risk</option>
                  <option value="investment-asc">Min. Investment</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <div className="loading-text">Loading products...</div>
              </div>
            ) : error ? (
              <div className="empty-state">
                <div className="empty-icon">⚠️</div>
                <p>Failed to load products: {error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>No products match your filters. Try adjusting them.</p>
              </div>
            ) : (
              <div className="products-grid" data-testid="products-grid">
                {filtered.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToPortfolio={addToPortfolio}
                    isInPortfolio={isInPortfolio(p.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
