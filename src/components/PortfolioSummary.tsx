import type { Portfolio } from '../context/PortfolioContext';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const { riskDistribution, diversificationScore } = portfolio;

  return (
    <div>
      <div className="portfolio-summary-grid">
        <div className="portfolio-stat-card" data-testid="stat-total-invested">
          <div className="portfolio-stat-label">Total Invested</div>
          <div className="portfolio-stat-value">PKR {portfolio.totalInvested.toLocaleString()}</div>
          <div className="portfolio-stat-sub">{portfolio.items.length} products</div>
        </div>
        <div className="portfolio-stat-card" data-testid="stat-weighted-return">
          <div className="portfolio-stat-label">Weighted Return</div>
          <div className="portfolio-stat-value" style={{ color: 'var(--secondary)' }}>
            {portfolio.weightedReturn.toFixed(2)}%
          </div>
          <div className="portfolio-stat-sub">Expected annual</div>
        </div>
        <div className="portfolio-stat-card" data-testid="stat-risk-dist">
          <div className="portfolio-stat-label">Low Risk</div>
          <div className="portfolio-stat-value" style={{ color: 'var(--risk-low)' }}>{riskDistribution.low}%</div>
          <div className="portfolio-stat-sub">of portfolio</div>
        </div>
        <div className="portfolio-stat-card" data-testid="stat-high-risk">
          <div className="portfolio-stat-label">High Risk</div>
          <div className="portfolio-stat-value" style={{ color: 'var(--risk-high)' }}>{riskDistribution.high}%</div>
          <div className="portfolio-stat-sub">of portfolio</div>
        </div>
      </div>

      {riskDistribution.high > 50 && (
        <div className="high-risk-warning" data-testid="warning-high-risk">
          ⚠️ Your portfolio has {riskDistribution.high}% in high-risk products. Consider diversifying to reduce volatility.
        </div>
      )}

      <div className="card mb-24">
        <div className="card-title">Risk Distribution</div>
        <div className="risk-distribution">
          <div className="risk-dist-bar">
            <div className="risk-dist-segment" style={{ width: `${riskDistribution.low}%`, background: 'var(--risk-low)' }} />
            <div className="risk-dist-segment" style={{ width: `${riskDistribution.medium}%`, background: 'var(--risk-medium)' }} />
            <div className="risk-dist-segment" style={{ width: `${riskDistribution.high}%`, background: 'var(--risk-high)' }} />
          </div>
          <div className="risk-dist-legend">
            <div className="risk-dist-item">
              <div className="risk-dist-dot" style={{ background: 'var(--risk-low)' }} />
              Low: {riskDistribution.low}%
            </div>
            <div className="risk-dist-item">
              <div className="risk-dist-dot" style={{ background: 'var(--risk-medium)' }} />
              Medium: {riskDistribution.medium}%
            </div>
            <div className="risk-dist-item">
              <div className="risk-dist-dot" style={{ background: 'var(--risk-high)' }} />
              High: {riskDistribution.high}%
            </div>
          </div>
        </div>

        <div className="diversification-score" style={{ marginTop: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Diversification</span>
          <div className="div-score-bar">
            <div className="div-score-fill" style={{ width: `${diversificationScore}%` }} />
          </div>
          <span className="div-score-label" style={{
            color: diversificationScore > 60 ? 'var(--risk-low)' : diversificationScore > 30 ? 'var(--risk-medium)' : 'var(--risk-high)'
          }}>
            {diversificationScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}
