import { useState, useEffect, useCallback } from 'react';
import WalletList from './components/WalletList';
import TradeHistory from './components/TradeHistory';
import PriceChart from './components/PriceChart';
import TokenInfo from './components/TokenInfo';
import Header from './components/Header';
import { Wallet, Trade, Token } from './types';
import { generateMockWallets, generateMockTrade, mockTokens } from './mockData';
import './styles.css';

function App() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const initialWallets = generateMockWallets(5);
    setWallets(initialWallets);
    setSelectedWallet(initialWallets[0]);
    setSelectedToken(mockTokens[0]);
  }, []);

  const addNewTrade = useCallback(() => {
    if (!wallets.length) return;

    const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
    const newTrade = generateMockTrade(randomWallet.address);

    setTrades(prev => [newTrade, ...prev].slice(0, 50));

    setWallets(prev => prev.map(w => {
      if (w.address === randomWallet.address) {
        const pnlChange = newTrade.type === 'BUY'
          ? -newTrade.value * 0.1
          : newTrade.value * (Math.random() * 0.5 - 0.1);
        return {
          ...w,
          totalPnL: w.totalPnL + pnlChange,
          tradeCount: w.tradeCount + 1,
          lastActive: new Date()
        };
      }
      return w;
    }));
  }, [wallets]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(addNewTrade, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isLive, addNewTrade]);

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
  };

  return (
    <div className="app">
      <div className="scanlines" />
      <div className="noise" />

      <Header isLive={isLive} onToggleLive={() => setIsLive(!isLive)} />

      <main className="main-grid">
        <section className="panel wallet-panel">
          <div className="panel-header">
            <span className="panel-indicator" />
            <h2>TRACKED WALLETS</h2>
            <span className="data-count">{wallets.length}</span>
          </div>
          <WalletList
            wallets={wallets}
            selectedWallet={selectedWallet}
            onSelectWallet={setSelectedWallet}
          />
        </section>

        <section className="panel chart-panel">
          <div className="panel-header">
            <span className="panel-indicator cyan" />
            <h2>PRICE ACTION</h2>
            {selectedToken && <span className="token-badge">{selectedToken.symbol}</span>}
          </div>
          <PriceChart token={selectedToken} />
        </section>

        <section className="panel token-panel">
          <div className="panel-header">
            <span className="panel-indicator magenta" />
            <h2>TOKEN METRICS</h2>
          </div>
          <TokenInfo token={selectedToken} />
        </section>

        <section className="panel trades-panel">
          <div className="panel-header">
            <span className="panel-indicator" />
            <h2>LIVE TRADES</h2>
            <span className="live-dot" />
          </div>
          <TradeHistory
            trades={trades}
            onSelectToken={handleSelectToken}
          />
        </section>
      </main>

      <footer className="footer">
        <span>Requested by @blugati · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
