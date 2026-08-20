import { useEffect, useRef, useState } from 'react';
import { Flame, Trophy, CalendarDays } from 'lucide-react';

// Contribution colour — violet-600, rich and visible against dark background
const USERNAME = 'Waleed2660';
const CHART_COLOR = '7c3aed';

const LANGUAGE_COLORS: Record<string, string> = {
  Java: '#b07219',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  Kotlin: '#F18E33',
  Swift: '#ffac45',
  Go: '#00ADD8',
  Rust: '#dea584',
};

interface Language {
  name: string;
  percentage: number;
}

interface StreakStats {
  totalContributions: number;
  since?: string;
  currentStreak: number;
  currentStreakStart?: string | null;
  currentStreakEnd?: string | null;
  longestStreak: number;
  longestStreakStart?: string | null;
  longestStreakEnd?: string | null;
}

interface GitHubStats {
  followers: number;
  public_repos: number;
  stars: number;
  languages: Language[];
  streak?: StreakStats;
}

const formatDate = (iso?: string | null) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatShortDate = (iso?: string | null) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const GitHubSection = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/github-stats.json')
      .then((r) => r.json())
      .then((data: GitHubStats) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">
          GitHub
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Stats */}
          <div className="glass-strong rounded-3xl p-8 hover:scale-[1.02] hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all duration-500 flex flex-col">
            <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-5">Stats</p>
            <div className="grid grid-cols-3 gap-4 text-center flex-1 content-center">
              <div className="glass rounded-2xl py-6 px-2">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {stats ? stats.stars : 'N/A'}
                </div>
                <div className="text-slate-500 dark:text-white/50 text-xs mt-1">Stars</div>
              </div>
              <div className="glass rounded-2xl py-6 px-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  {stats ? stats.followers : 'N/A'}
                </div>
                <div className="text-slate-500 dark:text-white/50 text-xs mt-1">Followers</div>
              </div>
              <div className="glass rounded-2xl py-6 px-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  {stats ? stats.public_repos : 'N/A'}
                </div>
                <div className="text-slate-500 dark:text-white/50 text-xs mt-1">Repos</div>
              </div>
            </div>
          </div>

          {/* Right: Top Languages */}
          <div className="glass-strong rounded-3xl p-8 hover:scale-[1.02] hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all duration-500">
            <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-5">
              Top Languages
            </p>
            {!stats ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-900/5 dark:bg-white/10 rounded-full animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats.languages.map(({ name, percentage }) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-700 dark:text-white/80 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                          style={{ background: LANGUAGE_COLORS[name] ?? '#888' }}
                        />
                        {name}
                      </span>
                      <span className="text-slate-400 dark:text-white/40">{percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          background: LANGUAGE_COLORS[name] ?? '#888',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full-width Streak card — computed server-side (see
            scripts/update_github_stats.py) by reading GitHub's own public
            contribution calendar and rendered natively, rather than embedding
            the third-party streak-stats.demolab.com badge (a free Heroku app
            prone to downtime/rate-limiting, which is what broke it before). */}
        <div className="glass-strong rounded-3xl p-8 mt-6 hover:scale-[1.02] hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all duration-500">
          <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-5">Streak</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-900/10 dark:divide-white/10">
            <div className="flex flex-col items-center text-center gap-2 pb-5 sm:pb-0 sm:pr-4">
              <CalendarDays className="w-5 h-5 text-slate-400 dark:text-white/40" />
              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats?.streak ? stats.streak.totalContributions.toLocaleString() : 'N/A'}
              </div>
              <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wide">Total Contributions</div>
              {stats?.streak?.since && (
                <div className="text-slate-400 dark:text-white/30 text-[11px]">
                  Since {formatDate(stats.streak.since)}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center text-center gap-2 py-5 sm:py-0 sm:px-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.streak ? stats.streak.currentStreak : 'N/A'}
              </div>
              <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wide">Current Streak</div>
              <div className="text-slate-400 dark:text-white/30 text-[11px]">
                {stats?.streak?.currentStreak
                  ? `${formatShortDate(stats.streak.currentStreakStart)} – Present`
                  : 'No active streak'}
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 pt-5 sm:pt-0 sm:pl-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats?.streak ? stats.streak.longestStreak : 'N/A'}
              </div>
              <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wide">Longest Streak</div>
              {stats?.streak?.longestStreakStart && (
                <div className="text-slate-400 dark:text-white/30 text-[11px]">
                  {formatShortDate(stats.streak.longestStreakStart)} – {formatShortDate(stats.streak.longestStreakEnd)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width Contribution Graph */}
        <div ref={chartRef} className="glass-strong rounded-3xl p-8 mt-6 hover:scale-[1.02] hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all duration-500">
          <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-4">
            Contribution Graph
          </p>
          <img
            src={`https://ghchart.rshah.org/${CHART_COLOR}/${USERNAME}`}
            alt="GitHub contribution graph"
            width="800"
            height="128"
            loading="lazy"
            className="w-full rounded-xl opacity-75 hover:opacity-100 transition-opacity duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;
