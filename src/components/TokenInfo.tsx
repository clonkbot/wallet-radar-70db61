import { useState, useEffect } from 'react';
import { Token } from '../types';

interface TokenInfoProps {
  token: Token | null;
}

export default function TokenInfo({ token }: TokenInfoProps) {
  const [animatedValues, setAnimatedValues] = useState({
    holders: 0,
    marketCap: 0,
    volume: 0,
    liquidity: 0,
  });

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      setAnimatedValues(prev => ({
        holders: token.holders + Math.floor((Math.random() - 0.3) * 10),
        marketCap: prev.marketCap + (Math.random() - 0.5) * token.marketCap * 0.001,
        volume: prev.volume + Math.random() * token.volume24h * 0.0001,
        liquidity: prev.liquidity + (Math.random() - 0.5) * token.liquidity * 0.001,
      }));
    }, 2000);

    setAnimatedValues({
      holders: token.holders,
      marketCap: token.marketCap,
      volume: token.volume24h,
      liquidity: token.liquidity,
    });

    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>&#9673;</span>
          <span>Select a token</span>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number, prefix = '') => {
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(1)}K`;
    return `${prefix}${num.toFixed(0)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    if (price < 100) return price.toFixed(4);
    return price.toFixed(2);
  };

  const metrics = [
    {
      label: 'MARKET CAP',
      value: formatNumber(animatedValues.marketCap, '$'),
      color: '#00d4ff',
      icon: '&#9670;',
    },
    {
      label: 'HOLDERS',
      value: formatNumber(animatedValues.holders),
      color: '#ff00aa',
      icon: '&#9673;',
    },
    {
      label: '24H VOLUME',
      value: formatNumber(animatedValues.volume, '$'),
      color: '#00ff88',
      icon: '&#9651;',
    },
    {
      label: 'LIQUIDITY',
      value: formatNumber(animatedValues.liquidity, '$'),
      color: '#ffcc00',
      icon: '&#9674;',
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.tokenHeader}>
        <div style={styles.tokenIcon}>
          {token.symbol.slice(0, 2)}
        </div>
        <div style={styles.tokenInfo}>
          <h3 style={styles.tokenSymbol}>{token.symbol}</h3>
          <span style={styles.tokenName}>{token.name}</span>
        </div>
        <div style={{
          ...styles.changeIndicator,
          background: token.priceChange24h >= 0
            ? 'rgba(0, 255, 136, 0.15)'
            : 'rgba(255, 51, 102, 0.15)',
          color: token.priceChange24h >= 0 ? '#00ff88' : '#ff3366',
        }}>
          {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
        </div>
      </div>

      <div style={styles.priceDisplay}>
        <span style={styles.priceLabel}>CURRENT PRICE</span>
        <span style={styles.priceValue}>${formatPrice(token.price)}</span>
      </div>

      <div style={styles.addressRow}>
        <span style={styles.addressLabel}>CONTRACT</span>
        <span style={styles.addressValue}>{token.address}</span>
      </div>

      <div style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            style={{
              ...styles.metricCard,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div style={styles.metricHeader}>
              <span
                style={{ ...styles.metricIcon, color: metric.color }}
                dangerouslySetInnerHTML={{ __html: metric.icon }}
              />
              <span style={styles.metricLabel}>{metric.label}</span>
            </div>
            <span style={{ ...styles.metricValue, color: metric.color }}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.activitySection}>
        <span style={styles.sectionLabel}>ACTIVITY PULSE</span>
        <div style={styles.activityBars}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                ...styles.activityBar,
                height: `${20 + Math.random() * 80}%`,
                background: `linear-gradient(to top, ${
                  i < 7 ? '#ff3366' : i < 14 ? '#ffcc00' : '#00ff88'
                }, transparent)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div style={styles.warningBadge}>
        <span style={styles.warningIcon}>&#9888;</span>
        <span>DYOR - Not Financial Advice</span>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflow: 'auto',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#3a3a5a',
    fontSize: '0.8rem',
  },
  emptyIcon: {
    fontSize: '2rem',
    color: '#ff00aa',
    animation: 'pulse 2s infinite',
  },
  tokenHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tokenIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #00d4ff33, #ff00aa33)',
    border: '1px solid #1a1a2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#e0e0e0',
  },
  tokenInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  tokenSymbol: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#e0e0e0',
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: '0.05em',
  },
  tokenName: {
    fontSize: '0.75rem',
    color: '#6a6a8a',
  },
  changeIndicator: {
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  priceDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    border: '1px solid #1a1a2e',
  },
  priceLabel: {
    fontSize: '0.6rem',
    color: '#3a3a5a',
    letterSpacing: '0.15em',
  },
  priceValue: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#00d4ff',
    fontFamily: "'IBM Plex Mono', monospace",
    textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
  },
  addressRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  addressLabel: {
    fontSize: '0.55rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
  },
  addressValue: {
    fontSize: '0.7rem',
    color: '#6a6a8a',
    fontFamily: "'IBM Plex Mono', monospace",
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '2px',
    border: '1px solid #1a1a2e',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  metricCard: {
    padding: '12px',
    background: 'rgba(20, 20, 35, 0.6)',
    borderRadius: '4px',
    border: '1px solid #1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    animation: 'fadeInUp 0.3s ease forwards',
    opacity: 0,
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metricIcon: {
    fontSize: '0.8rem',
  },
  metricLabel: {
    fontSize: '0.55rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
  },
  metricValue: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  activitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionLabel: {
    fontSize: '0.55rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
  },
  activityBars: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '3px',
    height: '40px',
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '2px',
  },
  activityBar: {
    flex: 1,
    borderRadius: '1px',
    animation: 'fadeInUp 0.5s ease forwards',
  },
  warningBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px',
    background: 'rgba(255, 204, 0, 0.1)',
    border: '1px solid rgba(255, 204, 0, 0.3)',
    borderRadius: '2px',
    fontSize: '0.6rem',
    color: '#ffcc00',
    letterSpacing: '0.05em',
    marginTop: 'auto',
  },
  warningIcon: {
    fontSize: '0.8rem',
  },
};
