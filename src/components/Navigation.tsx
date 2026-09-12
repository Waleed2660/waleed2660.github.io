import { useEffect, useRef, useState } from "react";
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
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = overflowSections.some((s) => s.id === activeSection);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  return (
    <>
      {/* Desktop nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block max-w-[calc(100vw-2rem)]">
        <div
          className="rounded-2xl p-1.5 lg:p-2 overflow-x-auto"
          style={{
            background: "var(--nav-bg)",
            border: "1px solid var(--nav-border)",
            boxShadow: "var(--nav-shadow)",
          }}
        >
          <div ref={containerRef} className="flex items-center space-x-1 lg:space-x-2 relative">
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
                className={`px-3 lg:px-6 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-medium transition-colors duration-300 relative z-10 whitespace-nowrap ${
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
