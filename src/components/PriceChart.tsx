import { useEffect, useState, useRef } from 'react';
import { Token } from '../types';

interface PriceChartProps {
  token: Token | null;
}

export default function PriceChart({ token }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; index: number } | null>(null);

  useEffect(() => {
    if (token) {
      setPriceHistory([...token.priceHistory]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const lastPrice = prev[prev.length - 1] || token.price;
        const change = (Math.random() - 0.48) * 0.02;
        const newPrice = lastPrice * (1 + change);
        return [...prev.slice(-99), newPrice];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !priceHistory.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const padding = { top: 20, right: 60, bottom: 30, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, width, height);

    const minPrice = Math.min(...priceHistory) * 0.995;
    const maxPrice = Math.max(...priceHistory) * 1.005;
    const priceRange = maxPrice - minPrice;

    const getX = (index: number) => padding.left + (index / (priceHistory.length - 1)) * chartWidth;
    const getY = (price: number) => padding.top + (1 - (price - minPrice) / priceRange) * chartHeight;

    ctx.strokeStyle = 'rgba(26, 26, 46, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = maxPrice - (i / 4) * priceRange;
      ctx.fillStyle = '#3a3a5a';
      ctx.font = '10px "IBM Plex Mono"';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(price), width - padding.right + 5, y + 3);
    }

    const isPositive = priceHistory[priceHistory.length - 1] >= priceHistory[0];
    const lineColor = isPositive ? '#00ff88' : '#ff3366';
    const gradientStart = isPositive ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 51, 102, 0.3)';
    const gradientEnd = 'rgba(0, 0, 0, 0)';

    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(priceHistory[0]));
    priceHistory.forEach((price, i) => {
      ctx.lineTo(getX(i), getY(price));
    });
    ctx.lineTo(getX(priceHistory.length - 1), height - padding.bottom);
    ctx.lineTo(getX(0), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(priceHistory[0]));
    priceHistory.forEach((price, i) => {
      ctx.lineTo(getX(i), getY(price));
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = lineColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const currentPrice = priceHistory[priceHistory.length - 1];
    const currentY = getY(currentPrice);
    const currentX = getX(priceHistory.length - 1);

    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (hoveredPoint) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#6a6a8a';
      ctx.lineWidth = 1;
      ctx.moveTo(hoveredPoint.x, padding.top);
      ctx.lineTo(hoveredPoint.x, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(hoveredPoint.x, hoveredPoint.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
    }
  }, [priceHistory, dimensions, hoveredPoint]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !priceHistory.length) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const { width, height } = dimensions;
    const padding = { top: 20, right: 60, bottom: 30, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const index = Math.round(((x - padding.left) / chartWidth) * (priceHistory.length - 1));
    if (index >= 0 && index < priceHistory.length) {
      const price = priceHistory[index];
      const minPrice = Math.min(...priceHistory) * 0.995;
      const maxPrice = Math.max(...priceHistory) * 1.005;
      const priceRange = maxPrice - minPrice;
      const pointX = padding.left + (index / (priceHistory.length - 1)) * chartWidth;
      const pointY = padding.top + (1 - (price - minPrice) / priceRange) * chartHeight;

      setHoveredPoint({ x: pointX, y: pointY, price, index });
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toExponential(2);
    if (price < 1) return price.toFixed(6);
    if (price < 100) return price.toFixed(4);
    return price.toFixed(2);
  };

  if (!token) {
    return (
      <div style={styles.container} ref={containerRef}>
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>&#9651;</span>
          <span>Select a token to view chart</span>
        </div>
      </div>
    );
  }

  const currentPrice = priceHistory[priceHistory.length - 1] || token.price;
  const startPrice = priceHistory[0] || token.price;
  const priceChangePercent = ((currentPrice - startPrice) / startPrice) * 100;

  return (
    <div style={styles.container} ref={containerRef}>
      <div style={styles.priceHeader}>
        <div style={styles.currentPrice}>
          <span style={styles.priceLabel}>CURRENT</span>
          <span style={styles.priceValue}>${formatPrice(currentPrice)}</span>
        </div>
        <div style={{
          ...styles.priceChange,
          color: priceChangePercent >= 0 ? '#00ff88' : '#ff3366',
        }}>
          {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
        </div>
      </div>

      {hoveredPoint && (
        <div style={{
          ...styles.tooltip,
          left: hoveredPoint.x,
          top: hoveredPoint.y - 40,
        }}>
          ${formatPrice(hoveredPoint.price)}
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={styles.canvas}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    position: 'relative',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  priceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  currentPrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  priceLabel: {
    fontSize: '0.6rem',
    color: '#3a3a5a',
    letterSpacing: '0.1em',
  },
  priceValue: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#e0e0e0',
    fontFamily: "'IBM Plex Mono', monospace",
    textShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
  },
  priceChange: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  canvas: {
    flex: 1,
    width: '100%',
    cursor: 'crosshair',
  },
  tooltip: {
    position: 'absolute',
    background: 'rgba(0, 212, 255, 0.9)',
    color: '#0a0a0f',
    padding: '4px 8px',
    borderRadius: '2px',
    fontSize: '0.7rem',
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    zIndex: 10,
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
    color: '#00d4ff',
    animation: 'pulse 2s infinite',
  },
};
