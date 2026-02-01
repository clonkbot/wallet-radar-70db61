import { Wallet, Trade, Token } from './types';

const walletLabels = [
  'Whale Alpha',
  'Degen King',
  'Smart Money',
  'Copy This',
  'Moon Hunter',
  'Gem Finder',
  'Early Bird',
  'Insider',
];

export const mockTokens: Token[] = [
  {
    address: '0x1234...5678',
    symbol: 'PEPE',
    name: 'Pepe',
    price: 0.00001234,
    priceChange24h: 15.7,
    marketCap: 5200000000,
    holders: 234567,
    volume24h: 890000000,
    liquidity: 45000000,
    priceHistory: generatePriceHistory(0.00001234, 100),
  },
  {
    address: '0xABCD...EFGH',
    symbol: 'WIF',
    name: 'dogwifhat',
    price: 2.45,
    priceChange24h: -8.3,
    marketCap: 2400000000,
    holders: 156789,
    volume24h: 340000000,
    liquidity: 28000000,
    priceHistory: generatePriceHistory(2.45, 100),
  },
  {
    address: '0x9876...5432',
    symbol: 'BONK',
    name: 'Bonk',
    price: 0.0000234,
    priceChange24h: 42.1,
    marketCap: 1800000000,
    holders: 567890,
    volume24h: 560000000,
    liquidity: 32000000,
    priceHistory: generatePriceHistory(0.0000234, 100),
  },
  {
    address: '0xDEAD...BEEF',
    symbol: 'MOG',
    name: 'Mog Coin',
    price: 0.00000189,
    priceChange24h: -3.2,
    marketCap: 780000000,
    holders: 89012,
    volume24h: 120000000,
    liquidity: 15000000,
    priceHistory: generatePriceHistory(0.00000189, 100),
  },
  {
    address: '0xCAFE...BABE',
    symbol: 'BRETT',
    name: 'Brett',
    price: 0.156,
    priceChange24h: 28.9,
    marketCap: 1500000000,
    holders: 123456,
    volume24h: 280000000,
    liquidity: 22000000,
    priceHistory: generatePriceHistory(0.156, 100),
  },
];

function generatePriceHistory(currentPrice: number, points: number): number[] {
  const history: number[] = [];
  let price = currentPrice * (0.7 + Math.random() * 0.3);

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * 0.05;
    price = price * (1 + change);
    history.push(price);
  }

  history[history.length - 1] = currentPrice;
  return history;
}

export function generateMockWallets(count: number): Wallet[] {
  return Array.from({ length: count }, (_, i) => ({
    address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    label: walletLabels[i % walletLabels.length],
    totalPnL: (Math.random() - 0.3) * 500000,
    tradeCount: Math.floor(Math.random() * 500) + 50,
    winRate: 45 + Math.random() * 35,
    lastActive: new Date(Date.now() - Math.random() * 3600000),
    isTracking: true,
  }));
}

export function generateMockTrade(walletAddress: string): Trade {
  const token = mockTokens[Math.floor(Math.random() * mockTokens.length)];
  const type = Math.random() > 0.45 ? 'BUY' : 'SELL';
  const amount = Math.floor(Math.random() * 10000000) + 100000;
  const value = amount * token.price;

  return {
    id: Math.random().toString(36).slice(2),
    walletAddress,
    token,
    type,
    amount,
    value,
    price: token.price,
    timestamp: new Date(),
    pnl: type === 'SELL' ? (Math.random() - 0.3) * value * 0.5 : undefined,
  };
}
