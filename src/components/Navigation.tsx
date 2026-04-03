import { useEffect, useRef, useState } from 'react';
import { Home, Briefcase, Code2, Calendar, Mail } from 'lucide-react';

interface NavigationProps {
  onSectionClick: (section: string) => void;
  activeSection: string;
}

const Navigation = ({ onSectionClick, activeSection }: NavigationProps) => {
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
        <div className="glass-strong rounded-2xl p-2">
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

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div
          className="flex items-center gap-1 px-3 py-2 rounded-2xl"
          style={{ background: 'rgba(15,15,35,0.50)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          {mobileSections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                activeSection === section.id
                  ? 'text-white bg-white/10'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {section.icon}
              <span className="text-[10px] font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
