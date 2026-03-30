interface NavigationProps {
  onSectionClick: (section: string) => void;
  activeSection: string;
}

const Navigation = ({ onSectionClick, activeSection }: NavigationProps) => {
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'currently', label: 'Exploring' },
    { id: 'conferences', label: 'Events' },
    { id: 'research', label: 'Research' },
    { id: 'github', label: 'GitHub' },
    { id: 'tools', label: 'Stack' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
      <div className="glass-strong rounded-2xl p-2">
        <div className="flex space-x-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-110 ${
                activeSection === section.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
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
