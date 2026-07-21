import { useTheme } from '@/hooks/use-theme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

const ThemeToggle = ({ className = '', size = 'md' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const w = size === 'sm' ? 56 : 72;
  const h = size === 'sm' ? 28 : 36;
  const knobSize = size === 'sm' ? 22 : 28;
  const padding = (h - knobSize) / 2;
  const travel = w - knobSize - padding * 2;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${className}`}
      style={{ width: w, height: h, contain: 'layout style paint' }}
      data-theme-toggle
    >
      {/* Light sky background — always rendered, fades via opacity */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #87CEEB 0%, #5ba3d9 40%, #4a90d9 100%)',
          opacity: isDark ? 0 : 1,
          transition: 'opacity 450ms cubic-bezier(.4,0,.2,1)',
          willChange: 'opacity',
        }}
      />
      {/* Dark sky background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 40%, #2d3748 100%)',
          opacity: isDark ? 1 : 0,
          transition: 'opacity 450ms cubic-bezier(.4,0,.2,1)',
          willChange: 'opacity',
        }}
      />

      {/* Stars (visible in dark mode) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isDark ? 1 : 0,
          transition: 'opacity 450ms cubic-bezier(.4,0,.2,1)',
          willChange: 'opacity',
        }}
      >
        {[
          { x: '20%', y: '25%', s: 1.5 },
          { x: '35%', y: '60%', s: 1 },
          { x: '50%', y: '20%', s: 1.2 },
          { x: '65%', y: '55%', s: 0.8 },
          { x: '15%', y: '70%', s: 1 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: star.x, top: star.y, width: star.s, height: star.s, opacity: 0.7 }}
          />
        ))}
      </div>

      {/* Clouds — use transform only for GPU compositing */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          transform: isDark ? 'translate3d(0, 20%, 0)' : 'translate3d(0, 0, 0)',
          opacity: isDark ? 0.3 : 0.9,
          transition: 'transform 450ms cubic-bezier(.4,0,.2,1), opacity 450ms cubic-bezier(.4,0,.2,1)',
          willChange: 'transform, opacity',
        }}
      >
        <svg viewBox="0 0 72 16" className="w-full" preserveAspectRatio="none">
          <ellipse cx="12" cy="14" rx="10" ry="6" fill={isDark ? '#4a5568' : '#ffffff'} opacity="0.8" />
          <ellipse cx="28" cy="13" rx="12" ry="7" fill={isDark ? '#4a5568' : '#ffffff'} opacity="0.9" />
          <ellipse cx="48" cy="14" rx="11" ry="6" fill={isDark ? '#4a5568' : '#ffffff'} opacity="0.85" />
          <ellipse cx="64" cy="13" rx="10" ry="7" fill={isDark ? '#4a5568' : '#ffffff'} opacity="0.8" />
        </svg>
      </div>

      {/* Knob (Sun / Moon) — animated via translateX for 60fps */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: knobSize,
          height: knobSize,
          top: padding,
          left: padding,
          transform: isDark ? `translate3d(${travel}px, 0, 0)` : 'translate3d(0, 0, 0)',
          background: isDark
            ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 50%, #a0aec0 100%)'
            : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
          boxShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)'
            : '0 2px 12px rgba(251,191,36,0.5), inset 0 -2px 4px rgba(0,0,0,0.1)',
          transition: 'transform 450ms cubic-bezier(.4,0,.2,1), background 450ms cubic-bezier(.4,0,.2,1), box-shadow 450ms cubic-bezier(.4,0,.2,1)',
          willChange: 'transform',
        }}
      >
        {/* Moon craters */}
        <div
          className="absolute inset-0"
          style={{
            opacity: isDark ? 1 : 0,
            transition: 'opacity 400ms cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div className="absolute rounded-full" style={{ width: '30%', height: '30%', top: '20%', left: '55%', background: 'rgba(113,128,150,0.5)' }} />
          <div className="absolute rounded-full" style={{ width: '20%', height: '20%', top: '55%', left: '25%', background: 'rgba(113,128,150,0.4)' }} />
          <div className="absolute rounded-full" style={{ width: '15%', height: '15%', top: '45%', left: '60%', background: 'rgba(113,128,150,0.35)' }} />
        </div>

        {/* Sun glow */}
        <div
          className="absolute inset-[-4px]"
          style={{
            opacity: isDark ? 0 : 0.6,
            transition: 'opacity 400ms cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.4) 40%, transparent 70%)' }} />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
