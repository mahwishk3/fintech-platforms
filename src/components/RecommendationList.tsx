import type { FinancialProduct } from '../data/products';
import type { UserProfile } from '../context/UserProfileContext';
import ProductCard from './ProductCard';
import { usePortfolio } from '../context/PortfolioContext';

interface RecommendationListProps {
  recommendations: FinancialProduct[];
  profile: UserProfile;
}

export default function RecommendationList({ recommendations, profile }: RecommendationListProps) {
  const { addToPortfolio, isInPortfolio } = usePortfolio();

  if (recommendations.length === 0) {
    return (
      <div className="rec-empty" data-testid="rec-empty">
        <div className="rec-empty-icon">🔍</div>
        <div className="rec-empty-title">No matches found</div>
        <div className="rec-empty-desc">
          {profile.riskTolerance
            ? 'Adjust your profile to see more recommendations.'
            : 'Complete your financial profile to see personalized recommendations.'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)' }}>
        <span style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>
          ✨ {recommendations.length} products match your {profile.riskTolerance} investor profile
        </span>
      </div>
      <div className="products-grid" data-testid="rec-list">
        {recommendations.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToPortfolio={addToPortfolio}
            isInPortfolio={isInPortfolio(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
