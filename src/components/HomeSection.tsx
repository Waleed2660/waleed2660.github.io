import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const TYPING_TEXTS = [
  "Software Engineer @ Sainsbury's",
  "Java · Kafka · Kubernetes",
  "Spring Boot · AWS · Docker",
  "K6 · Grafana · JMeter",
  "PostgreSQL · MongoDB · Redis",
  "Event-driven microservices"
];
const CAREER_START = new Date(2022, 6, 1); // July 2022 — THG start
const SHOW_AVAILABILITY = false; // Feature flag for availability status
const NAME = "Waleed Tariq";

function getYOE(): string {
  const now = new Date();
  const years = (now.getTime() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const floored = Math.floor(years);
  return `${floored}+ YOE`;
}

const HomeSection = () => {
  const [displayed, setDisplayed] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [phase, setPhase] = useState<'typing' | 'erasing'>('typing');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredLetterIdx, setHoveredLetterIdx] = useState<number | null>(null);

  useEffect(() => {
    const currentText = TYPING_TEXTS[phraseIndex];
    if (phase === 'typing') {
      if (displayed.length < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, 55);
        return () => clearTimeout(timer);
      } else {
        if (!typingDone) setTypingDone(true);
        const timer = setTimeout(() => setPhase('erasing'), 2500);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayed.length > 0) {
        const timer = setTimeout(() => {
          setDisplayed(prev => prev.slice(0, -1));
        }, 25);
        return () => clearTimeout(timer);
      } else {
        setPhraseIndex(i => (i + 1) % TYPING_TEXTS.length);
        setPhase('typing');
      }
    }
  }, [displayed, phase, phraseIndex, typingDone]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center px-6 pt-12 sm:pt-0"
    >
      <div className="w-full max-w-4xl text-center relative">
        <div 
          className="glass-strong rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(96, 165, 250, 0.04), transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            {/* Available status badge */}
            {SHOW_AVAILABILITY && (
              <div className="inline-flex items-center gap-2 mb-8 glass rounded-full px-4 py-2 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300/90 text-sm font-medium">Available for opportunities</span>
              </div>
            )}

            <h1
              className={`text-4xl sm:text-6xl md:text-7xl font-bold mb-6 text-glow ${!SHOW_AVAILABILITY ? 'mt-0' : ''}`}
              onMouseLeave={() => setHoveredLetterIdx(null)}
            >
              {NAME.split('').map((char, i) => {
                const dist = hoveredLetterIdx !== null ? Math.abs(i - hoveredLetterIdx) : Infinity;
                const translateY = dist === 0 ? -14 : dist === 1 ? -8 : dist === 2 ? -3 : 0;
                return (
                  <span
                    key={i}
                    className="inline-block"
                    onMouseEnter={() => setHoveredLetterIdx(i)}
                    style={{
                      whiteSpace: char === ' ' ? 'pre' : 'normal',
                      transform: `translateY(${translateY}px)`,
                      transition: 'transform 150ms ease-out',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
            
            <div className="text-xl sm:text-2xl md:text-3xl text-white/50 italic mb-4 flex items-center justify-center gap-2 flex-wrap min-h-[2.5rem]">
              <span>
                {displayed}
                <span className="animate-blink ml-0.5">|</span>
              </span>
            </div>

            <div className={`inline-flex items-center gap-2 mb-8 text-white/40 transition-opacity duration-500 ${typingDone ? 'opacity-100' : 'opacity-0'}`}>
              <span>📍</span>
              <span className="text-lg">Manchester, UK</span>
            </div>

            <p className="text-xl sm:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Backend engineer building reliable, high-throughput systems. Focused on Java, Kafka, and Kubernetes in production.
            </p>

            <div className="flex justify-center flex-wrap gap-3">
              {[
                { label: getYOE(), icon: '💼' },
                { label: 'Java', icon: '☕' },
                { label: 'Spring Boot', icon: '🍃' },
                { label: 'Kubernetes', icon: '☸️' },
                { label: 'AWS', icon: '☁️' },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl px-5 py-3 hover:scale-110 hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 cursor-default group border border-white/5 hover:border-white/20"
                >
                  <span className="text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="font-medium">{badge.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={`mt-8 flex justify-center transition-opacity duration-700 ${typingDone ? 'opacity-100' : 'opacity-0'}`}>
          <ChevronDown className="w-6 h-6 text-white/25 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
