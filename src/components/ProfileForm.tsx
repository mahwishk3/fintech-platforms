import { useState } from 'react';
import type { UserProfile } from '../context/UserProfileContext';

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  onChange?: (profile: UserProfile) => void;
}

const GOALS = ['Wealth Building', 'Retirement', 'Emergency Fund', 'Specific Purchase', 'Education', 'Home Ownership'];

const riskOptions = [
  { value: 'conservative', label: 'Conservative', desc: 'Capital preservation, low risk only' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced approach, low to medium risk' },
  { value: 'aggressive', label: 'Aggressive', desc: 'Growth-focused, all risk levels' },
];

const horizonOptions = [
  { value: 'short', label: 'Short (1-2 years)', desc: 'Need liquidity soon' },
  { value: 'medium', label: 'Medium (3-5 years)', desc: 'Balanced time commitment' },
  { value: 'long', label: 'Long (5+ years)', desc: 'Maximize compounding' },
];

const liquidityOptions = [
  { value: 'easy', label: 'Need Quick Access', desc: 'Can withdraw anytime' },
  { value: 'moderate', label: 'Some Flexibility', desc: 'Short notice acceptable' },
  { value: 'locked', label: 'Can Lock Funds', desc: 'Committed for full term' },
];

export default function ProfileForm({ profile, onSubmit, onChange }: ProfileFormProps) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<UserProfile>) => {
    const next = { ...form, ...partial };
    setForm(next);
    onChange?.(next);
  };

  const toggleGoal = (goal: string) => {
    const current = form.investmentGoal;
    const next = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    update({ investmentGoal: next });
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof UserProfile, string>> = {};
    if (!form.riskTolerance) e.riskTolerance = 'Please select a risk tolerance';
    if (!form.investmentHorizon) e.investmentHorizon = 'Please select an investment horizon';
    if (!form.monthlyCapacity || form.monthlyCapacity < 1000)
      e.monthlyCapacity = 'Minimum investment capacity is PKR 1,000';
    if (!form.liquidityPreference) e.liquidityPreference = 'Please select a liquidity preference';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="profile-form">
      <div className="card mb-24">
        <div className="card-title">Risk Tolerance</div>
        <div className="radio-group">
          {riskOptions.map(opt => (
            <label
              key={opt.value}
              className={`radio-option${form.riskTolerance === opt.value ? ' selected' : ''}`}
              data-testid={`radio-risk-${opt.value}`}
            >
              <input
                type="radio"
                name="riskTolerance"
                value={opt.value}
                checked={form.riskTolerance === opt.value}
                onChange={() => update({ riskTolerance: opt.value as UserProfile['riskTolerance'] })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{opt.label}</span>
                <span className="radio-option-desc">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.riskTolerance && <div className="form-error" style={{ marginTop: 8 }}>{errors.riskTolerance}</div>}
      </div>

      <div className="card mb-24">
        <div className="card-title">Investment Horizon</div>
        <div className="radio-group">
          {horizonOptions.map(opt => (
            <label
              key={opt.value}
              className={`radio-option${form.investmentHorizon === opt.value ? ' selected' : ''}`}
              data-testid={`radio-horizon-${opt.value}`}
            >
              <input
                type="radio"
                name="investmentHorizon"
                value={opt.value}
                checked={form.investmentHorizon === opt.value}
                onChange={() => update({ investmentHorizon: opt.value as UserProfile['timeHorizon'] })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{opt.label}</span>
                <span className="radio-option-desc">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.investmentHorizon && <div className="form-error" style={{ marginTop: 8 }}>{errors.investmentHorizon}</div>}
      </div>

      <div className="card mb-24">
        <div className="card-title">Monthly Investment Capacity</div>
        <div className="form-group">
          <label className="form-label">Amount in PKR</label>
          <input
            type="number"
            className={`form-input${errors.monthlyCapacity ? ' error' : ''}`}
            value={form.monthlyCapacity || ''}
            min={1000}
            placeholder="e.g. 50000"
            onChange={e => update({ monthlyCapacity: Number(e.target.value) })}
            data-testid="input-monthly-capacity"
          />
          {errors.monthlyCapacity
            ? <div className="form-error">{errors.monthlyCapacity}</div>
            : <div className="form-hint">Minimum PKR 1,000 | This filters products by minimum investment</div>
          }
        </div>
      </div>

      <div className="card mb-24">
        <div className="card-title">Liquidity Preference</div>
        <div className="radio-group">
          {liquidityOptions.map(opt => (
            <label
              key={opt.value}
              className={`radio-option${form.liquidityPreference === opt.value ? ' selected' : ''}`}
              data-testid={`radio-liquidity-${opt.value}`}
            >
              <input
                type="radio"
                name="liquidityPreference"
                value={opt.value}
                checked={form.liquidityPreference === opt.value}
                onChange={() => update({ liquidityPreference: opt.value as UserProfile['liquidityPreference'] })}
              />
              <div className="radio-option-content">
                <span className="radio-option-label">{opt.label}</span>
                <span className="radio-option-desc">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.liquidityPreference && <div className="form-error" style={{ marginTop: 8 }}>{errors.liquidityPreference}</div>}
      </div>

      <div className="card mb-24">
        <div className="card-title">Investment Goals</div>
        <div className="goal-chips">
          {GOALS.map(goal => (
            <button
              type="button"
              key={goal}
              className={`goal-chip${form.investmentGoal.includes(goal) ? ' selected' : ''}`}
              onClick={() => toggleGoal(goal)}
              data-testid={`chip-goal-${goal.toLowerCase().replace(/\s/g, '-')}`}
            >
              {goal}
            </button>
          ))}
        </div>
        <div className="form-hint" style={{ marginTop: 8 }}>Select all that apply (optional)</div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full" data-testid="btn-save-profile">
        {saved ? '✓ Profile Saved!' : 'Save Financial Profile'}
      </button>
    </form>
  );
}
