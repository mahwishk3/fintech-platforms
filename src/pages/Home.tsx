import { useLocation } from 'wouter';
import { useProducts } from '../context/ProductsContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useUserProfile } from '../context/UserProfileContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { key: 'savings', label: 'Savings', icon: '🏦', desc: 'Low risk, predictable returns', color: '#dbeafe' },
  { key: 'investment', label: 'Investment', icon: '📈', desc: 'Pooled investments, varying risk', color: '#ede9fe' },
  { key: 'insurance', label: 'Insurance', icon: '🛡️', desc: 'Risk protection products', color: '#dcfce7' },
  { key: 'crypto', label: 'Crypto', icon: '₿', desc: 'Digital assets, high volatility', color: '#fef3c7' },
];

function getFeaturedProducts(products: ReturnType<typeof useProducts>['products']) {
  const byCategory: Record<string, typeof products[0][]> = {};
  products.forEach(p => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  const featured: typeof products = [];
  Object.values(byCategory).forEach(group => {
    const sorted = [...group].sort((a, b) => b.expectedReturn - a.expectedReturn);
    if (sorted[0]) featured.push(sorted[0]);
    if (sorted[1]) featured.push(sorted[1]);
  });

  return featured.slice(0, 5);
}

export default function Home() {
  const [, navigate] = useLocation();
  const { products, loading } = useProducts();
  const { addToPortfolio, isInPortfolio } = usePortfolio();
  const { isProfileComplete } = useUserProfile();

  const featured = getFeaturedProducts(products);

  const stats = {
    total: products.length,
    categories: 4,
    avgReturn: products.length
      ? (products.reduce((s, p) => s + p.expectedReturn, 0) / products.length).toFixed(1)
      : '0',
    lowRisk: products.filter(p => p.riskLevel === 'low').length,
  };

  return (
    <div data-testid="page-home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">Financial Product Discovery Platform</div>
            <h1 className="hero-title">
              Invest Smarter with <span>FinPulse</span>
            </h1>
            <p className="hero-subtitle">
              Discover, compare, and invest in financial products tailored to your risk profile.
              From savings accounts to crypto — all in one intelligent platform.
            </p>
            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => navigate('/profile')} data-testid="btn-hero-profile">
                Create Your Profile
              </button>
              <button className="hero-btn-secondary" onClick={() => navigate('/products')} data-testid="btn-hero-explore">
                Explore Products
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item" data-testid="stat-total-products">
              <div className="stat-value">{stats.total}+</div>
              <div className="stat-label">Financial Products</div>
            </div>
            <div className="stat-item" data-testid="stat-categories">
              <div className="stat-value">{stats.categories}</div>
              <div className="stat-label">Asset Categories</div>
            </div>
            <div className="stat-item" data-testid="stat-avg-return">
              <div className="stat-value">{stats.avgReturn}%</div>
              <div className="stat-label">Avg. Annual Return</div>
            </div>
            <div className="stat-item" data-testid="stat-low-risk">
              <div className="stat-value">{stats.lowRisk}</div>
              <div className="stat-label">Low-Risk Options</div>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Select a category to filter products</p>
            </div>
          </div>
          <div className="category-cards">
            {CATEGORIES.map(cat => (
              <div
                key={cat.key}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat.key}`)}
                data-testid={`cat-card-${cat.key}`}
              >
                <div className="category-card-icon" style={{ background: cat.color }}>
                  {cat.icon}
                </div>
                <div className="category-card-name">{cat.label}</div>
                <div className="category-card-desc">{cat.desc}</div>
                <div className="category-card-count">
                  {products.filter(p => p.category === cat.key).length} products
                </div>
              </div>
            ))}
          </div>

          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Top performers across each category, selected dynamically</p>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/products')} data-testid="btn-view-all">
              View All Products
            </button>
          </div>

          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              <div className="loading-text">Loading financial products...</div>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p, i) => (
                <div key={p.id} className={`slide-up slide-up-delay-${Math.min(i + 1, 3)}`}>
                  <ProductCard
                    product={p}
                    onAddToPortfolio={addToPortfolio}
                    isInPortfolio={isInPortfolio(p.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          {isProfileComplete() ? (
            <>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12 }}>
                Your Profile is Ready
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>
                View personalized recommendations based on your financial profile.
              </p>
              <button
                className="hero-btn-primary"
                onClick={() => navigate('/recommendations')}
                data-testid="btn-view-recommendations"
              >
                View Recommendations
              </button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12 }}>
                Get Personalized Recommendations
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>
                Create your financial profile and let our recommendation engine find the best products for you.
              </p>
              <button
                className="hero-btn-primary"
                onClick={() => navigate('/profile')}
                data-testid="btn-cta-profile"
              >
                Create Your Profile Now
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
