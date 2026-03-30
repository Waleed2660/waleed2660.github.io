
import { useEffect, useState } from "react";

type Project = {
  title: string;
  description: string;
  tech: string[];
  github: string;
  image: string;
  stars?: number;
  forks?: number;
  highlights?: string[];
};

const ProjectsSection = () => {
  const [springbootStars, setSpringbootStars] = useState<number>(94);
  const [springbootForks, setSpringbootForks] = useState<number>(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/Waleed2660/springboot-learning-kit")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setSpringbootStars(data.stargazers_count);
        }
        if (typeof data.forks_count === "number") {
          setSpringbootForks(data.forks_count);
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  const projects: Project[] = [
    {
      title: "Spring Boot Learning Kit",
      description: "An open-source enterprise-grade Spring Boot application designed to help developers bridge the gap between tutorials and real-world development.",
      tech: ["Spring Boot", "ActiveMQ", "PostgreSQL", "Prometheus", "GitHub Actions", "JMeter", "RabbitMQ", "Apache Camel"],
      github: "https://github.com/Waleed2660/springboot-learning-kit",
      image: "/tech_icons/springboot.svg",
      stars: springbootStars,
      forks: springbootForks,
      highlights: [
        "Project setup with Spring Boot best practices & layered architecture",
        "Apache ActiveMQ integration with Apache Camel routing",
        "RabbitMQ messaging with Spring Boot",
        "Database schema migration & query optimisation with Flyway",
        "Unit & integration tests with JUnit and Testcontainers",
        "Prometheus metrics integration & Grafana dashboards",
        "Load testing with JMeter & k6",
        "Code style enforcement with Checkstyle & formatting tools",
      ]
    },
    {
      title: "Nimbus",
      description: "Personal Cloud Storage webapp built with JS, React, Tailwind CSS. Allows file upload, download & directory navigation. Backend application is built with Java SpringBoot which uses Amazon S3 to store files.",
      tech: ["React", "Tailwind CSS", "Spring Boot", "AWS S3"],
      github: "https://github.com/Waleed2660/nimbus-ui",
      image: "/projects/nimbus_logo.webp"
    },
    {
      title: "Fly Drone with Xbox Controller",
      description: "Created a script using Tello SDK & API to control DJI Tello drone with an Xbox Controller, including live video feed streaming from the drone's camera to your device.",
      tech: ["Python", "OpenCV", "DJI Tello SDK", "REST"],
      github: "https://github.com/Waleed2660/DJITello_Xbox_Controller",
      image: "/projects/controller.webp"
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
    <section className="flex items-center justify-center px-6 py-24 relative z-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow relative">
          Projects 🚀
        </h2>
        <div className="flex flex-col gap-8">
          {/* Featured project - full width */}
          {projects.filter(p => p.stars).map((project, index) => (
            <div
              key={`featured-${index}`}
              className="glass-strong featured-card rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] group"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3">
                  <img
                    src={project.image}
                    alt={project.title}
                    width="72"
                    height="72"
                    loading="lazy"
                    className="w-18 h-18 object-contain brightness-90 group-hover:brightness-100 transition-all"
                    style={{ width: 72, height: 72 }}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">{project.title}</h3>
                    <span className="glass rounded-xl px-3 py-1 text-xs font-bold text-blue-300/80 tracking-widest uppercase">Featured</span>
                    <span className="glass rounded-xl px-3 py-1 text-sm text-yellow-300/90 whitespace-nowrap">★ {project.stars}</span>
                    {project.forks !== undefined && project.forks > 0 && (
                      <span className="glass rounded-xl px-3 py-1 text-sm text-white/50 whitespace-nowrap">⑂ {project.forks}</span>
                    )}
                  </div>
                  <p className="text-white/70 mb-4 leading-relaxed">{project.description}</p>
                  {project.highlights && (
                    <ul className="mb-6 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                      {project.highlights.map((point, pi) => (
                        <li key={pi} className="flex items-start gap-2 text-white/60 text-sm">
                          <span className="text-blue-400/70 mt-0.5 flex-shrink-0">▸</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, ti) => (
                        <div key={ti} className="glass rounded-xl px-3 py-1 text-white/80 text-sm inline-block">{tech}</div>
                      ))}
                    </div>
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/50 hover:text-blue-300 transition-colors group/link ml-4 flex-shrink-0">
                      <span className="text-sm opacity-40 group-hover/link:opacity-100 transition-opacity">View Code</span>
                      <img src="/misc/github.webp" alt="GitHub" width="24" height="24" loading="lazy"
                        className="w-6 h-6 object-contain brightness-50 group-hover/link:brightness-100 transition-all" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Rest of projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => !p.stars).map((project, index) => (
            <div
              key={index}
              className={`glass-strong rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 group${project.stars ? " featured-card" : ""}`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    width="40"
                    height="40"
                    loading="lazy"
                    className="w-10 h-10 object-contain brightness-90 group-hover:brightness-100 transition-all"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {project.title}
                    </h3>
                    {project.stars && (
                      <span className="glass rounded-xl px-3 py-1 text-sm text-yellow-300/90 whitespace-nowrap">
                        ★ {project.stars}
                      </span>
                    )}
                  </div>
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
                        src="/misc/github.webp" 
                        alt="GitHub"
                        width="24"
                        height="24"
                        loading="lazy"
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
      </div>
    </section>
  );
};

export default ProjectsSection;
