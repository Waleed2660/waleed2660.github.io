import { Database, Server, Cloud, Globe, Code } from "lucide-react";

const techIcons = [
  { name: "Java", icon: Server },
  { name: "SpringBoot", icon: Globe },
  { name: "Node.js", icon: Code },
  { name: "PostgreSQL", icon: Database },
  { name: "MongoDB", icon: Database },
  { name: "AWS", icon: Cloud },
  { name: "Kubernetes", icon: Server },
  { name: "React", icon: Code },
  { name: "Docker", icon: Cloud },
];

const TechStack = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">
        Tech Stack 🛠️
      </h2>

      {/* 🍯 Honeycomb layout */}
      <div className="grid-honeycomb">
        {techIcons.map(({ name, icon: Icon }, i) => (
          <div
            key={i}
            className="bubble group"
            title={name}
          >
            <Icon className="w-8 h-8 text-blue-300 group-hover:text-blue-400" />
            <span className="sr-only">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;