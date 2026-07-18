import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Home, ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const stars = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 18}s`,
    delay: `-${Math.random() * 30}s`,
  })), []);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Ambient orbs — matches the vibrancy of the Home page background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-500/35 dark:bg-blue-600/20 blur-[60px] md:blur-[120px] will-change-transform" />
        <div className="absolute -top-32 -right-64 w-[600px] h-[600px] rounded-full bg-violet-500/30 dark:bg-violet-600/15 blur-[50px] md:blur-[100px] will-change-transform" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-cyan-500/20 dark:bg-cyan-700/10 blur-[140px] hidden md:block will-change-transform" />
        <div className="absolute -bottom-64 -left-32 w-[600px] h-[600px] rounded-full bg-purple-500/30 dark:bg-purple-700/15 blur-[55px] md:blur-[110px] will-change-transform" />
      </div>

      {/* Floating particles effect */}
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full text-center">
          {/* 404 Icon */}
          <div className="mb-6 flex justify-center">
            <div className="glass-strong rounded-full p-6">
              <Compass className="w-16 h-16 text-slate-700 dark:text-white/80" />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-7xl md:text-8xl font-bold text-slate-900 dark:text-white text-glow mb-6">
            404
          </h1>

          {/* Main Message */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome to No Man's Land! 🏜️
            </h2>
            <p className="text-slate-600 dark:text-white/70 mb-3">
              Looks like you've wandered off the beaten path.
            </p>
            <p className="text-slate-500 dark:text-white/50 text-sm">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 glass-strong rounded-xl px-6 py-3 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Take Me Home</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 glass rounded-xl px-6 py-3 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
