
import { Mail } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-16 text-glow">
          Get In Touch 📬
        </h2>
        <div className="glass-strong rounded-3xl p-12">
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Let's build something amazing together
          </p>
          
          <div className="space-y-6">
            <a
              href="mailto:hello@engineer.dev"
              className="glass rounded-2xl p-6 flex items-center justify-center space-x-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
            >
              <Mail className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" />
              <span className="text-white/80 text-lg group-hover:text-white transition-colors">
                hello@waleedtariq.com
              </span>
            </a>
            
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.linkedin.com/in/waleed-t/" 
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl px-6 py-3 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                <span className="text-white/80">LinkedIn</span>
              </a>

              <a
                href="https://github.com/Waleed2660"
                target="_blank"
                rel="noopener noreferrer" 
                className="glass rounded-2xl px-6 py-3 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105">
                <span className="text-white/80">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
