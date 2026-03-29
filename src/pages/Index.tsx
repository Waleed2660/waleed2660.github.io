
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HomeSection from '@/components/HomeSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import GitHubSection from '@/components/GitHubSection';
import TechStack from '@/components/TechStack';
import ContactSection from '@/components/ContactSection';
import FadeIn from '@/components/FadeIn';
import { useActiveSection } from '@/hooks/use-active-section';

const SECTION_IDS = ['home', 'experience', 'projects', 'github', 'tools', 'contact'];

const Index = () => {
  const activeSection = useActiveSection(SECTION_IDS);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>('.glass-strong').forEach(card => {
        const rect = card.getBoundingClientRect();
        const scaleX = rect.width / card.offsetWidth;
        const scaleY = rect.height / card.offsetHeight;
        card.style.setProperty('--mouse-x', `${(e.clientX - rect.left) / scaleX}px`);
        card.style.setProperty('--mouse-y', `${(e.clientY - rect.top) / scaleY}px`);
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

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
      
      <Navigation onSectionClick={scrollToSection} activeSection={activeSection} />
      
      <main className="relative z-10">
        <div id="home" className="scroll-mt-0">
          <FadeIn><HomeSection /></FadeIn>
        </div>
        <div id="experience" className="scroll-mt-32">
          <FadeIn><ExperienceSection /></FadeIn>
        </div>
        <div id="projects" className="scroll-mt-0">
          <FadeIn><ProjectsSection /></FadeIn>
        </div>
        <div id="github" className="scroll-mt-0">
          <FadeIn><GitHubSection /></FadeIn>
        </div>
        <div id="tools" className="scroll-mt-0">
          <FadeIn><TechStack /></FadeIn>
        </div>
        <div id="contact" className="scroll-mt-10">
          <FadeIn><ContactSection /></FadeIn>
        </div>
      </main>
      <footer className="relative z-10 text-center py-6 text-sm text-white/40">
        © {new Date().getFullYear()} Waleed Tariq. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
