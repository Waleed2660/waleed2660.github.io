
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
    let rafId: number;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.glass-strong').forEach(card => {
          const rect = card.getBoundingClientRect();
          const scaleX = rect.width / card.offsetWidth;
          const scaleY = rect.height / card.offsetHeight;
          card.style.setProperty('--mouse-x', `${(e.clientX - rect.left) / scaleX}px`);
          card.style.setProperty('--mouse-y', `${(e.clientY - rect.top) / scaleY}px`);
        });
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(rafId);
    };
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
      className={`fixed bottom-8 md:bottom-8 right-8 z-[100] p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition-all duration-300 ${
        showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', bottom: 'calc(env(safe-area-inset-bottom) + 7rem)' }}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>

    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient orbs — large blurred blobs that create atmospheric depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-left: cool blue */}
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[120px] animate-[drift1_22s_ease-in-out_infinite]" />
        {/* Top-right: indigo/violet */}
        <div className="absolute -top-32 -right-64 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[100px] animate-[drift2_28s_ease-in-out_infinite]" />
        {/* Center: deep teal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-700/10 blur-[140px] animate-[drift3_35s_ease-in-out_infinite]" />
        {/* Bottom-left: purple */}
        <div className="absolute -bottom-64 -left-32 w-[600px] h-[600px] rounded-full bg-purple-700/15 blur-[110px] animate-[drift2_30s_ease-in-out_infinite_-10s]" />
        {/* Bottom-right: blue accent */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[90px] animate-[drift1_25s_ease-in-out_infinite_-5s]" />
      </div>

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
      
      <main className="relative z-10 pb-28 md:pb-0">
        <div id="home" className="scroll-mt-0">
          <HomeSection />
        </div>
        <Suspense fallback={null}>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="experience" className="scroll-mt-32">
            <FadeIn><ExperienceSection /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="projects" className="scroll-mt-0">
            <FadeIn><ProjectsSection /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="research" className="scroll-mt-0">
            <FadeIn><ResearchSection /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="conferences" className="scroll-mt-0">
            <FadeIn><ConferencesSection /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="github" className="scroll-mt-0">
            <FadeIn><GitHubSection /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="tools" className="scroll-mt-0">
            <FadeIn><TechStack /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="currently" className="scroll-mt-0">
            <FadeIn><CurrentlySection /></FadeIn>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-8 sm:mx-24" />
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
