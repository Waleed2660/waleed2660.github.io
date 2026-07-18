import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import HomeSection from '@/components/HomeSection';
import FadeIn from '@/components/FadeIn';
import { useActiveSection } from '@/hooks/use-active-section';
import SiteStats from '@/components/SiteStats';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import GitHubSection from '@/components/GitHubSection';
import TechStack from '@/components/TechStack';
import ContactSection from '@/components/ContactSection';
import CurrentlySection from '@/components/CurrentlySection';
import ConferencesSection from '@/components/ConferencesSection';
import ResearchSection from '@/components/ResearchSection';

const SECTION_IDS = ['home', 'experience', 'projects', 'research', 'conferences', 'github', 'tools', 'currently', 'contact'];

const Index = () => {
  const activeSection = useActiveSection(SECTION_IDS);

  const scrollToSection = (sectionId: string) => {
    document.fonts.ready.then(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const stars = useMemo(() => {
    if (!isDesktop) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${10 + Math.random() * 18}s`,
      delay: `-${Math.random() * 30}s`,
    }));
  }, [isDesktop]);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const showBackToTopRef = useRef(false);
  const [showSiteStats, setShowSiteStats] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = maxScroll > 0 ? `${(scrollY / maxScroll) * 100}%` : '0%';
      }
      const shouldShow = scrollY > window.innerHeight;
      if (shouldShow !== showBackToTopRef.current) {
        showBackToTopRef.current = shouldShow;
        setShowBackToTop(shouldShow);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
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
    let cards: HTMLElement[] = [];
    const refreshCards = () => { cards = Array.from(document.querySelectorAll<HTMLElement>('.glass-strong')); };
    refreshCards();
    window.addEventListener('resize', refreshCards, { passive: true });
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cards.forEach(card => {
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
      window.removeEventListener('resize', refreshCards);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none md:hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
          style={{ width: '0%' }}
        />
      </div>

      <button
        onClick={() => scrollToSection('home')}
        className={`fixed bottom-8 right-8 z-[100] p-3 rounded-full border border-slate-300 dark:border-white/20 text-slate-500 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/40 hover:scale-110 transition-all duration-300 hidden md:flex items-center justify-center ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ background: 'var(--floating-action-bg)' }}
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-500/35 dark:bg-blue-600/20 blur-[60px] md:blur-[120px] will-change-transform" />
          <div className="absolute -top-32 -right-64 w-[600px] h-[600px] rounded-full bg-violet-500/30 dark:bg-violet-600/15 blur-[50px] md:blur-[100px] will-change-transform" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-500/20 dark:bg-cyan-700/10 blur-[140px] hidden md:block will-change-transform" />
          <div className="absolute -bottom-64 -left-32 w-[600px] h-[600px] rounded-full bg-purple-500/30 dark:bg-purple-700/15 blur-[55px] md:blur-[110px] will-change-transform" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[90px] hidden md:block will-change-transform" />
        </div>

        <div className="fixed inset-0 pointer-events-none">
          {stars.map((s) => (
            <div
              key={s.id}
              className="absolute w-1 h-1 bg-slate-300 dark:bg-white rounded-full"
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

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="experience">
            <FadeIn><ExperienceSection /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="projects">
            <FadeIn><ProjectsSection /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="research">
            <FadeIn><ResearchSection /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="conferences">
            <FadeIn><ConferencesSection /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="github">
            <FadeIn><GitHubSection /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="tools">
            <FadeIn><TechStack /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="currently">
            <FadeIn><CurrentlySection /></FadeIn>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/[0.06] to-transparent mx-8 sm:mx-24" />
          <div id="contact">
            <FadeIn><ContactSection /></FadeIn>
          </div>
        </main>
        <footer className="relative z-10 text-center py-6 pb-28 md:pb-6 text-sm text-slate-500 dark:text-white/40">
          © {new Date().getFullYear()} Waleed Tariq. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Index;
