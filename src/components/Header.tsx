import { useState, useEffect } from 'react';

interface HeaderProps {
  isLive: boolean;
  onToggleLive: () => void;
}

export default function Header({ isLive, onToggleLive }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>&#9670;</span>
          <h1 style={styles.logo}>WALLET<span style={styles.logoAccent}>RADAR</span></h1>
        </div>
        <span style={styles.tagline}>Real-Time Wallet Intelligence</span>
      </div>

      <div style={styles.center}>
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>NETWORK</span>
          <span style={styles.statusValue}>SOLANA</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>BLOCK</span>
          <span style={styles.statusValue}>{(284729834 + Math.floor(time.getTime() / 400) % 1000).toLocaleString()}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>GAS</span>
          <span style={styles.statusValue}>0.000005 SOL</span>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.clock}>
          <span style={styles.clockLabel}>UTC</span>
          <span style={styles.clockTime}>
            {time.toUTCString().slice(17, 25)}
          </span>
        </div>
        <button
          onClick={onToggleLive}
          style={{
            ...styles.liveButton,
            background: isLive ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 51, 102, 0.15)',
            borderColor: isLive ? '#00ff88' : '#ff3366',
            color: isLive ? '#00ff88' : '#ff3366',
          }}
        >
          <span style={{
            ...styles.liveDot,
            background: isLive ? '#00ff88' : '#ff3366',
            boxShadow: isLive ? '0 0 8px #00ff88' : '0 0 8px #ff3366',
          }} />
          {isLive ? 'LIVE' : 'PAUSED'}
        </button>
      </div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid #1a1a2e',
    background: 'rgba(10, 10, 15, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    color: '#00ff88',
    fontSize: '1.2rem',
    textShadow: '0 0 10px #00ff88',
  },
  logo: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#e0e0e0',
  },
  logoAccent: {
    color: '#00ff88',
    textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
  },
  tagline: {
    fontSize: '0.6rem',
    color: '#6a6a8a',
    letterSpacing: '0.2em',
    paddingLeft: '28px',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  statusLabel: {
    fontSize: '0.55rem',
    color: '#3a3a5a',
    letterSpacing: '0.15em',
  },
  statusValue: {
    fontSize: '0.75rem',
    color: '#00d4ff',
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  divider: {
    width: '1px',
    height: '24px',
    background: '#1a1a2e',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  clock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  clockLabel: {
    fontSize: '0.55rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
  },
  clockTime: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  liveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: '1px solid',
    borderRadius: '4px',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    animation: 'blink 1s infinite',
  },
};
