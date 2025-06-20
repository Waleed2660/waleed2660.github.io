
const ProjectsSection = () => {
  const projects = [
    {
      title: "Microservices Platform",
      description: "Scalable architecture handling 1M+ requests",
      tech: ["Node.js", "Redis", "Docker"]
    },
    {
      title: "Real-time Analytics API",
      description: "High-performance data processing pipeline",
      tech: ["Python", "Apache Kafka", "InfluxDB"]
    },
    {
      title: "Cloud Infrastructure",
      description: "Auto-scaling serverless deployment system",
      tech: ["AWS Lambda", "Terraform", "PostgreSQL"]
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">
          Projects 🚀
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass-strong rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 group"
            >
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="space-y-2">
                {project.tech.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="glass rounded-xl px-3 py-1 text-white/80 text-sm inline-block mr-2"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
