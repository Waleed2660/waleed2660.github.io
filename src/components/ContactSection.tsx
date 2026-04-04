import { FileText, Mail, Linkedin, Github, Send, Download } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [resumeRevealed, setResumeRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleResumeClick = () => setResumeRevealed(true);

  const contactCards = [
    {
      icon: <Linkedin className="w-8 h-8" />,
      title: "LinkedIn",
      subtitle: "Let's connect",
      href: "https://www.linkedin.com/in/waleed-t/",
      gradient: "from-blue-500/20 to-cyan-500/20",
      hoverGradient: "hover:from-blue-500/40 hover:to-cyan-500/40",
      hoverColor: "group-hover:text-blue-400",
      isExternal: true,
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: "GitHub",
      subtitle: "Check out my code",
      href: "https://github.com/Waleed2660",
      gradient: "from-purple-500/20 to-pink-500/20",
      hoverGradient: "hover:from-purple-500/40 hover:to-pink-500/40",
      hoverColor: "group-hover:text-purple-400",
      isExternal: true,
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      subtitle: "me@waleedtariq.com",
      href: "mailto:me@waleedtariq.com",
      gradient: "from-green-500/20 to-emerald-500/20",
      hoverGradient: "hover:from-green-500/40 hover:to-emerald-500/40",
      hoverColor: "group-hover:text-red-400",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume",
      subtitle: "View my experience",
      href: "/resume.pdf",
      gradient: "from-orange-500/20 to-red-500/20",
      hoverGradient: "hover:from-orange-500/40 hover:to-red-500/40",
      isExternal: true,
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 min-h-screen">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-glow">
            Let's Connect
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Always open to discussing new opportunities, collaborations, or just a friendly chat about tech
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactCards.filter(card => card.title !== "Resume").map((card, index) => (
            <a
              key={index}
              href={card.href}
              target={card.isExternal ? "_blank" : undefined}
              rel={card.isExternal ? "noopener noreferrer" : undefined}
              onClick={card.title === "Email" ? (e) => {
                e.preventDefault();
                const email = 'me@waleedtariq.com';
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(email).catch(() => {
                    // fallback for mobile browsers that deny clipboard API
                    const ta = document.createElement('textarea');
                    ta.value = email;
                    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
                    document.body.appendChild(ta);
                    ta.focus();
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                  });
                } else {
                  const ta = document.createElement('textarea');
                  ta.value = email;
                  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
                  document.body.appendChild(ta);
                  ta.focus();
                  ta.select();
                  document.execCommand('copy');
                  document.body.removeChild(ta);
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } : undefined}
              className={`glass-strong rounded-2xl p-8 
                bg-gradient-to-br ${card.gradient} ${card.hoverGradient}
                transition-all duration-300 
                hover:scale-[1.02] hover:-translate-y-1
                group cursor-pointer
                border border-white/10 hover:border-white/20`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-white/80 transition-colors group-hover:scale-110 duration-300 ${card.hoverColor}`}>
                  {card.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-2xl font-bold text-white mb-1 transition-colors ${card.hoverColor}`}>
                    {card.title}
                  </h3>
                  <p className={`text-white/60 transition-colors ${card.hoverColor}`}>
                    {card.title === "Email" && copied ? "✓ Copied to clipboard!" : card.subtitle}
                  </p>
                </div>
                {card.title !== "Email" && <Send className={`w-5 h-5 text-white/40 group-hover:translate-x-1 transition-all duration-300 ${card.hoverColor}`} />}
              </div>
            </a>
          ))}

          {/* Resume Card — 3D flip */}
          <div
            className="relative rounded-2xl"
            style={{ perspective: '1000px' }}
          >
            <div
              className="relative w-full transition-transform duration-700 ease-in-out rounded-2xl"
              style={{
                transformStyle: 'preserve-3d',
                transform: resumeRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front face — defines height, normal flow */}
              <button
                onClick={handleResumeClick}
                className="w-full p-8 flex items-start gap-4 text-left group cursor-pointer rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors duration-300"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: 'rgba(255,255,255,0.10)' }}
              >
                <div className="text-white/80 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-bold text-white mb-1">Resume</h3>
                  <p className="text-white/60 group-hover:text-white/80 transition-colors">Click to reveal</p>
                </div>
              </button>

              {/* Back face — absolute, same dimensions */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 p-8 flex items-start gap-4 text-left group cursor-pointer rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 transition-colors duration-300"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-green-400 group-hover:text-green-300 transition-colors duration-300 group-hover:scale-110">
                  <Download className="w-8 h-8" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg md:text-2xl font-bold text-green-200/80 group-hover:text-green-200 mb-1 transition-colors">
                    View my experience (PDF)
                  </h3>
                </div>
                <Send className="w-5 h-5 text-green-400/60 group-hover:text-green-300 group-hover:translate-x-1 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
