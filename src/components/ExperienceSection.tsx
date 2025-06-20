const ExperienceSection = () => {
  const experiences = [
    {
      title: "Software Engineer",
      company: "Sainsbury's Tech",
      logo: "/work_exp/sainsburys.png",
      period: "2025 - Present",
      tech: ["Java", "Spring Boot", "Apache Kafka", "Kubernetes", "AWS"]
    },
    {
      title: "Software Engineer",
      company: "The Hut Group",
      logo: "/work_exp/thg.jpg",
      period: "2022 - 2025",
      tech: ["Java", "Spring Boot", "Apache ActiveMQ"]
    },
    {
      title: "Machine Learning Researcher",
      company: "Lancaster University",
      logo: "/work_exp/lancaster-uni.webp",
      period: "2022 - 2022",
      tech: ["Python", "Machine Learning", "OpenCV", "PyTorch", "Data Annotations"]
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">
          Experience 🎯
        </h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="glass-strong rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 flex flex-col md:flex-row gap-8"
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                <img 
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  className="w-20 h-20 object-contain filter brightness-100"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-white">{exp.title}</h3>
                  <span className="text-blue-300 text-lg">{exp.period}</span>
                </div>
                <p className="text-white/70 text-xl mb-4">{exp.company}</p>
                <div className="flex flex-wrap gap-3">
                  {exp.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="glass rounded-xl px-4 py-2 text-white/80 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
