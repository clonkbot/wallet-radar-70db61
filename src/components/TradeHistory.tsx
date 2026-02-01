import { useState, useEffect } from 'react';
import { Trade, Token } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
  onSelectToken: (token: Token) => void;
}

export default function TradeHistory({ trades, onSelectToken }: TradeHistoryProps) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (trades.length > 0) {
      const latestId = trades[0].id;
      setHighlightedId(latestId);
      const timeout = setTimeout(() => setHighlightedId(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [trades]);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toLocaleString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.tableHeader}>
        <span style={{ ...styles.headerCell, width: '70px' }}>TIME</span>
        <span style={{ ...styles.headerCell, width: '90px' }}>WALLET</span>
        <span style={{ ...styles.headerCell, width: '50px' }}>TYPE</span>
        <span style={{ ...styles.headerCell, flex: 1 }}>TOKEN</span>
        <span style={{ ...styles.headerCell, width: '80px', textAlign: 'right' }}>AMOUNT</span>
        <span style={{ ...styles.headerCell, width: '80px', textAlign: 'right' }}>VALUE</span>
        <span style={{ ...styles.headerCell, width: '70px', textAlign: 'right' }}>PnL</span>
      </div>

      <div style={styles.tableBody}>
        {trades.map((trade) => (
          <div
            key={trade.id}
            onClick={() => onSelectToken(trade.token)}
            style={{
              ...styles.row,
              ...(highlightedId === trade.id ? styles.highlighted : {}),
              borderLeftColor: trade.type === 'BUY' ? '#00ff88' : '#ff3366',
            }}
          >
            <span style={{ ...styles.cell, width: '70px', color: '#6a6a8a' }}>
              {formatTime(trade.timestamp)}
            </span>
            <span style={{ ...styles.cell, width: '90px', fontFamily: "'IBM Plex Mono', monospace" }}>
              {trade.walletAddress.slice(0, 8)}...
            </span>
            <span style={{
              ...styles.cell,
              width: '50px',
              color: trade.type === 'BUY' ? '#00ff88' : '#ff3366',
              fontWeight: 700,
            }}>
              {trade.type}
            </span>
            <div style={{ ...styles.cell, flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={styles.tokenSymbol}>{trade.token.symbol}</span>
              <span style={styles.tokenName}>{trade.token.name}</span>
            </div>
            <span style={{ ...styles.cell, width: '80px', textAlign: 'right' }}>
              {formatAmount(trade.amount)}
            </span>
            <span style={{ ...styles.cell, width: '80px', textAlign: 'right', color: '#00d4ff' }}>
              {formatValue(trade.value)}
            </span>
            <span style={{
              ...styles.cell,
              width: '70px',
              textAlign: 'right',
              color: trade.pnl !== undefined
                ? (trade.pnl >= 0 ? '#00ff88' : '#ff3366')
                : '#3a3a5a',
            }}>
              {trade.pnl !== undefined
                ? `${trade.pnl >= 0 ? '+' : ''}${formatValue(trade.pnl)}`
                : '—'}
            </span>
          </div>
        ))}

        {trades.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>&#9673;</div>
            <span>Waiting for trades...</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    padding: '8px 12px',
    borderBottom: '1px solid #1a1a2e',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  headerCell: {
    fontSize: '0.6rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  tableBody: {
    flex: 1,
    overflow: 'auto',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid rgba(26, 26, 46, 0.5)',
    borderLeft: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    animation: 'fadeInUp 0.3s ease',
  },
  highlighted: {
    background: 'rgba(0, 255, 136, 0.1)',
    animation: 'glitch 0.2s ease',
  },
  cell: {
    fontSize: '0.75rem',
    color: '#e0e0e0',
  },
  tokenSymbol: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#e0e0e0',
    padding: '2px 6px',
    background: 'rgba(0, 212, 255, 0.1)',
    borderRadius: '2px',
  },
  tokenName: {
    fontSize: '0.65rem',
    color: '#6a6a8a',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
    color: '#3a3a5a',
    fontSize: '0.8rem',
  },
  emptyIcon: {
    fontSize: '2rem',
    animation: 'pulse 2s infinite',
    color: '#00ff88',
  },
};
