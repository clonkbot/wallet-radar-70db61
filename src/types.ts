export interface Wallet {
  address: string;
  label: string;
  totalPnL: number;
  tradeCount: number;
  winRate: number;
  lastActive: Date;
  isTracking: boolean;
}

export interface Trade {
  id: string;
  walletAddress: string;
  token: Token;
  type: 'BUY' | 'SELL';
  amount: number;
  value: number;
  price: number;
  timestamp: Date;
  pnl?: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  volume24h: number;
  liquidity: number;
  priceHistory: number[];
}

export interface PricePoint {
  time: number;
  price: number;
}
