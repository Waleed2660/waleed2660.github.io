import { useEffect, useRef, useState } from 'react';
import { Home, Briefcase, Code2, Calendar, Mail, ChevronUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface NavigationProps {
  onSectionClick: (section: string) => void;
  activeSection: string;
  showBackToTop?: boolean;
  onScrollToTop?: () => void;
}

const Navigation = ({ onSectionClick, activeSection, showBackToTop, onScrollToTop }: NavigationProps) => {
  const { theme, toggleTheme } = useTheme();
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'conferences', label: 'On The Ground' },
    { id: 'github', label: 'GitHub' },
    { id: 'tools', label: 'Tech Stack' },
    { id: 'currently', label: 'Exploring' },
    { id: 'contact', label: 'Contact' }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const activeIndex = sections.findIndex(s => s.id === activeSection);
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
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'experience', label: 'Work', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <Code2 className="w-5 h-5" /> },
    { id: 'conferences', label: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  const ThemeIcon = theme === 'dark' ? Sun : Moon;

  return (
    <>
      {/* Desktop nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block max-w-[calc(100vw-2rem)]">
        <div className="rounded-2xl p-1.5 lg:p-2 overflow-x-auto" style={{ background: 'var(--nav-bg)', border: '1px solid var(--nav-border)', boxShadow: 'var(--nav-shadow)' }}>
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
                ref={(el) => { buttonRefs.current[index] = el; }}
                onClick={() => onSectionClick(section.id)}
                aria-current={activeSection === section.id ? 'page' : undefined}
                className={`px-3 lg:px-6 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-medium transition-colors duration-300 relative z-10 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5'
                }`}
              >
                {section.label}
              </button>
            ))}
            <div className="h-8 w-px bg-slate-300/70 dark:bg-white/10 mx-1 relative z-10" />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-300 hover:bg-slate-900/5 dark:hover:bg-white/5"
              style={{ background: 'var(--nav-toggle-bg)', color: 'var(--nav-toggle-icon)' }}
            >
              <ThemeIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav — compact icon-only floating pill */}
      <nav
        className="fixed z-50 md:hidden"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)', left: '50%', transform: 'translateX(-50%)' }}
      >
        <div
          className="flex items-center gap-1 px-3 py-3 rounded-full"
          style={{
            background: 'var(--nav-bg)',
            border: '1px solid var(--nav-mobile-border)',
            boxShadow: 'var(--nav-shadow)',
          }}
        >
          {mobileSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className="relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200"
                style={{ color: isActive ? 'var(--nav-toggle-icon)' : 'var(--nav-icon-inactive)' }}
                aria-label={section.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--nav-icon-active-bg)' }}
                  />
                )}
                <span className="relative">{section.icon}</span>
                {isActive && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--nav-icon-dot)' }}
                  />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200"
            style={{ color: 'var(--nav-toggle-icon)', background: 'var(--nav-toggle-bg)' }}
            aria-label="Toggle theme"
          >
            <ThemeIcon className="w-5 h-5" />
          </button>

          {/* Back to top — appears as extra icon when scrolled down */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ width: showBackToTop ? '2.75rem' : '0px', opacity: showBackToTop ? 1 : 0 }}
          >
            <button
              onClick={onScrollToTop}
              className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200"
              style={{ color: 'var(--nav-icon-inactive)' }}
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
