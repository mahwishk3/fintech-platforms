interface Filters {
  riskLevels: string[];
  categories: string[];
  minReturn: number;
  maxReturn: number;
  liquidity: string;
  timeHorizon: string;
  maxMinInvestment: number;
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  productCount: number;
}

export type { Filters };

export default function FilterPanel({ filters, onFilterChange, productCount }: FilterPanelProps) {
  const update = (partial: Partial<Filters>) => onFilterChange({ ...filters, ...partial });

  const toggleCheckbox = (key: 'riskLevels' | 'categories', value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    update({ [key]: next });
  };

  const resetFilters = () => {
    onFilterChange({
      riskLevels: [],
      categories: [],
      minReturn: 0,
      maxReturn: 30,
      liquidity: 'all',
      timeHorizon: 'all',
      maxMinInvestment: 10000000,
    });
  };

  return (
    <aside className="filter-panel" data-testid="filter-panel">
      <div className="filter-panel-header">
        <span className="filter-panel-title">Filters</span>
        <button className="btn btn-sm btn-secondary" onClick={resetFilters} data-testid="btn-reset-filters">
          Reset
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">Risk Level</div>
        <div className="checkbox-group">
          {['low', 'medium', 'high'].map(r => (
            <label key={r} className="checkbox-option" data-testid={`filter-risk-${r}`}>
              <input
                type="checkbox"
                checked={filters.riskLevels.includes(r)}
                onChange={() => toggleCheckbox('riskLevels', r)}
              />
              <span className="checkbox-label" style={{ textTransform: 'capitalize' }}>{r} Risk</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">Category</div>
        <div className="checkbox-group">
          {['savings', 'investment', 'insurance', 'crypto'].map(c => (
            <label key={c} className="checkbox-option" data-testid={`filter-cat-${c}`}>
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={() => toggleCheckbox('categories', c)}
              />
              <span className="checkbox-label" style={{ textTransform: 'capitalize' }}>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">Return Range (%)</div>
        <div className="range-inputs">
          <div className="range-input">
            <label>Min</label>
            <input
              type="number"
              value={filters.minReturn}
              min={0}
              max={filters.maxReturn}
              onChange={e => update({ minReturn: Number(e.target.value) })}
              data-testid="filter-min-return"
            />
          </div>
          <div className="range-input">
            <label>Max</label>
            <input
              type="number"
              value={filters.maxReturn}
              min={filters.minReturn}
              max={50}
              onChange={e => update({ maxReturn: Number(e.target.value) })}
              data-testid="filter-max-return"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">Liquidity</div>
        <select
          className="select-filter"
          value={filters.liquidity}
          onChange={e => update({ liquidity: e.target.value })}
          data-testid="filter-liquidity"
        >
          <option value="all">All Liquidity</option>
          <option value="easy">Easy Access</option>
          <option value="moderate">Moderate</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">Time Horizon</div>
        <select
          className="select-filter"
          value={filters.timeHorizon}
          onChange={e => update({ timeHorizon: e.target.value })}
          data-testid="filter-horizon"
        >
          <option value="all">All Horizons</option>
          <option value="short">Short-term (1-2yr)</option>
          <option value="medium">Medium-term (3-5yr)</option>
          <option value="long">Long-term (5+yr)</option>
        </select>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">Max Min. Investment (PKR)</div>
        <input
          type="number"
          className="form-input"
          value={filters.maxMinInvestment}
          onChange={e => update({ maxMinInvestment: Number(e.target.value) })}
          placeholder="e.g. 500000"
          data-testid="filter-min-investment"
        />
      </div>

      <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
        <strong style={{ color: 'var(--text-primary)' }}>{productCount}</strong> products match
      </div>
    </aside>
  );
}
