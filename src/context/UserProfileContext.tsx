import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { FinancialProduct } from '../data/products';

export interface UserProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive' | '';
  investmentHorizon: 'short' | 'medium' | 'long' | '';
  monthlyCapacity: number;
  liquidityPreference: 'easy' | 'moderate' | 'locked' | '';
  investmentGoal: string[];
}

export const defaultProfile: UserProfile = {
  riskTolerance: '',
  investmentHorizon: '',
  monthlyCapacity: 0,
  liquidityPreference: '',
  investmentGoal: [],
};

interface UserProfileContextValue {
  profile: UserProfile;
  updateProfile: (p: UserProfile) => void;
  isProfileComplete: () => boolean;
  getRecommendations: (products: FinancialProduct[]) => FinancialProduct[];
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('fintech_profile');
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    localStorage.setItem('fintech_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const isProfileComplete = () => {
    return !!(
      profile.riskTolerance &&
      profile.investmentHorizon &&
      profile.monthlyCapacity > 0 &&
      profile.liquidityPreference
    );
  };

  const getRecommendations = (products: FinancialProduct[]): FinancialProduct[] => {
    if (!isProfileComplete()) return [];

    const riskMapping: Record<string, FinancialProduct['riskLevel'][]> = {
      conservative: ['low'],
      moderate: ['low', 'medium'],
      aggressive: ['low', 'medium', 'high'],
    };

    const horizonMapping: Record<string, FinancialProduct['timeHorizon'][]> = {
      short: ['short'],
      medium: ['short', 'medium'],
      long: ['short', 'medium', 'long'],
    };

    const liquidityMapping: Record<string, FinancialProduct['liquidity'][]> = {
      easy: ['easy'],
      moderate: ['easy', 'moderate'],
      locked: ['easy', 'moderate', 'locked'],
    };

    const allowedRisk = riskMapping[profile.riskTolerance] || ['low'];
    const allowedHorizon = horizonMapping[profile.investmentHorizon] || ['short'];
    const allowedLiquidity = liquidityMapping[profile.liquidityPreference] || ['easy'];

    const affordable = products.filter(p => p.minInvestment <= profile.monthlyCapacity);

    const recommended = affordable.filter(p =>
      allowedRisk.includes(p.riskLevel) &&
      allowedHorizon.includes(p.timeHorizon) &&
      allowedLiquidity.includes(p.liquidity)
    );

    if (profile.riskTolerance === 'conservative') {
      return recommended.sort((a, b) => a.riskLevel.localeCompare(b.riskLevel) || a.expectedReturn - b.expectedReturn);
    }
    return recommended.sort((a, b) => b.expectedReturn - a.expectedReturn);
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, isProfileComplete, getRecommendations }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
