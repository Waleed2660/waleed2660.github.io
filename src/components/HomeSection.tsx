import { ArrowRight, ChevronDown, FileText } from "lucide-react";
import { Fragment } from "react";
import { useEffect, useRef, useState } from "react";

const TYPING_TEXTS = [
  "Software Engineer @ Sainsbury's",
  "Java · Kafka · Kubernetes",
  "Spring Boot · AWS · Docker",
  "K6 · Grafana · JMeter",
  "PostgreSQL · MongoDB · Redis",
  "Event-driven microservices",
];
const CAREER_START = new Date(2022, 6, 1); // July 2022 — THG start
const SHOW_AVAILABILITY = false; // Feature flag for availability status
const NAME = "Waleed Tariq";

// Each letter is its own inline-block so it can lift on hover, which also lets the
// browser break the line between any two letters. Grouping letters into nowrap
// words keeps the per-letter effect without splitting the name mid-word.
const NAME_WORDS = (() => {
  let offset = 0;
  return NAME.split(" ").map((word) => {
    const entry = { word, offset };
    offset += word.length + 1;
    return entry;
  });
})();

function getYOE(): string {
  const now = new Date();
  const years = (now.getTime() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const floored = Math.floor(years);
  return `${floored}+ YOE`;
}

interface HomeSectionProps {
  onNavigate?: (id: string) => void;
}

const HomeSection = ({ onNavigate }: HomeSectionProps) => {
  const [displayed, setDisplayed] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [phase, setPhase] = useState<"typing" | "erasing">("typing");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredLetterIdx, setHoveredLetterIdx] = useState<number | null>(null);
  const [animateTyping, setAnimateTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Honour reduced motion by showing the first phrase outright, and stop the
  // timer loop entirely once the hero scrolls out of view.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setAnimateTyping(!reduced.matches);
      if (reduced.matches) {
        setDisplayed(TYPING_TEXTS[0]);
        setTypingDone(true);
      }
    };
    apply();
    reduced.addEventListener("change", apply);
    return () => reduced.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animateTyping || !isVisible) return;
    const currentText = TYPING_TEXTS[phraseIndex];
    if (phase === "typing") {
      if (displayed.length < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        }, 55);
        return () => clearTimeout(timer);
      } else {
        if (!typingDone) setTypingDone(true);
        const timer = setTimeout(() => setPhase("erasing"), 2500);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayed.length > 0) {
        const timer = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
        }, 25);
        return () => clearTimeout(timer);
      } else {
        setPhraseIndex((i) => (i + 1) % TYPING_TEXTS.length);
        setPhase("typing");
      }
    }
  }, [displayed, phase, phraseIndex, typingDone, animateTyping, isVisible]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-20 md:pt-32 md:pb-12"
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
                <span className="text-green-700 dark:text-green-300/90 text-sm font-medium">
                  Available for opportunities
                </span>
              </div>
            )}

            <div
              className={`flex items-center justify-center gap-4 sm:gap-6 mb-6 ${!SHOW_AVAILABILITY ? "mt-0" : ""}`}
              onMouseLeave={() => setHoveredLetterIdx(null)}
            >
              <img
                src="/avatar-320.webp"
                srcSet="/avatar-160.webp 160w, /avatar-320.webp 320w"
                sizes="144px"
                alt={NAME}
                width={128}
                height={128}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-slate-200 dark:border-white/10 shadow-lg"
              />

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold ">
                {NAME_WORDS.map(({ word, offset }, wordIdx) => (
                  <Fragment key={wordIdx}>
                    {/* Separator lives outside the nowrap span; trailing whitespace
                        inside an inline-block collapses and swallows the space. */}
                    {wordIdx > 0 && " "}
                    <span className="inline-block whitespace-nowrap">
                      {word.split("").map((char, charIdx) => {
                        const i = offset + charIdx;
                        const dist =
                          hoveredLetterIdx !== null ? Math.abs(i - hoveredLetterIdx) : Infinity;
                        const translateY = dist === 0 ? -14 : dist === 1 ? -8 : dist === 2 ? -3 : 0;
                        return (
                          <span
                            key={charIdx}
                            className="inline-block"
                            onMouseEnter={() => setHoveredLetterIdx(i)}
                            style={{
                              transform: `translateY(${translateY}px)`,
                              transition: "transform 150ms ease-out",
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  </Fragment>
                ))}
              </h1>
            </div>

            <div className="text-xl sm:text-2xl md:text-3xl text-slate-500 dark:text-white/50 italic mb-4 flex items-center justify-center gap-2 flex-wrap min-h-[2.5rem]">
              <span>
                {displayed}
                <span className="animate-blink ml-0.5">|</span>
              </span>
            </div>

            <div
              className={`inline-flex items-center gap-2 mb-8 text-slate-400 dark:text-white/40 transition-opacity duration-500 ${typingDone ? "opacity-100" : "opacity-0"}`}
            >
              <span>📍</span>
              <span className="text-lg">Manchester, UK</span>
            </div>

            <p className="text-xl sm:text-2xl text-slate-600 dark:text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Backend engineer building reliable, high-throughput systems. Focused on Java, Kafka,
              and Kubernetes in production.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 mb-8">
              <button
                type="button"
                onClick={() => onNavigate?.("experience")}
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-brand text-brand-contrast font-semibold tracking-tight transition-colors duration-200 hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                See my work
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full glass border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white/85 font-medium transition-colors duration-200 hover:border-brand/60 hover:text-slate-950 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                Résumé
              </a>
            </div>

            <div className="flex justify-center flex-wrap gap-3">
              {[
                { label: getYOE(), icon: "💼" },
                { label: "Java", icon: "☕" },
                { label: "Spring Boot", icon: "🍃" },
                { label: "Kubernetes", icon: "☸️" },
                { label: "AWS", icon: "☁️" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl px-4 py-2.5 transition-colors duration-200 hover:bg-slate-900/5 dark:hover:bg-white/10 cursor-default group border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                >
                  <span className="text-slate-700 dark:text-white/80 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="font-medium">{badge.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className={`mt-8 flex justify-center transition-opacity duration-700 ${typingDone ? "opacity-100" : "opacity-0"}`}
        >
          <ChevronDown className="w-6 h-6 text-slate-400 dark:text-white/25 animate-nudge" />
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
