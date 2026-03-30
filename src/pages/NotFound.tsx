import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Home, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Trigger fade-in animation
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full text-center">
          {/* 404 Icon */}
          <div className="mb-6 flex justify-center">
            <div className="glass-strong rounded-full p-6">
              <Compass className="w-16 h-16 text-white/80" />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-7xl md:text-8xl font-bold text-white text-glow mb-6">
            404
          </h1>

          {/* Main Message */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Welcome to No Man's Land! 🏜️
            </h2>
            <p className="text-white/70 mb-3">
              Looks like you've wandered off the beaten path.
            </p>
            <p className="text-white/50 text-sm">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 glass-strong rounded-xl px-6 py-3 text-white hover:text-blue-300 hover:bg-white/10 transition-all group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Take Me Home</span>
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 glass rounded-xl px-6 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all group"
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
