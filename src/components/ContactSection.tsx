const ContactSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-16 text-glow">
          Get In Touch 📬
        </h2>
        <div className="glass-strong rounded-3xl p-12">
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Whether you're looking to collaborate on innovative projects or explore new opportunities, I'm always excited to connect. Drop me a message!
          </p>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-2xl px-8 py-4 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 group flex items-center justify-center gap-3 mb-8 mx-auto w-fit"
          >
            <img 
              src="/misc/resume.png" 
              alt="Resume"
              className="w-6 h-6 object-contain brightness-100" 
            />
            <span className="text-white/80 text-lg group-hover:text-blue-400">View Resume</span>
          </a>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/waleed-t/" 
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl px-8 py-4 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 group flex items-center justify-center gap-3"
            >
              <img 
                src="/misc/linkedin.webp" 
                alt="LinkedIn"
                className="w-6 h-6 object-contain brightness-100" 
              />
              <span className="text-white/80 text-lg group-hover:text-red-400">LinkedIn</span>
            </a>

            <a
              href="https://github.com/Waleed2660"
              target="_blank"
              rel="noopener noreferrer" 
              className="glass rounded-2xl px-8 py-4 hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105 group flex items-center justify-center gap-3"
            >
              <img 
                src="/misc/github.png" 
                alt="GitHub"
                className="w-6 h-6 object-contain brightness-100" 
              />
              <span className="text-white/80 text-lg group-hover:text-red-400">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
