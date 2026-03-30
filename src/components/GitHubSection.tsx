import { useEffect, useRef, useState } from "react";

// Contribution colour — violet-600, rich and visible against dark background
const USERNAME = "Waleed2660";
const CHART_COLOR = "7c3aed";
// Empty cell colour used by ghchart in inline styles
const EMPTY_CELL_COLOR = "#EEEEEE";

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

interface GitHubStats {
  followers: number;
  public_repos: number;
  stars: number;
  languages: Language[];
}

const GitHubSection = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [chartSvg, setChartSvg] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/github-stats.json')
      .then((r) => r.json())
      .then((data: GitHubStats) => setStats(data))
      .catch(() => {});

    // Lazy-load chart only when section scrolls into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          fetch(`https://ghchart.rshah.org/${CHART_COLOR}/${USERNAME}`)
            .then((r) => r.text())
            .then((svg) => {
              const modified = svg
                .split(`fill:${EMPTY_CELL_COLOR}`)
                .join(`fill:#14112a`);
              setChartSvg(modified);
            })
            .catch(() => {});
        }
      },
      { threshold: 0.1 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">
          GitHub 🐙
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Stats */}
          <div className="glass-strong rounded-3xl p-8 hover:scale-[1.02] hover:bg-white/10 transition-all duration-500">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-5">Stats</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass rounded-2xl py-4 px-2">
                <div className="text-2xl font-bold text-yellow-300">
                  {stats ? stats.stars : "—"}
                </div>
                <div className="text-white/50 text-xs mt-1">Stars</div>
              </div>
              <div className="glass rounded-2xl py-4 px-2">
                <div className="text-2xl font-bold text-blue-300">
                  {stats ? stats.followers : "—"}
                </div>
                <div className="text-white/50 text-xs mt-1">Followers</div>
              </div>
              <div className="glass rounded-2xl py-4 px-2">
                <div className="text-2xl font-bold text-purple-300">
                  {stats ? stats.public_repos : "—"}
                </div>
                <div className="text-white/50 text-xs mt-1">Repos</div>
              </div>
            </div>

            {/* Streak stats */}
            <div className="mt-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Streak</p>
              <img
                src="https://streak-stats.demolab.com?user=Waleed2660&theme=transparent&hide_border=true&stroke=ffffff20&ring=818cf8&fire=818cf8&currStreakLabel=ffffff99&sideLabels=ffffff99&currStreakNum=ffffff&sideNums=ffffff&dates=ffffff40&background=00000000"
                alt="GitHub streak stats"
                width="800"
                height="200"
                className="w-full rounded-xl opacity-90 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Right: Top Languages */}
          <div className="glass-strong rounded-3xl p-8 hover:scale-[1.02] hover:bg-white/10 transition-all duration-500">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-5">
              Top Languages
            </p>
            {!stats ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-white/10 rounded-full animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats.languages.map(({ name, percentage }) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                          style={{ background: LANGUAGE_COLORS[name] ?? "#888" }}
                        />
                        {name}
                      </span>
                      <span className="text-white/40">{percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
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

        {/* Full-width Contribution Graph */}
        <div ref={chartRef} className="glass-strong rounded-3xl p-8 mt-6 hover:scale-[1.02] hover:bg-white/10 transition-all duration-500">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
            Contribution Graph
          </p>
          {chartSvg ? (
            <div
              className="w-full rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 [&_svg]:w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: chartSvg }}
            />
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
