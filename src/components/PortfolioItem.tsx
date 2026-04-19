import { useState } from 'react';
import type { PortfolioItem as PortfolioItemType } from '../context/PortfolioContext';
import RiskBadge from './RiskBadge';

interface PortfolioItemProps {
  item: PortfolioItemType;
  onRemove: (id: string | number) => void;
  onUpdateAmount: (id: string | number, amount: number) => void;
}

export default function PortfolioItem({ item, onRemove, onUpdateAmount }: PortfolioItemProps) {
  const [amount, setAmount] = useState(item.allocatedAmount);

  const handleAmountChange = (val: number) => {
    setAmount(val);
    if (val > 0) onUpdateAmount(item.product.id, val);
  };

  const projectedReturn = (amount * item.product.expectedReturn) / 100;

  return (
    <div className="portfolio-item-card" data-testid={`portfolio-item-${item.product.id}`}>
      <div className="portfolio-item-info">
        <div className="portfolio-item-name">{item.product.name}</div>
        <div className="portfolio-item-meta">
          <RiskBadge riskLevel={item.product.riskLevel} size="sm" />
          <span style={{ fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>
            +{item.product.expectedReturn}% p.a.
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Projected: PKR {projectedReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr
          </span>
        </div>
      </div>

      <div className="portfolio-item-amount">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: 11, color: 'var(--text-muted)' }}>Allocated (PKR)</label>
          <input
            type="number"
            className="amount-input"
            value={amount}
            min={item.product.minInvestment}
            onChange={e => handleAmountChange(Number(e.target.value))}
            data-testid={`input-amount-${item.product.id}`}
          />
        </div>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onRemove(item.product.id)}
          data-testid={`btn-remove-${item.product.id}`}
          style={{ alignSelf: 'flex-end' }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
