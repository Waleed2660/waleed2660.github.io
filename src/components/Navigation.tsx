import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Home, Briefcase, Code2, Calendar, Mail, MoreHorizontal } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface NavigationProps {
  onSectionClick: (section: string) => void;
  activeSection: string;
}

const Navigation = ({ onSectionClick, activeSection }: NavigationProps) => {
  const sections = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "github", label: "GitHub" },
    { id: "tools", label: "Tech Stack" },
    { id: "research", label: "Education" },
    { id: "conferences", label: "Conferences" },
    { id: "currently", label: "Interests" },
    { id: "contact", label: "Contact" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const activeIndex = sections.findIndex((s) => s.id === activeSection);
    const activeBtn = buttonRefs.current[activeIndex];
    const container = containerRef.current;
    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setPillStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const mobileSections = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "experience", label: "Work", icon: <Briefcase className="w-5 h-5" /> },
    { id: "projects", label: "Projects", icon: <Code2 className="w-5 h-5" /> },
    { id: "conferences", label: "Events", icon: <Calendar className="w-5 h-5" /> },
    { id: "contact", label: "Contact", icon: <Mail className="w-5 h-5" /> },
  ];

  // Sections with no room in the bottom pill, reachable through the "More" sheet
  const overflowSections = sections.filter((s) => !mobileSections.some((m) => m.id === s.id));
  // Same primary/overflow split as mobile, but with the full (non-abbreviated) labels
  // used elsewhere on desktop — reused for the tablet-width nav below.
  const primarySections = sections.filter((s) => mobileSections.some((m) => m.id === s.id));
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = overflowSections.some((s) => s.id === activeSection);
  const [tabletMoreOpen, setTabletMoreOpen] = useState(false);

  // Whether the full (all-sections) top nav actually fits the viewport. Rather
  // than relying on a fixed Tailwind breakpoint — which doesn't know how wide
  // the label text actually renders — we measure the full nav's natural width
  // against the available space and fall back to the condensed "More" layout
  // whenever it wouldn't fit, at any resolution.
  const fullMeasureRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(true);

  useLayoutEffect(() => {
    const measureEl = fullMeasureRef.current;
    if (!measureEl) return;

    let rafId = 0;
    const recompute = () => {
      rafId = 0;
      // Keep in sync with the `max-w-[calc(100vw-2rem)]` constraint on the nav
      // container, plus a small safety margin.
      const available = window.innerWidth - 32;
      const needed = measureEl.scrollWidth;
      setIsCompact(needed > available);
    };
    // Both listeners below can fire multiple times for the same visual resize
    // (the window "resize" event and the ResizeObserver watching the measurer,
    // whose width also changes since it uses viewport-relative clamp() sizing).
    // Coalesce them into a single rAF-scheduled measurement so a continuous
    // window drag never does more than one forced layout read per frame.
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(recompute);
    };

    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(measureEl);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  useEffect(() => {
    if (!tabletMoreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTabletMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tabletMoreOpen]);

  return (
    <>
      {/* Hidden measurer — an off-screen clone of the full (all-sections) nav
          used purely to read its natural, unwrapped width via scrollWidth.
          This lets us decide whether the full nav actually fits the current
          viewport instead of guessing from a fixed Tailwind breakpoint, which
          leaves gaps where the real content still overflows into a
          horizontal scrollbar. */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none opacity-0"
        style={{ visibility: "hidden", zIndex: -1 }}
      >
        <div
          ref={fullMeasureRef}
          className="inline-flex items-center gap-x-[clamp(0.25rem,-0.8rem+1.6vw,0.5rem)] p-[clamp(0.375rem,-0.15rem+0.8vw,0.5rem)] w-max"
        >
          {sections.map((section) => (
            <span
              key={section.id}
              className="px-[clamp(0.75rem,-2.4rem+4.8vw,1.5rem)] py-[clamp(0.625rem,0.1rem+0.8vw,0.75rem)] text-[clamp(0.75rem,0.225rem+0.8vw,0.875rem)] font-medium whitespace-nowrap"
            >
              {section.label}
            </span>
          ))}
          <span className="h-8 w-px mx-1" />
          <span className="w-14 h-7" />
        </div>
      </div>

      {/* Desktop nav — shown whenever all sections plus the theme toggle
          actually fit in one row (measured live, not a fixed breakpoint).
          Sizing uses fluid clamp()-based padding/font-size so it shrinks
          continuously as the viewport narrows, instead of staying one fixed
          size and then jumping straight to the compact layout. The swap to
          the compact nav below is softened with an opacity crossfade. */}
      <nav
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block max-w-[calc(100vw-2rem)] transition-opacity duration-300 ease-out"
        style={{ opacity: isCompact ? 0 : 1, pointerEvents: isCompact ? "none" : "auto" }}
        aria-hidden={isCompact}
      >
        <div
          className="rounded-2xl p-[clamp(0.375rem,-0.15rem+0.8vw,0.5rem)]"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--nav-border)",
            boxShadow: "var(--nav-shadow)",
          }}
        >
          <div
            ref={containerRef}
            className="flex items-center gap-x-[clamp(0.25rem,-0.8rem+1.6vw,0.5rem)] relative"
          >
            {pillStyle && (
              <div
                className="absolute inset-y-0 rounded-xl bg-slate-900/10 dark:bg-white/15 transition-all duration-300 ease-out pointer-events-none"
                style={{ left: pillStyle.left, width: pillStyle.width }}
              />
            )}
            {sections.map((section, index) => (
              <button
                key={section.id}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={() => onSectionClick(section.id)}
                aria-current={activeSection === section.id ? "page" : undefined}
                tabIndex={isCompact ? -1 : undefined}
                className={`px-[clamp(0.75rem,-2.4rem+4.8vw,1.5rem)] py-[clamp(0.625rem,0.1rem+0.8vw,0.75rem)] rounded-xl text-[clamp(0.75rem,0.225rem+0.8vw,0.875rem)] font-medium transition-colors duration-300 relative z-10 whitespace-nowrap ${
                  activeSection === section.id
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5"
                }`}
              >
                {section.label}
              </button>
            ))}
            <div className="h-8 w-px bg-slate-300/70 dark:bg-white/10 mx-1 relative z-10" />
            <div className="relative z-10 flex items-center justify-center">
              <ThemeToggle size="sm" />
            </div>
          </div>
        </div>
      </nav>

      {/* Compact nav — shown whenever the full nav wouldn't fit even at its
          smallest fluid size (measured live). Same pill styling as the full
          nav, but only the primary sections plus a "More" dropdown for the
          rest, instead of letting the full set overflow into a horizontal
          scrollbar. Crossfades in via opacity as the full nav fades out. */}
      <nav
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block max-w-[calc(100vw-2rem)] transition-opacity duration-300 ease-out"
        style={{ opacity: isCompact ? 1 : 0, pointerEvents: isCompact ? "auto" : "none" }}
        aria-hidden={!isCompact}
      >
        <div
          className="rounded-2xl p-1.5 relative"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--nav-border)",
            boxShadow: "var(--nav-shadow)",
          }}
        >
          <div className="flex items-center space-x-1">
            {primarySections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                aria-current={activeSection === section.id ? "page" : undefined}
                tabIndex={!isCompact ? -1 : undefined}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                  activeSection === section.id
                    ? "text-slate-900 dark:text-white bg-slate-900/10 dark:bg-white/15"
                    : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5"
                }`}
              >
                {section.label}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setTabletMoreOpen((v) => !v)}
                aria-current={moreActive ? "page" : undefined}
                aria-expanded={tabletMoreOpen}
                tabIndex={!isCompact ? -1 : undefined}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                  moreActive || tabletMoreOpen
                    ? "text-slate-900 dark:text-white bg-slate-900/10 dark:bg-white/15"
                    : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5"
                }`}
              >
                More
              </button>

              {tabletMoreOpen && (
                <div
                  className="absolute top-full right-0 mt-2 min-w-[10rem] rounded-2xl overflow-hidden p-1.5"
                  style={{
                    background: "var(--nav-bg)",
                    border: "1px solid var(--nav-border)",
                    boxShadow: "var(--nav-shadow)",
                  }}
                >
                  {overflowSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setTabletMoreOpen(false);
                        onSectionClick(section.id);
                      }}
                      aria-current={activeSection === section.id ? "page" : undefined}
                      className="flex w-full items-center rounded-xl px-4 min-h-[44px] text-sm font-medium text-left transition-colors duration-200 text-slate-700 dark:text-white/80"
                      style={{
                        background:
                          activeSection === section.id
                            ? "var(--nav-icon-active-bg)"
                            : "transparent",
                      }}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-300/70 dark:bg-white/10 mx-1" />
            <div className="flex items-center justify-center">
              <ThemeToggle size="sm" />
            </div>
          </div>
        </div>
      </nav>

      {tabletMoreOpen && (
        <button
          className="fixed inset-0 z-40 hidden md:block"
          aria-label="Close menu"
          onClick={() => setTabletMoreOpen(false)}
        />
      )}

      {/* Mobile bottom nav — compact icon-only floating pill */}
      <nav
        className="fixed z-50 md:hidden"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="flex items-center gap-0.5 px-2 py-3 rounded-full sm:gap-1 sm:px-3 max-w-[calc(100vw-1.5rem)]"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--nav-mobile-border)",
            boxShadow: "var(--nav-shadow)",
          }}
        >
          {mobileSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className="relative flex items-center justify-center w-10 h-11 min-[360px]:w-11 rounded-full transition-colors duration-200"
                style={{ color: isActive ? "var(--nav-toggle-icon)" : "var(--nav-icon-inactive)" }}
                aria-label={section.label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--nav-icon-active-bg)" }}
                  />
                )}
                <span className="relative">{section.icon}</span>
                {isActive && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--nav-icon-dot)" }}
                  />
                )}
              </button>
            );
          })}

          <div className="flex items-center justify-center">
            <ThemeToggle size="sm" />
          </div>

          {/* More — the sections with no room in the pill */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="relative flex items-center justify-center w-10 h-11 min-[360px]:w-11 rounded-full transition-colors duration-200"
            style={{
              color: moreOpen || moreActive ? "var(--nav-toggle-icon)" : "var(--nav-icon-inactive)",
            }}
            aria-label="More sections"
            aria-expanded={moreOpen}
          >
            {(moreOpen || moreActive) && (
              <span
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--nav-icon-active-bg)" }}
              />
            )}
            <span className="relative">
              <MoreHorizontal className="w-5 h-5" />
            </span>
            {moreActive && !moreOpen && (
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: "var(--nav-icon-dot)" }}
              />
            )}
          </button>
        </div>

        {moreOpen && (
          <div
            className="absolute bottom-full right-0 mb-3 min-w-[11rem] rounded-2xl overflow-hidden p-1.5 backdrop-blur-xl"
            style={{
              background: "var(--nav-bg)",
              border: "1px solid var(--nav-mobile-border)",
              boxShadow: "var(--nav-shadow)",
            }}
          >
            {overflowSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setMoreOpen(false);
                  onSectionClick(section.id);
                }}
                aria-current={activeSection === section.id ? "page" : undefined}
                className="flex w-full items-center rounded-xl px-4 min-h-[44px] text-sm font-medium text-left transition-colors duration-200 text-slate-700 dark:text-white/80"
                style={{
                  background:
                    activeSection === section.id ? "var(--nav-icon-active-bg)" : "transparent",
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {moreOpen && (
        <button
          className="fixed inset-0 z-40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMoreOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
