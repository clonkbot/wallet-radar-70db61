import { Wallet } from '../types';

interface WalletListProps {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onSelectWallet: (wallet: Wallet) => void;
}

export default function WalletList({ wallets, selectedWallet, onSelectWallet }: WalletListProps) {
  const formatPnL = (pnl: number) => {
    const prefix = pnl >= 0 ? '+' : '';
    if (Math.abs(pnl) >= 1000000) {
      return `${prefix}$${(pnl / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(pnl) >= 1000) {
      return `${prefix}$${(pnl / 1000).toFixed(1)}K`;
    }
    return `${prefix}$${pnl.toFixed(2)}`;
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div style={styles.container}>
      {wallets.map((wallet, index) => (
        <div
          key={wallet.address}
          onClick={() => onSelectWallet(wallet)}
          style={{
            ...styles.walletCard,
            ...(selectedWallet?.address === wallet.address ? styles.selected : {}),
            animationDelay: `${index * 0.05}s`,
          }}
        >
          <div style={styles.walletHeader}>
            <div style={styles.walletInfo}>
              <span style={styles.walletLabel}>{wallet.label}</span>
              <span style={styles.walletAddress}>{wallet.address}</span>
            </div>
            <div style={{
              ...styles.trackingBadge,
              background: wallet.isTracking ? 'rgba(0, 255, 136, 0.15)' : 'rgba(106, 106, 138, 0.15)',
              color: wallet.isTracking ? '#00ff88' : '#6a6a8a',
            }}>
              {wallet.isTracking ? 'TRACKING' : 'PAUSED'}
            </div>
          </div>

          <div style={styles.walletStats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>TOTAL PnL</span>
              <span style={{
                ...styles.statValue,
                color: wallet.totalPnL >= 0 ? '#00ff88' : '#ff3366',
                textShadow: wallet.totalPnL >= 0
                  ? '0 0 10px rgba(0, 255, 136, 0.5)'
                  : '0 0 10px rgba(255, 51, 102, 0.5)',
              }}>
                {formatPnL(wallet.totalPnL)}
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>WIN RATE</span>
              <span style={{
                ...styles.statValue,
                color: wallet.winRate >= 50 ? '#00ff88' : '#ff3366',
              }}>
                {wallet.winRate.toFixed(1)}%
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>TRADES</span>
              <span style={{ ...styles.statValue, color: '#00d4ff' }}>
                {wallet.tradeCount}
              </span>
            </div>
          </div>

          <div style={styles.walletFooter}>
            <span style={styles.lastActive}>
              Last active: {timeAgo(wallet.lastActive)}
            </span>
            <div style={styles.activityBar}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.activityDot,
                    opacity: i < Math.min(10, Math.floor(wallet.tradeCount / 50)) ? 1 : 0.2,
                    background: i < 3 ? '#ff3366' : i < 7 ? '#ffcc00' : '#00ff88',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    overflow: 'auto',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  walletCard: {
    background: 'rgba(20, 20, 35, 0.6)',
    border: '1px solid #1a1a2e',
    borderRadius: '4px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'fadeInUp 0.3s ease forwards',
    opacity: 0,
  },
  selected: {
    borderColor: '#00ff88',
    background: 'rgba(0, 255, 136, 0.05)',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.1), inset 0 0 20px rgba(0, 255, 136, 0.02)',
  },
  walletHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  walletInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  walletLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#e0e0e0',
  },
  walletAddress: {
    fontSize: '0.7rem',
    color: '#6a6a8a',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  trackingBadge: {
    fontSize: '0.55rem',
    padding: '3px 6px',
    borderRadius: '2px',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  walletStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statLabel: {
    fontSize: '0.55rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
  },
  statValue: {
    fontSize: '0.85rem',
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  walletFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid #1a1a2e',
  },
  lastActive: {
    fontSize: '0.6rem',
    color: '#3a3a5a',
  },
  activityBar: {
    display: 'flex',
    gap: '2px',
  },
  activityDot: {
    width: '4px',
    height: '12px',
    borderRadius: '1px',
  },
};
