const HomeSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      
        <div className="w-full sm:max-w-4xl text-center">
        <div className="glass-strong rounded-3xl p-6 sm:p-12 transition-all duration-500 hover:scale-105 sm:hover:scale-110 transform-gpu">
          
          {/* Person sitting on the left side */}
          <div className="absolute -top-20 sm:-top-30 left-2 sm:left-4 z-10">
            <img
              src="../../dev_hoodie_sitting.png"
              alt="Profile image"
              className="w-[100px] h-[140px] sm:w-[140px] sm:h-[190px] rounded-lg [filter:drop-shadow(0_25px_15px_rgba(0,0,0,0.2))]"
            />
          </div>


          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-glow">
            Waleed Tariq
          </h1>
          <h1 className="text-lg sm:text-xl md:text-2xl text-white/50 italic mb-6 sm:mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            Software Engineer @ Sainsbury's
            <span className="inline-flex items-center opacity-75">
              📍 Manchester, UK
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Building reliable backends that make complex problems look simple
          </p>
          <div className="flex justify-center flex-wrap gap-3">
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
            <div className="glass rounded-2xl px-6 py-3">
              <span className="text-white/80">3+ YOE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
