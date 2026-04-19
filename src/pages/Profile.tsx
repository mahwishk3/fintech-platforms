import { useLocation } from 'wouter';
import { useUserProfile } from '../context/UserProfileContext';
import { useProducts } from '../context/ProductsContext';
import ProfileForm from '../components/ProfileForm';
import type { UserProfile } from '../context/UserProfileContext';

const riskLabels: Record<string, string> = {
  conservative: 'Conservative',
  moderate: 'Moderate',
  aggressive: 'Aggressive',
};

const horizonLabels: Record<string, string> = {
  short: 'Short (1-2 years)',
  medium: 'Medium (3-5 years)',
  long: 'Long (5+ years)',
};

const liquidityLabels: Record<string, string> = {
  easy: 'Need Quick Access',
  moderate: 'Some Flexibility',
  locked: 'Can Lock Funds',
};

export default function Profile() {
  const [, navigate] = useLocation();
  const { profile, updateProfile, getRecommendations, isProfileComplete } = useUserProfile();
  const { products } = useProducts();

  const recCount = getRecommendations(products).length;

  const handleChange = (p: UserProfile) => {
    updateProfile(p);
  };

  return (
    <div className="page-wrapper" data-testid="page-profile">
      <div className="container">
        <div className="mb-32">
          <h1 className="section-title">Your Financial Profile</h1>
          <p className="section-subtitle">Tell us about your investment goals to get personalized recommendations</p>
        </div>

        <div className="profile-layout">
          <div>
            <ProfileForm
              profile={profile}
              onSubmit={(p) => {
                updateProfile(p);
              }}
              onChange={handleChange}
            />
          </div>

          <div>
            {isProfileComplete() && (
              <div className="profile-summary-card" data-testid="profile-summary">
                <div className="profile-summary-title">Your Current Profile</div>
                {[
                  { label: 'Risk Tolerance', value: riskLabels[profile.riskTolerance] || '—' },
                  { label: 'Investment Horizon', value: horizonLabels[profile.investmentHorizon] || '—' },
                  { label: 'Monthly Capacity', value: profile.monthlyCapacity ? `PKR ${profile.monthlyCapacity.toLocaleString()}` : '—' },
                  { label: 'Liquidity', value: liquidityLabels[profile.liquidityPreference] || '—' },
                  { label: 'Goals', value: profile.investmentGoal.join(', ') || 'None selected' },
                ].map(attr => (
                  <div key={attr.label} className="profile-attr">
                    <span className="profile-attr-label">{attr.label}</span>
                    <span className="profile-attr-value" style={{ textAlign: 'right', maxWidth: 160, fontSize: 13 }}>{attr.value}</span>
                  </div>
                ))}

                <div className="recommendation-count" data-testid="rec-count">
                  <div className="recommendation-count-value">{recCount}</div>
                  <div className="recommendation-count-label">products match your profile</div>
                </div>

                <button
                  className="btn btn-full"
                  onClick={() => navigate('/recommendations')}
                  style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}
                  data-testid="btn-go-recommendations"
                >
                  View Recommendations
                </button>
              </div>
            )}

            {!isProfileComplete() && (
              <div className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Complete Your Profile</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Fill in all required fields to see how many products match your investment style.
                </div>
              </div>
            )}

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-title" style={{ fontSize: 15 }}>Why does this matter?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '🎯', text: 'Risk tolerance filters out products that don\'t match your comfort level' },
                  { icon: '⏱️', text: 'Investment horizon matches products with appropriate time commitments' },
                  { icon: '💰', text: 'Monthly capacity ensures you only see affordable products' },
                  { icon: '💧', text: 'Liquidity preference aligns products with your access needs' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
