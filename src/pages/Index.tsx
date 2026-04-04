
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import HomeSection from '@/components/HomeSection';
import FadeIn from '@/components/FadeIn';
import { useActiveSection } from '@/hooks/use-active-section';

import SiteStats from '@/components/SiteStats';

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
    const attempt = (tries: number) => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      element.scrollIntoView({ behavior: tries === 0 ? 'smooth' : 'auto', block: 'start' });
      // Re-check after lazy components may have finished rendering
      if (tries < 3) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.getBoundingClientRect().top;
            if (Math.abs(top) > 10) el.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }, 400 + tries * 300);
      }
    };
    attempt(0);
  };

  const starCount = window.innerWidth < 768 ? 0 : 20;
  const stars = useMemo(() => Array.from({ length: starCount }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 18}s`,
    delay: `-${Math.random() * 30}s`,
  })), []);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showSiteStats, setShowSiteStats] = useState(false);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setShowSiteStats(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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

    {/* Back to top — desktop only, mobile handled inside nav pill */}
    <button
      onClick={() => scrollToSection('home')}
      className={`fixed bottom-8 right-8 z-[100] p-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:scale-110 transition-all duration-300 hidden md:flex items-center justify-center ${
        showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>

    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient orbs — large blurred blobs that create atmospheric depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-left: cool blue */}
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[120px] md:animate-[drift1_22s_ease-in-out_infinite]" style={{ willChange: 'transform' }} />
        {/* Top-right: indigo/violet */}
        <div className="absolute -top-32 -right-64 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[100px] md:animate-[drift2_28s_ease-in-out_infinite]" style={{ willChange: 'transform' }} />
        {/* Center: deep teal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-700/10 blur-[140px] md:animate-[drift3_35s_ease-in-out_infinite]" style={{ willChange: 'transform' }} />
        {/* Bottom-left: purple */}
        <div className="absolute -bottom-64 -left-32 w-[600px] h-[600px] rounded-full bg-purple-700/15 blur-[110px] md:animate-[drift2_30s_ease-in-out_infinite_-10s]" style={{ willChange: 'transform' }} />
        {/* Bottom-right: blue accent */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[90px] md:animate-[drift1_25s_ease-in-out_infinite_-5s]" style={{ willChange: 'transform' }} />
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
      
      <Navigation onSectionClick={scrollToSection} activeSection={activeSection} showBackToTop={showBackToTop} onScrollToTop={() => scrollToSection('home')} />
      <SiteStats open={showSiteStats} onClose={() => setShowSiteStats(false)} />
      
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
      <footer className="relative z-10 text-center py-6 pb-28 md:pb-6 text-sm text-white/40">
        © {new Date().getFullYear()} Waleed Tariq. All rights reserved.
      </footer>
    </div>
    </>
  );
};

export default Index;
