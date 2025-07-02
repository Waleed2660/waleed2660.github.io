
import Navigation from '@/components/Navigation';
import HomeSection from '@/components/HomeSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import TechStack from '@/components/TechStack';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20 pointer-events-none" />
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <Navigation onSectionClick={scrollToSection} />
      
      <main className="relative z-10">
        <div id="home" className="scroll-mt-0">
          <HomeSection />
        </div>
        <div id="experience" className="scroll-mt-32">
          <ExperienceSection />
        </div>
        <div id="projects" className="scroll-mt-0">
          <ProjectsSection />
        </div>
        <div id="tools" className="scroll-mt-0">
          <TechStack />
        </div>
        <div id="contact" className="scroll-mt-10">
          <ContactSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
