import { useLocation } from 'wouter';
import { usePortfolio } from '../context/PortfolioContext';
import PortfolioSummary from '../components/PortfolioSummary';
import PortfolioItem from '../components/PortfolioItem';

export default function Portfolio() {
  const [, navigate] = useLocation();
  const { portfolio, removeFromPortfolio, updateAllocation } = usePortfolio();

  if (portfolio.items.length === 0) {
    return (
      <div className="page-wrapper" data-testid="page-portfolio">
        <div className="container">
          <div className="mb-32">
            <h1 className="section-title">My Portfolio</h1>
            <p className="section-subtitle">Track and manage your investment portfolio</p>
          </div>
          <div className="rec-empty">
            <div className="rec-empty-icon">💼</div>
            <div className="rec-empty-title">Your portfolio is empty</div>
            <div className="rec-empty-desc">
              Start adding financial products to build your personalized portfolio.
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/products')}
              data-testid="btn-browse-products"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" data-testid="page-portfolio">
      <div className="container">
        <div className="mb-32" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="section-title">My Portfolio</h1>
            <p className="section-subtitle">{portfolio.items.length} products · PKR {portfolio.totalInvested.toLocaleString()} total invested</p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/products')} data-testid="btn-add-more">
            + Add More Products
          </button>
        </div>

        <PortfolioSummary portfolio={portfolio} />

        <div className="card">
          <div className="card-title">Portfolio Holdings</div>
          <div data-testid="portfolio-items-list">
            {portfolio.items.map(item => (
              <PortfolioItem
                key={item.product.id}
                item={item}
                onRemove={removeFromPortfolio}
                onUpdateAmount={updateAllocation}
              />
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-title">Category Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(portfolio.categoryDistribution).map(([cat, pct]) => (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{cat}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--surface-alt)', borderRadius: 100, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: 100,
                      background: cat === 'crypto' ? '#f59e0b' : cat === 'savings' ? '#3b82f6' : cat === 'investment' ? '#8b5cf6' : '#10b981',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
