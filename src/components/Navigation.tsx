import { useEffect, useRef, useState } from 'react';

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

  return (
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
  );
};

export default Navigation;
