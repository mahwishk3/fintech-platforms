export interface FinancialProduct {
  id: string | number;
  name: string;
  category: 'savings' | 'investment' | 'insurance' | 'crypto';
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'easy' | 'moderate' | 'locked';
  timeHorizon: 'short' | 'medium' | 'long';
  minInvestment: number;
  description: string;
  image?: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const categoryMapping: Record<string, FinancialProduct['category']> = {
  "electronics": "investment",
  "jewelery": "savings",
  "men's clothing": "insurance",
  "women's clothing": "crypto",
};

const riskMapping: Record<FinancialProduct['category'], FinancialProduct['riskLevel']> = {
  investment: 'medium',
  savings: 'low',
  insurance: 'low',
  crypto: 'high',
};

const liquidityMapping: Record<FinancialProduct['category'], FinancialProduct['liquidity']> = {
  savings: 'easy',
  investment: 'moderate',
  insurance: 'locked',
  crypto: 'easy',
};

const timeHorizonMapping: Record<FinancialProduct['riskLevel'], FinancialProduct['timeHorizon']> = {
  low: 'short',
  medium: 'medium',
  high: 'long',
};

const financialNames: Record<FinancialProduct['category'], string[]> = {
  savings: [
    'High-Yield Savings Account', 'Premium Savings Fund', 'Fixed Deposit Plus',
    'National Savings Certificate', 'Defense Savings Certificate', 'Pensioners Savings Plan',
  ],
  investment: [
    'Blue Chip Equity Fund', 'Growth Mutual Fund', 'Balanced Income Fund',
    'Technology Sector Fund', 'Dividend Yield Fund', 'Mid-Cap Growth Fund',
    'Infrastructure Bond Fund', 'Commodity Diversified Fund',
  ],
  insurance: [
    'Life Shield Insurance Plan', 'Endowment Savings Policy', 'Child Education Plan',
    'Whole Life Protection Plan', 'Term Insurance Plus', 'Unit-Linked Insurance Plan',
  ],
  crypto: [
    'Bitcoin Growth Token', 'Ethereum Staking Fund', 'DeFi Yield Strategy',
    'Stablecoin Liquidity Pool', 'Altcoin Diversified Basket', 'Web3 Innovation Index',
  ],
};

const financialDescriptions: Record<FinancialProduct['category'], string[]> = {
  savings: [
    'A government-backed savings instrument offering stable, guaranteed returns with full capital protection. Ideal for risk-averse investors seeking predictable income.',
    'A premium deposit account with competitive interest rates, offering full liquidity and capital security backed by a leading financial institution.',
    'A fixed-term deposit offering higher-than-standard rates in exchange for a committed investment period. SECP regulated and capital-protected.',
    'Government-issued national savings certificate with guaranteed returns, tax benefits, and full capital protection for conservative investors.',
    'Defense-backed savings certificate offering secure, predictable returns for capital preservation with government guarantee.',
    'A specially designed savings plan for pensioners offering monthly income, full capital protection, and easy liquidity.',
  ],
  investment: [
    'A diversified equity mutual fund investing in blue-chip companies listed on the PSX. Managed by experienced fund managers with strong long-term track records.',
    'A high-conviction growth mutual fund targeting mid- to large-cap equities with strong earnings momentum and value creation potential.',
    'A balanced fund combining equities and fixed income to deliver consistent returns while managing downside risk effectively.',
    'A sector-focused fund targeting technology and innovation companies, offering exposure to high-growth digital transformation trends.',
    'A dividend-focused fund investing in high-yield equities to provide regular income alongside capital appreciation.',
    'A mid-cap equity fund targeting emerging companies with significant growth potential and strong fundamentals.',
    'A bond fund investing in infrastructure projects and government-backed securities, balancing growth with stability.',
    'A diversified commodity fund providing exposure to gold, oil, and agricultural commodities as an inflation hedge.',
  ],
  insurance: [
    'A comprehensive life insurance plan combining protection with investment-linked returns. Provides family financial security with a maturity benefit.',
    'An endowment policy offering life coverage with a guaranteed maturity payout. Combines savings discipline with insurance protection.',
    'A child-focused plan designed to fund future education expenses, with an embedded insurance cover for parental security.',
    'A whole-life policy providing lifelong coverage with a cash value component that grows over time, usable as collateral.',
    'A term insurance plan offering high coverage at affordable premiums, providing pure financial protection for dependents.',
    'A unit-linked insurance plan (ULIP) combining market-linked investment returns with life insurance in a single flexible product.',
  ],
  crypto: [
    'A regulated Bitcoin-linked growth fund providing exposure to BTC price appreciation through a compliant investment vehicle.',
    'An Ethereum staking strategy that earns network validation rewards while maintaining exposure to ETH price growth.',
    'A curated DeFi yield strategy that allocates across decentralized lending protocols to maximize risk-adjusted returns.',
    'A stablecoin liquidity pool strategy earning trading fees and yield with minimal price volatility exposure.',
    'A diversified basket of top-20 altcoins by market cap, rebalanced monthly to capture broad crypto market upside.',
    'A thematic index fund tracking leading Web3, metaverse, and blockchain infrastructure projects globally.',
  ],
};

function deterministicReturn(riskLevel: FinancialProduct['riskLevel'], id: number): number {
  const seed = id % 10;
  if (riskLevel === 'low') return parseFloat((3 + seed * 0.4).toFixed(2));
  if (riskLevel === 'medium') return parseFloat((7 + seed * 0.5).toFixed(2));
  return parseFloat((12 + seed * 1.5).toFixed(2));
}

export function transformToFinancialProduct(apiProduct: ApiProduct): FinancialProduct {
  const category = categoryMapping[apiProduct.category] ?? 'investment';
  const riskLevel = riskMapping[category];
  const liquidity = liquidityMapping[category];
  const timeHorizon = timeHorizonMapping[riskLevel];
  const minInvestment = Math.round(apiProduct.price * 1000);
  const expectedReturn = deterministicReturn(riskLevel, apiProduct.id);

  const namePool = financialNames[category];
  const descPool = financialDescriptions[category];
  const idx = apiProduct.id % namePool.length;

  return {
    id: apiProduct.id,
    name: namePool[idx],
    category,
    description: descPool[idx],
    minInvestment,
    riskLevel,
    expectedReturn,
    liquidity,
    timeHorizon,
    image: apiProduct.image,
  };
}

export async function fetchFinancialProducts(): Promise<FinancialProduct[]> {
  const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: ApiProduct[] = await res.json();
  return data.map(transformToFinancialProduct);
}
