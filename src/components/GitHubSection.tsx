import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Trophy, CalendarDays } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Contribution colour — violet-600, rich and visible against dark background
const USERNAME = "Waleed2660";
const CHART_COLOR = "7c3aed";

const LANGUAGE_COLORS: Record<string, string> = {
  Java: "#b07219",
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
  Kotlin: "#F18E33",
  Swift: "#ffac45",
  Go: "#00ADD8",
  Rust: "#dea584",
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
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatShortDate = (iso?: string | null) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatLongDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type CalendarDay = { date: string; count: number } | null;

const LEVEL_COLORS = [
  "bg-slate-900/10 dark:bg-white/15",
  "bg-violet-400/80 dark:bg-violet-800",
  "bg-violet-500 dark:bg-violet-700",
  "bg-violet-600 dark:bg-violet-600",
  "bg-violet-800 dark:bg-violet-400",
];

const levelFor = (count: number, max: number) => {
  if (count <= 0) return 0;
  if (max <= 0) return 1;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
};

// Groups the flat date->count map into Sunday-start weeks, padding the first
// and last week with nulls so every column has exactly 7 cells.
const buildWeeks = (calendar: Record<string, number>): CalendarDay[][] => {
  const dates = Object.keys(calendar).sort();
  if (!dates.length) return [];

  const weeks: CalendarDay[][] = [];
  let week: CalendarDay[] = [];

  const firstDow = new Date(`${dates[0]}T00:00:00Z`).getUTCDay();
  for (let i = 0; i < firstDow; i++) week.push(null);

  for (const date of dates) {
    week.push({ date, count: calendar[date] });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ContributionGraph = ({ calendar }: { calendar: Record<string, number> }) => {
  const allDates = useMemo(() => Object.keys(calendar).sort(), [calendar]);
  const latestDate = allDates[allDates.length - 1];

  const years = useMemo(() => {
    const set = new Set(allDates.map((d) => d.slice(0, 4)));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [allDates]);

  // "" = trailing 12 months ending on the latest available day (default,
  // matches the GitHub profile graph); a specific year shows Jan-Dec of it.
  const [selectedYear, setSelectedYear] = useState("");

  const filteredCalendar = useMemo(() => {
    if (!latestDate) return calendar;
    if (selectedYear) {
      return Object.fromEntries(
        Object.entries(calendar).filter(([date]) => date.startsWith(selectedYear))
      );
    }
    const cutoff = new Date(`${latestDate}T00:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() - 371);
    return Object.fromEntries(
      Object.entries(calendar).filter(([date]) => new Date(`${date}T00:00:00Z`) >= cutoff)
    );
  }, [calendar, latestDate, selectedYear]);

  const weeks = useMemo(() => buildWeeks(filteredCalendar), [filteredCalendar]);
  const max = useMemo(() => Math.max(0, ...Object.values(filteredCalendar)), [filteredCalendar]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(weeks.length);

  // Cell + gap sizing must match the classes below (w-3 = 12px, gap-1 = 4px).
  const CELL_PX = 12;
  const GAP_PX = 4;
  const DAY_LABEL_PX = 32; // w-8 reserved for the Sun/Tue/Thu/Sat column

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recompute = (width: number) => {
      const available = width - DAY_LABEL_PX;
      const fit = Math.max(1, Math.floor((available + GAP_PX) / (CELL_PX + GAP_PX)));
      setVisibleCount(fit);
    };

    recompute(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => recompute(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Always keep the most recent weeks in view, dropping older ones off the
  // left edge instead of shrinking cells or scrolling — the latest day is
  // always visible without any user interaction.
  const visibleWeeks = useMemo(
    () => weeks.slice(Math.max(0, weeks.length - visibleCount)),
    [weeks, visibleCount]
  );

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;
    visibleWeeks.forEach((week, i) => {
      const firstDay = week.find((d) => d);
      if (!firstDay) return;
      const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();
      if (month !== lastMonth) {
        labels.push({ index: i, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    });
    // Drop a label that would visually collide with the next one (each
    // week column is 16px, a 3-letter month label needs ~3 columns).
    return labels.filter((m, i) => i === labels.length - 1 || labels[i + 1].index - m.index >= 3);
  }, [visibleWeeks]);

  if (!weeks.length) return null;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex justify-end mb-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="text-xs bg-transparent border border-slate-900/10 dark:border-white/15 rounded-lg px-2 py-1 text-slate-500 dark:text-white/60 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
        >
          <option value="">Last 12 months</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div ref={containerRef} className="w-full">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 pl-8 text-[11px] text-slate-400 dark:text-white/40">
            {visibleWeeks.map((_, i) => {
              const match = monthLabels.find((m) => m.index === i);
              return (
                <div key={i} className="w-3 flex-shrink-0 whitespace-nowrap">
                  {match ? match.label : ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2 text-[11px] text-slate-400 dark:text-white/40 justify-between">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>
            <div className="flex gap-1">
              {visibleWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) =>
                    day ? (
                      <Tooltip key={di}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm flex-shrink-0 ${LEVEL_COLORS[levelFor(day.count, max)]} hover:ring-1 hover:ring-slate-400 dark:hover:ring-white/50 transition-all cursor-default`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {day.count} contribution{day.count === 1 ? "" : "s"} on{" "}
                          {formatLongDate(day.date)}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div key={di} className="w-3 h-3 flex-shrink-0" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

const GitHubSection = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [calendar, setCalendar] = useState<Record<string, number> | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/github-stats.json")
      .then((r) => r.json())
      .then((data: GitHubStats) => setStats(data))
      .catch(() => {});

    fetch("/github-calendar.json")
      .then((r) => r.json())
      .then((data: { calendar: Record<string, number> }) => setCalendar(data.calendar))
      .catch(() => {});
  }, []);

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">GitHub</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Stats */}
          <div className="glass-strong rounded-3xl p-8 hover:scale-[1.02] hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all duration-500 flex flex-col">
            <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-5">
              Stats
            </p>
            <div className="grid grid-cols-3 gap-4 text-center flex-1 content-center">
              <div className="glass rounded-2xl py-6 px-2">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {stats ? stats.stars : "N/A"}
                </div>
                <div className="text-slate-500 dark:text-white/50 text-xs mt-1">Stars</div>
              </div>
              <div className="glass rounded-2xl py-6 px-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  {stats ? stats.followers : "N/A"}
                </div>
                <div className="text-slate-500 dark:text-white/50 text-xs mt-1">Followers</div>
              </div>
              <div className="glass rounded-2xl py-6 px-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  {stats ? stats.public_repos : "N/A"}
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
                  <div
                    key={i}
                    className="h-4 bg-slate-900/5 dark:bg-white/10 rounded-full animate-pulse"
                  />
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
                          style={{ background: LANGUAGE_COLORS[name] ?? "#888" }}
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
                          background: LANGUAGE_COLORS[name] ?? "#888",
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
          <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-5">
            Streak
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-900/10 dark:divide-white/10">
            <div className="flex flex-col items-center text-center gap-2 pb-5 sm:pb-0 sm:pr-4">
              <CalendarDays className="w-5 h-5 text-slate-400 dark:text-white/40" />
              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats?.streak ? stats.streak.totalContributions.toLocaleString() : "N/A"}
              </div>
              <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wide">
                Total Contributions
              </div>
              {stats?.streak?.since && (
                <div className="text-slate-400 dark:text-white/30 text-[11px]">
                  Since {formatDate(stats.streak.since)}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center text-center gap-2 py-5 sm:py-0 sm:px-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.streak ? stats.streak.currentStreak : "N/A"}
              </div>
              <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wide">
                Current Streak
              </div>
              <div className="text-slate-400 dark:text-white/30 text-[11px]">
                {stats?.streak?.currentStreak
                  ? `${formatShortDate(stats.streak.currentStreakStart)} – Present`
                  : "No active streak"}
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2 pt-5 sm:pt-0 sm:pl-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats?.streak ? stats.streak.longestStreak : "N/A"}
              </div>
              <div className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-wide">
                Longest Streak
              </div>
              {stats?.streak?.longestStreakStart && (
                <div className="text-slate-400 dark:text-white/30 text-[11px]">
                  {formatShortDate(stats.streak.longestStreakStart)} –{" "}
                  {formatShortDate(stats.streak.longestStreakEnd)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width Contribution Graph — native SVG-free grid rendered from
            calendar data in github-stats.json (same source as the Streak
            card), replacing the ghchart.rshah.org badge image so each day
            cell can show its contribution count on hover. */}
        <div
          ref={chartRef}
          className="glass-strong rounded-3xl p-8 mt-6 hover:scale-[1.02] hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all duration-500"
        >
          <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest mb-4">
            Contribution Graph
          </p>
          {calendar ? (
            <ContributionGraph calendar={calendar} />
          ) : (
            <img
              src={`https://ghchart.rshah.org/${CHART_COLOR}/${USERNAME}`}
              alt="GitHub contribution graph"
              width="800"
              height="128"
              loading="lazy"
              className="w-full rounded-xl opacity-75 hover:opacity-100 transition-opacity duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.display = "none";
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;
