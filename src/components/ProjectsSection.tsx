
const ProjectsSection = () => {
  const projects = [
    {
      title: "Spring Boot Learning Kit",
      description: "An open-source enterprise-grade Spring Boot application designed to help developers bridge the gap between tutorials and real-world development.",
      tech: ["Spring Boot", "ActiveMQ", "PostgreSQL", "Prometheus", "GitHub Actions", "JMeter", "RabbitMQ", "Apache Camel"],
      github: "https://github.com/Waleed2660",
      image: "/tech_icons/springboot.svg"
    },
    {
      title: "Nimbus",
      description: "Personal Cloud Storage webapp built with JS, React, Tailwind CSS. Allows file upload, download & directory navigation. Backend application is built with Java SpringBoot which uses Amazon S3 to store files.",
      tech: ["React", "Tailwind CSS", "Spring Boot", "AWS S3"],
      github: "https://github.com/Waleed2660/nimbus-ui",
      image: "/projects/nimbus_logo.png"
    },
    {
      title: "Fly Drone with Xbox Controller",
      description: "Created a script using Tello SDK & API to control DJI Tello drone with an Xbox Controller, including live video feed streaming from the drone's camera to your device.",
      tech: ["Python", "OpenCV", "DJI Tello SDK", "REST"],
      github: "https://github.com/Waleed2660/DJITello_Xbox_Controller",
      image: "/projects/controller.png"
    },
    {
      title: "Handy",
      description: "Inspired by Apple Vision Pro, this project uses Google's Mediapipe framework and OpenCV to detect hand gestures to control your desktop cursor, supporting actions like pinching and dragging.",
      tech: ["Python", "OpenCV", "Mediapipe"],
      github: "https://github.com/Waleed2660/Handy",
      image: "/projects/pinching-hand.svg"
    },
    {
      title: "C.O.G.S",
      description: "A 2D platform fighter game inspired by classic titles like Mario & Contra, featuring action-packed gameplay and retro-style graphics. Built using Java and JSFML (Java Simple and Fast Multimedia Library).",
      tech: ["Java", "JSFML", "Game Development"],
      github: "https://github.com/Waleed2660/COGS",
      image: "/projects/cogs.svg"
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative z-20 sm:pt-60">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow relative">
          Projects 🚀
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass-strong rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 group"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-10 h-10 object-contain brightness-90 group-hover:brightness-100 transition-all"
                  />
                  <h3 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="glass rounded-xl px-3 py-1 text-white/80 text-sm inline-block mr-2"
                  >
                    {tech}
                  </div>
                ))}
                    </div>
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/50 hover:text-blue-300 transition-colors group/link"
                    >
                      <span className="text-sm opacity-40 group-hover/link:opacity-100 transition-opacity">View Code</span>
                      <img 
                        src="/misc/github.png" 
                        alt="GitHub"
                        className="w-6 h-6 object-contain brightness-50 group-hover/link:brightness-100 transition-all" 
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
