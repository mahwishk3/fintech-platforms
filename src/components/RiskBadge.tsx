interface RiskBadgeProps {
  riskLevel: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}

const labels = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

export default function RiskBadge({ riskLevel, size = 'md' }: RiskBadgeProps) {
  return (
    <span
      className={`risk-badge ${riskLevel}`}
      style={size === 'sm' ? { fontSize: '11px', padding: '2px 8px' } : undefined}
      data-testid={`badge-risk-${riskLevel}`}
    >
      <span className="risk-dot" />
      {labels[riskLevel]}
    </span>
  );
}
