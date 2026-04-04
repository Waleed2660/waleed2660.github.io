import { useEffect, useState } from 'react';
import { X, GitCommit, Code2, Clock, Terminal } from 'lucide-react';

interface SiteStatsProps {
  open: boolean;
  onClose: () => void;
}

const buildTime = new Date(__BUILD_TIME__);
const timeAgo = () => {
  const diff = Math.floor((Date.now() - buildTime.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const stats = [
  {
    icon: <GitCommit className="w-4 h-4" />,
    label: 'Commits',
    value: __GIT_COMMITS__.toLocaleString(),
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    label: 'Lines of code',
    value: __LINES_OF_CODE__.toLocaleString(),
  },
  {
    icon: <Clock className="w-4 h-4" />,
    label: 'Last built',
    value: buildTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    sub: timeAgo(),
  },
];

const SiteStats = ({ open, onClose }: SiteStatsProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  if (!open && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end justify-center pb-10 sm:items-center transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      onTransitionEnd={() => { if (!open) setVisible(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative z-10 rounded-2xl p-6 w-full max-w-sm mx-4 transition-all duration-300 ${open ? 'translate-y-0 scale-100' : 'translate-y-6 scale-95'}`}
        style={{ background: 'rgba(12,12,28,0.92)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white/60">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-mono font-medium">site.stats</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white/40">
                {s.icon}
                <span className="text-sm">{s.label}</span>
              </div>
              <div className="text-right">
                <span className="text-white/90 text-sm font-mono font-medium">{s.value}</span>
                {s.sub && <span className="block text-white/30 text-xs font-mono">{s.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-5 pt-4 border-t border-white/5 text-white/20 text-xs font-mono text-center">
          press <kbd className="px-1 py-0.5 rounded bg-white/8 text-white/30">`</kbd> to toggle
        </p>
      </div>
    </div>
  );
};

export default SiteStats;
