import { useEffect, useRef, useState } from 'react';
import { Home, Briefcase, Code2, Calendar, Mail, ChevronUp } from 'lucide-react';

interface NavigationProps {
  onSectionClick: (section: string) => void;
  activeSection: string;
  showBackToTop?: boolean;
  onScrollToTop?: () => void;
}

const Navigation = ({ onSectionClick, activeSection, showBackToTop, onScrollToTop }: NavigationProps) => {
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'conferences', label: 'Events' },
    { id: 'github', label: 'GitHub' },
    { id: 'tools', label: 'Stack' },
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

  return (
    <>
      {/* Desktop nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="rounded-2xl p-2" style={{ background: 'rgba(12,12,28,0.92)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div ref={containerRef} className="flex space-x-2 relative">
            {pillStyle && (
              <div
                className="absolute inset-y-0 rounded-xl bg-white/15 transition-all duration-300 ease-out pointer-events-none"
                style={{ left: pillStyle.left, width: pillStyle.width }}
              />
            )}
            {sections.map((section, index) => (
              <button
                key={section.id}
                ref={(el) => { buttonRefs.current[index] = el; }}
                onClick={() => onSectionClick(section.id)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-300 relative z-10 ${
                  activeSection === section.id
                    ? 'text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.label}
              </button>
            ))}
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
            background: 'rgba(12,12,28,0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {mobileSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className="relative flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.35)' }}
                aria-label={section.label}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  />
                )}
                <span className="relative">{section.icon}</span>
                {isActive && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.7)' }}
                  />
                )}
              </button>
            );
          })}

          {/* Back to top — appears as extra icon when scrolled down */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ width: showBackToTop ? '2.75rem' : '0px', opacity: showBackToTop ? 1 : 0 }}
          >
            <button
              onClick={onScrollToTop}
              className="flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.35)' }}
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
