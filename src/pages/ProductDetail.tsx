import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useProducts } from '../context/ProductsContext';
import { usePortfolio } from '../context/PortfolioContext';
import RiskBadge from '../components/RiskBadge';
import type { FinancialProduct } from '../data/products';

const liquidityLabels: Record<string, string> = { easy: 'Easy Access', moderate: 'Moderate', locked: 'Locked' };
const horizonLabels: Record<string, string> = { short: 'Short-term (1-2 yr)', medium: 'Medium-term (3-5 yr)', long: 'Long-term (5+ yr)' };
const categoryLabels: Record<string, string> = { savings: 'Savings', investment: 'Investment', insurance: 'Insurance', crypto: 'Crypto' };

function generateDecisionInsight(product: FinancialProduct): string {
  const insights: string[] = [];
  if (product.riskLevel === 'low') {
    insights.push('Suitable for conservative investors prioritizing capital preservation.');
  } else if (product.riskLevel === 'medium') {
    insights.push('Ideal for moderate investors seeking balanced growth with manageable risk.');
  } else if (product.riskLevel === 'high') {
    insights.push('Best for aggressive investors comfortable with significant volatility.');
  }
  if (product.liquidity === 'locked') {
    insights.push('Requires commitment; early withdrawal may incur penalties.');
  } else if (product.liquidity === 'easy') {
    insights.push('Highly liquid — funds accessible without restrictions.');
  }
  if (product.timeHorizon === 'long') {
    insights.push('Optimal when held for 5+ years to maximize compounding returns.');
  } else if (product.timeHorizon === 'short') {
    insights.push('Suitable for short-term goals and investors needing near-term liquidity.');
  }
  if (product.category === 'crypto') {
    insights.push('Crypto assets are subject to extreme price volatility; only invest what you can afford to lose.');
  }
  if (product.category === 'insurance') {
    insights.push('Insurance products provide protection against financial loss in addition to potential returns.');
  }
  return insights.join(' ');
}

function ReturnCalculator({ product }: { product: FinancialProduct }) {
  const [amount, setAmount] = useState(product.minInvestment);

  const projections = useMemo(() => {
    const r = product.expectedReturn / 100;
    return [1, 3, 5, 10].map(years => ({
      years,
      simple: parseFloat((amount + amount * r * years).toFixed(0)),
      compound: parseFloat((amount * Math.pow(1 + r, years)).toFixed(0)),
    }));
  }, [amount, product.expectedReturn]);

  return (
    <div className="calculator-card">
      <div className="calc-title">Return Calculator</div>
      <div className="form-group">
        <label className="form-label">Investment Amount (PKR)</label>
        <input
          type="number"
          className="form-input"
          value={amount}
          min={product.minInvestment}
          onChange={e => setAmount(Number(e.target.value))}
          data-testid="input-calc-amount"
        />
        <div className="form-hint">Min. PKR {product.minInvestment.toLocaleString()}</div>
      </div>
      <div className="calc-result">
        <div className="calc-result-label">After 1 year ({product.expectedReturn}% p.a.)</div>
        <div className="calc-result-value">PKR {projections[0]?.compound.toLocaleString()}</div>
      </div>
      <div className="calc-years" style={{ marginTop: 12 }}>
        {projections.slice(1).map(p => (
          <div key={p.years} className="calc-year-item">
            <div className="calc-year-label">{p.years} years</div>
            <div className="calc-year-value">PKR {p.compound.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        Based on compound interest. Actual returns may vary.
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { products, loading } = useProducts();
  const { addToPortfolio, isInPortfolio } = usePortfolio();
  const [compareId, setCompareId] = useState<string>('');
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find(p => String(p.id) === id);
  const compareProduct = products.find(p => String(p.id) === compareId);
  const inPortfolio = product ? isInPortfolio(product.id) : false;

  const handleAdd = () => {
    if (!product || inPortfolio) return;
    addToPortfolio(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <div className="loading-text">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found" data-testid="product-not-found">
        <h1>404</h1>
        <p>Product not found.</p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const riskScore = { low: 33, medium: 66, high: 100 }[product.riskLevel];

  return (
    <div data-testid="page-product-detail">
      <div className="product-detail-header">
        <div className="container">
          <button className="back-link" onClick={() => navigate('/products')} data-testid="btn-back">
            ← Back to Products
          </button>
          <div className="product-detail-meta">
            <span className={`category-badge ${product.category}`}>{categoryLabels[product.category]}</span>
            <RiskBadge riskLevel={product.riskLevel} />
          </div>
          <h1 className="product-detail-title">{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div className="product-detail-return">{product.expectedReturn}%</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>expected annual return</div>
          </div>
        </div>
      </div>

      <div className="container page-wrapper" style={{ paddingTop: 0 }}>
        <div className="detail-grid">
          <div>
            <div className="attribute-grid">
              {[
                { label: 'Category', value: categoryLabels[product.category] },
                { label: 'Risk Level', value: product.riskLevel.charAt(0).toUpperCase() + product.riskLevel.slice(1) },
                { label: 'Expected Return', value: `${product.expectedReturn}% p.a.` },
                { label: 'Liquidity', value: liquidityLabels[product.liquidity] },
                { label: 'Time Horizon', value: horizonLabels[product.timeHorizon] },
                { label: 'Min. Investment', value: `PKR ${product.minInvestment.toLocaleString()}` },
              ].map(attr => (
                <div key={attr.label} className="attribute-card" data-testid={`attr-${attr.label.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className="attribute-label">{attr.label}</div>
                  <div className="attribute-value">{attr.value}</div>
                </div>
              ))}
            </div>

            <div className="card mb-24">
              <div className="card-title">About this Product</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{product.description}</p>
            </div>

            <div className="insight-box" data-testid="decision-insight">
              <div className="insight-title">
                💡 Investment Insight
              </div>
              <div className="insight-text">{generateDecisionInsight(product)}</div>
            </div>

            <div className="card mb-24">
              <div className="card-title">Risk Visualization</div>
              <div className="risk-bar-wrap">
                <div className="risk-bar-label">
                  <span>Risk Level</span>
                  <span style={{ fontWeight: 600, color: `var(--risk-${product.riskLevel})` }}>
                    {product.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="risk-bar-track">
                  <div className={`risk-bar-fill ${product.riskLevel}`} style={{ width: `${riskScore}%` }} data-testid="risk-bar" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
              </div>
            </div>

            <div className="comparison-section">
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Compare with Another Product</h3>
              <div style={{ marginBottom: 16 }}>
                <select
                  className="select-filter"
                  value={compareId}
                  onChange={e => setCompareId(e.target.value)}
                  data-testid="select-compare"
                  style={{ maxWidth: 300 }}
                >
                  <option value="">Select a product to compare</option>
                  {products
                    .filter(p => p.id !== product.id)
                    .map(p => (
                      <option key={p.id} value={String(p.id)}>{p.name}</option>
                    ))}
                </select>
              </div>

              {compareProduct && (
                <div className="comparison-grid" data-testid="comparison-panel">
                  {[product, compareProduct].map((p, i) => (
                    <div key={p.id} className={`comparison-card${i === 0 ? ' active' : ''}`}>
                      <div style={{ marginBottom: 12 }}>
                        <span className={`category-badge ${p.category}`}>{categoryLabels[p.category]}</span>
                        <div style={{ fontWeight: 700, fontSize: 15, marginTop: 8 }}>{p.name}</div>
                        {i === 0 && <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>CURRENT</div>}
                      </div>
                      {[
                        { label: 'Expected Return', value: `${p.expectedReturn}%` },
                        { label: 'Risk Level', value: p.riskLevel },
                        { label: 'Liquidity', value: p.liquidity },
                        { label: 'Time Horizon', value: p.timeHorizon },
                        { label: 'Min. Investment', value: `PKR ${p.minInvestment.toLocaleString()}` },
                      ].map(row => (
                        <div key={row.label} className="comparison-row">
                          <span className="comparison-row-label">{row.label}</span>
                          <span className="comparison-row-value" style={{ textTransform: 'capitalize' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <ReturnCalculator product={product} />
            <div style={{ marginTop: 16 }}>
              <button
                className={`btn btn-lg btn-full${inPortfolio || justAdded ? ' btn-added' : ' btn-success'}`}
                onClick={handleAdd}
                disabled={inPortfolio}
                data-testid="btn-add-to-portfolio"
                style={{ transition: 'all 0.3s ease' }}
              >
                {inPortfolio ? '✓ Already in Portfolio' : justAdded ? '✓ Added to Portfolio!' : '+ Add to Portfolio'}
              </button>
              <button
                className="btn btn-secondary btn-full"
                onClick={() => navigate('/portfolio')}
                data-testid="btn-view-portfolio"
                style={{ marginTop: 8 }}
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
