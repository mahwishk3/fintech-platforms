import { useLocation } from 'wouter';
import { useUserProfile } from '../context/UserProfileContext';
import { useProducts } from '../context/ProductsContext';
import RecommendationList from '../components/RecommendationList';

const riskLabels: Record<string, string> = {
  conservative: 'Conservative',
  moderate: 'Moderate',
  aggressive: 'Aggressive',
};

export default function Recommendations() {
  const [, navigate] = useLocation();
  const { profile, getRecommendations, isProfileComplete } = useUserProfile();
  const { products, loading } = useProducts();
  const recommendations = getRecommendations(products);

  if (!isProfileComplete()) {
    return (
      <div className="page-wrapper" data-testid="page-recommendations">
        <div className="container">
          <div className="rec-empty">
            <div className="rec-empty-icon">🎯</div>
            <div className="rec-empty-title">Profile Required</div>
            <div className="rec-empty-desc">
              Create your financial profile first to get personalized recommendations tailored to your risk tolerance, investment horizon, and budget.
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/profile')}
              data-testid="btn-create-profile"
            >
              Create Your Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" data-testid="page-recommendations">
      <div className="container">
        <div className="mb-32" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="section-title">Your Recommendations</h1>
            <p className="section-subtitle">
              Personalized for a{' '}
              <strong style={{ color: 'var(--primary)' }}>{riskLabels[profile.riskTolerance]}</strong>{' '}
              investor with PKR {profile.monthlyCapacity.toLocaleString()} monthly capacity
            </p>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/profile')}
            data-testid="btn-edit-profile"
          >
            Edit Profile
          </button>
        </div>

        <div className="card mb-32" style={{ background: 'var(--surface-alt)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Algorithm</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                Risk: <span style={{ color: 'var(--primary)' }}>{profile.riskTolerance}</span> →{' '}
                Horizon: <span style={{ color: 'var(--primary)' }}>{profile.investmentHorizon}</span> →{' '}
                Liquidity: <span style={{ color: 'var(--primary)' }}>{profile.liquidityPreference}</span> →{' '}
                Budget: <span style={{ color: 'var(--primary)' }}>PKR {profile.monthlyCapacity.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Sorted By</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {profile.riskTolerance === 'conservative' ? 'Lowest risk first' : 'Highest return first'}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">Computing recommendations...</div>
          </div>
        ) : (
          <RecommendationList recommendations={recommendations} profile={profile} />
        )}
      </div>
    </div>
  );
}
