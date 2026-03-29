import { useEffect, useState } from 'react';

const TYPING_TEXT = "Software Engineer @ Sainsbury's";
const CAREER_START = new Date(2022, 6, 1); // July 2022 — THG start

function getYOE(): string {
  const now = new Date();
  const years = (now.getTime() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const floored = Math.floor(years);
  return `${floored}+ YOE`;
}

const HomeSection = () => {
  const [displayed, setDisplayed] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (displayed.length < TYPING_TEXT.length) {
      const timer = setTimeout(() => {
        setDisplayed(TYPING_TEXT.slice(0, displayed.length + 1));
      }, 55);
      return () => clearTimeout(timer);
    } else {
      setTypingDone(true);
    }
  }, [displayed]);

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      
        <div className="w-full sm:max-w-4xl text-center">
        <div className="glass-strong rounded-3xl p-6 sm:p-12 transition-all duration-500 hover:scale-105 sm:hover:scale-110 transform-gpu">
          
          {/* Person sitting on the left side */}
          <div className="absolute -top-20 sm:-top-30 left-2 sm:left-4 z-10">
            <img
              src="../../dev_hoodie_sitting.webp"
              alt="Profile image"
              width="140"
              height="190"
              fetchPriority="high"
              className="w-[100px] h-[140px] sm:w-[140px] sm:h-[190px] rounded-lg [filter:drop-shadow(0_25px_15px_rgba(0,0,0,0.2))]"
            />
          </div>


          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-glow">
            Waleed Tariq
          </h1>
          <h1 className="text-lg sm:text-xl md:text-2xl text-white/50 italic mb-6 sm:mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span>
              {displayed}
              {!typingDone && <span className="animate-blink ml-0.5">|</span>}
            </span>
            {typingDone && (
              <span className="inline-flex items-center opacity-75 animate-fade-in">
                📍 Manchester, UK
              </span>
            )}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Backend engineer obsessed with scale and performance — Java, Kafka, Kubernetes, and the satisfaction of a system that holds under pressure
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            <div className="glass rounded-2xl px-6 py-3">
              <span className="text-white/80">{getYOE()}</span>
            </div>
            <div className="glass rounded-2xl px-6 py-3">
              <span className="text-white/80">Java</span>
            </div>
            <div className="glass rounded-2xl px-6 py-3">
              <span className="text-white/80">Spring Boot</span>
            </div>
            <div className="glass rounded-2xl px-6 py-3">
              <span className="text-white/80">K8s</span>
            </div>
            <div className="glass rounded-2xl px-6 py-3">
              <span className="text-white/80">AWS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
