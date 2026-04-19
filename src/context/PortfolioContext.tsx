import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { FinancialProduct } from '../data/products';

export interface PortfolioItem {
  product: FinancialProduct;
  allocatedAmount: number;
}

export interface Portfolio {
  items: PortfolioItem[];
  totalInvested: number;
  weightedReturn: number;
  riskDistribution: { low: number; medium: number; high: number };
  categoryDistribution: Record<string, number>;
  diversificationScore: number;
}

const emptyPortfolio: Portfolio = {
  items: [],
  totalInvested: 0,
  weightedReturn: 0,
  riskDistribution: { low: 0, medium: 0, high: 0 },
  categoryDistribution: {},
  diversificationScore: 0,
};

function calculatePortfolioStats(items: PortfolioItem[]): Portfolio {
  if (items.length === 0) return emptyPortfolio;

  const totalInvested = items.reduce((sum, item) => sum + item.allocatedAmount, 0);
  if (totalInvested === 0) return { ...emptyPortfolio, items };

  const weightedReturn = items.reduce((sum, item) => {
    return sum + (item.allocatedAmount / totalInvested) * item.product.expectedReturn;
  }, 0);

  const riskTotals = items.reduce((acc, item) => {
    acc[item.product.riskLevel] = (acc[item.product.riskLevel] || 0) + item.allocatedAmount;
    return acc;
  }, {} as Record<string, number>);

  const riskDistribution = {
    low: parseFloat(((riskTotals.low || 0) / totalInvested * 100).toFixed(1)),
    medium: parseFloat(((riskTotals.medium || 0) / totalInvested * 100).toFixed(1)),
    high: parseFloat(((riskTotals.high || 0) / totalInvested * 100).toFixed(1)),
  };

  const categoryTotals = items.reduce((acc, item) => {
    acc[item.product.category] = (acc[item.product.category] || 0) + item.allocatedAmount;
    return acc;
  }, {} as Record<string, number>);

  const categoryDistribution = Object.fromEntries(
    Object.entries(categoryTotals).map(([k, v]) => [k, parseFloat((v / totalInvested * 100).toFixed(1))]
    )
  );

  const uniqueCategories = new Set(items.map(i => i.product.category)).size;
  const uniqueRisks = new Set(items.map(i => i.product.riskLevel)).size;
  const highRiskPct = riskDistribution.high;
  const diversificationScore = Math.min(100, Math.round(
    (uniqueCategories / 4) * 40 + (uniqueRisks / 3) * 30 + (Math.max(0, 30 - highRiskPct))
  ));

  return {
    items,
    totalInvested,
    weightedReturn: parseFloat(weightedReturn.toFixed(2)),
    riskDistribution,
    categoryDistribution,
    diversificationScore,
  };
}

interface PortfolioContextValue {
  portfolio: Portfolio;
  addToPortfolio: (product: FinancialProduct, amount?: number) => void;
  removeFromPortfolio: (productId: string | number) => void;
  updateAllocation: (productId: string | number, newAmount: number) => void;
  isInPortfolio: (productId: string | number) => boolean;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    try {
      const stored = localStorage.getItem('fintech_portfolio');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fintech_portfolio', JSON.stringify(items));
  }, [items]);

  const portfolio = calculatePortfolioStats(items);

  const addToPortfolio = (product: FinancialProduct, amount?: number) => {
    const allocatedAmount = amount || product.minInvestment;
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev;
      return [...prev, { product, allocatedAmount }];
    });
  };

  const removeFromPortfolio = (productId: string | number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateAllocation = (productId: string | number, newAmount: number) => {
    setItems(prev => prev.map(i =>
      i.product.id === productId ? { ...i, allocatedAmount: newAmount } : i
    ));
  };

  const isInPortfolio = (productId: string | number) => {
    return items.some(i => i.product.id === productId);
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, addToPortfolio, removeFromPortfolio, updateAllocation, isInPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
