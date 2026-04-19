import { useState } from 'react';
import { useLocation } from 'wouter';
import type { FinancialProduct } from '../data/products';
import RiskBadge from './RiskBadge';

interface ProductCardProps {
  product: FinancialProduct;
  onAddToPortfolio: (product: FinancialProduct) => void;
  isInPortfolio: boolean;
}

const categoryLabels: Record<string, string> = {
  savings: 'Savings',
  investment: 'Investment',
  insurance: 'Insurance',
  crypto: 'Crypto',
};

const liquidityLabels: Record<string, string> = {
  easy: 'Easy Access',
  moderate: 'Moderate',
  locked: 'Locked',
};

const horizonLabels: Record<string, string> = {
  short: 'Short-term',
  medium: 'Medium-term',
  long: 'Long-term',
};

export default function ProductCard({ product, onAddToPortfolio, isInPortfolio }: ProductCardProps) {
  const [, navigate] = useLocation();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInPortfolio) {
      onAddToPortfolio(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div
      className="product-card slide-up"
      onClick={() => navigate(`/product/${product.id}`)}
      data-testid={`card-product-${product.id}`}
    >
      <div className="product-card-header">
        <div>
          <span className={`category-badge ${product.category}`}>{categoryLabels[product.category]}</span>
          <div className="product-card-title" style={{ marginTop: 8 }}>{product.name}</div>
        </div>
        <div>
          <div className="product-card-return">{product.expectedReturn.toFixed(1)}%</div>
          <div className="product-card-return-label">Annual Return</div>
        </div>
      </div>

      <div className="product-card-meta">
        <RiskBadge riskLevel={product.riskLevel} size="sm" />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Min: PKR {product.minInvestment.toLocaleString()}
        </span>
      </div>

      <div className="product-card-details">
        <div>
          <div className="detail-item-label">Liquidity</div>
          <div className="detail-item-value">{liquidityLabels[product.liquidity]}</div>
        </div>
        <div>
          <div className="detail-item-label">Horizon</div>
          <div className="detail-item-value">{horizonLabels[product.timeHorizon]}</div>
        </div>
        <div>
          <div className="detail-item-label">Category</div>
          <div className="detail-item-value">{categoryLabels[product.category]}</div>
        </div>
        <div>
          <div className="detail-item-label">Min. Investment</div>
          <div className="detail-item-value">PKR {product.minInvestment.toLocaleString()}</div>
        </div>
      </div>

      <div className="product-card-actions">
        <button
          className={`btn btn-sm ${isInPortfolio || justAdded ? 'btn-added' : 'btn-success'}`}
          onClick={handleAdd}
          data-testid={`btn-add-portfolio-${product.id}`}
          style={{ flex: 1, transition: 'all 0.3s ease' }}
        >
          {isInPortfolio ? '✓ In Portfolio' : justAdded ? '✓ Added!' : '+ Add to Portfolio'}
        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          data-testid={`btn-view-${product.id}`}
          style={{ flexShrink: 0 }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
