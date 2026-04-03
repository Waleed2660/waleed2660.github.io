
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import HomeSection from '@/components/HomeSection';
import FadeIn from '@/components/FadeIn';
import { useActiveSection } from '@/hooks/use-active-section';

const ExperienceSection = lazy(() => import('@/components/ExperienceSection'));
const ProjectsSection = lazy(() => import('@/components/ProjectsSection'));
const GitHubSection = lazy(() => import('@/components/GitHubSection'));
const TechStack = lazy(() => import('@/components/TechStack'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const CurrentlySection = lazy(() => import('@/components/CurrentlySection'));
const ConferencesSection = lazy(() => import('@/components/ConferencesSection'));
const ResearchSection = lazy(() => import('@/components/ResearchSection'));

const SECTION_IDS = ['home', 'experience', 'projects', 'research', 'conferences', 'github', 'tools', 'currently', 'contact'];

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

  const starCount = window.innerWidth < 768 ? 8 : 20;
  const stars = useMemo(() => Array.from({ length: starCount }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 18}s`,
    delay: `-${Math.random() * 30}s`,
  })), []);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Update progress bar directly on DOM — no React re-render, no jank
      if (progressBarRef.current) {
        progressBarRef.current.style.width = maxScroll > 0 ? `${(scrollY / maxScroll) * 100}%` : '0%';
      }
      setShowBackToTop(scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Handle hash navigation (e.g., from dissertation page back button)
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

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
    <>
    {/* Scroll progress bar — outside overflow-hidden so it's never clipped */}
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none">
      <div
        ref={progressBarRef}
        className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
        style={{ width: '0%' }}
      />
    </div>

    {/* Back to top — outside overflow-hidden so it's never clipped */}
    <button
      onClick={() => scrollToSection('home')}
      className={`fixed bottom-8 right-8 z-[100] p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition-all duration-300 ${
        showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>

    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20 pointer-events-none" />

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: s.left,
              top: s.top,
              animation: `twinkle ${s.duration} ease-in-out infinite ${s.delay}`,
              transform: 'translateZ(0)'
            }}
          />
        ))}
      </div>
      
      <Navigation onSectionClick={scrollToSection} activeSection={activeSection} />
      
      <main className="relative z-10">
        <div id="home" className="scroll-mt-0">
          <HomeSection />
        </div>
        <Suspense fallback={null}>
          <div id="experience" className="scroll-mt-32">
            <FadeIn><ExperienceSection /></FadeIn>
          </div>
          <div id="projects" className="scroll-mt-0">
            <FadeIn><ProjectsSection /></FadeIn>
          </div>
          <div id="research" className="scroll-mt-0">
            <FadeIn><ResearchSection /></FadeIn>
          </div>
          <div id="conferences" className="scroll-mt-0">
            <FadeIn><ConferencesSection /></FadeIn>
          </div>
          <div id="github" className="scroll-mt-0">
            <FadeIn><GitHubSection /></FadeIn>
          </div>
          <div id="tools" className="scroll-mt-0">
            <FadeIn><TechStack /></FadeIn>
          </div>
          <div id="currently" className="scroll-mt-0">
            <FadeIn><CurrentlySection /></FadeIn>
          </div>
          <div id="contact" className="scroll-mt-10">
            <FadeIn><ContactSection /></FadeIn>
          </div>
        </Suspense>
      </main>
      <footer className="relative z-10 text-center py-6 text-sm text-white/40">
        © {new Date().getFullYear()} Waleed Tariq. All rights reserved.
      </footer>
    </div>
    </>
  );
};

export default Index;
