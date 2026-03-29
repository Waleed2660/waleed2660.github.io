import { ChevronDown, ChevronUp, CircleDot } from "lucide-react";
import { useState } from "react";

interface Promotion {
  title: string;
  period: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  logo: string;
  period: string;
  tech: string[];
  description: string[];
  promotions?: Promotion[];
}

const ExperienceSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const experiences: Experience[] = [
    {
      title: "Software Engineer",
      company: "Sainsbury's Tech",
      location: "Manchester, UK",
      logo: "/work_exp/sainsburys.webp",
      period: "2025 - Present",
      tech: ["Java", "Spring Boot", "Apache Kafka", "Kubernetes", "AWS"],
      description: [
        "Part of Digital Fulfilment team, developing critical backend services that calculate accurate delivery timelines for customer orders",
        "Currently developing a new order reservation proposition, enabling advanced inventory management and improved customer experience through real-time stock availability",
        "Building event-driven microservices using Spring Boot and Apache Kafka, handling high-volume data streams for real-time order processing and inventory updates",
        "Architecting solutions using diverse data stores (PostgreSQL, MongoDB, DynamoDB) to optimize for different data access patterns and performance requirements",
        "Managing deployments and infrastructure on AWS using Kubernetes, ensuring high availability and scalability of services",
        "Collaborating with product teams and stakeholders to design and implement solutions that improve order fulfillment accuracy and efficiency"
      ] as string[]
    },
    {
      title: "Software Engineer",
      company: "The Hut Group",
      location: "Manchester, UK",
      logo: "/work_exp/thg.webp",
      period: "2022 - 2025",
      tech: ["Java", "Spring Boot", "Apache ActiveMQ"],
      promotions: [
        { title: "Software Engineer", period: "2024 - 2025" },
        { title: "Graduate Software Engineer", period: "2022 - 2024" },
      ],
      description: [
        "Part of Order Processing Team which looks after microservices responsible for processing orders, allocating & generating shipments for Warehouses by leveraging in-depth knowledge in Java, Spring Boot, Apache ActiveMQ, Tomcat, Docker, and MSSQL",
        "Day-to-day work involves developing & deploying new features, bug fixing, code reviews, delivering knowledge share sessions, supporting operations team, providing technical details to senior management.",
        "Led my team for Black Friday 2024, targeting application optimization by improving SQL queries, decoupling unnecessary dependencies, monitoring application and VM metrics while also writing new scripts to load test our applications",
        "Developed strong expertise in SQL & Jenkins to deploy applications on Kubernetes & Linux based VMs",
        "Collaborated with various teams to develop solutions for new clients while ensuring backward compatibility for existing clients.",
        "Efficiently managed escalated incidents from clients, briefed senior management with concise reports on impacts, and provided effective solutions to resolve them promptly."
      ] as string[]
    },
    {
      title: "Machine Learning Researcher",
      company: "Lancaster University",
      location: "Lancaster, UK",
      logo: "/work_exp/lancaster-uni.webp",
      period: "2022 - 2022",
      tech: ["Python", "Machine Learning", "OpenCV", "PyTorch", "Data Annotations"],
      description: [
        "This research project was offered to me as an extension to my Final Year Project. My research was aimed at fine tuning & evaluating YOLOv3 and YOLOv5 machine learning models to detect landfills from both satellite and drone imagery.",
        "These models were trained on Google cloud for weeks while being tested & evaluated regularly to fine tune training parameters.",
        "I collected a training dataset containing 2,000 high quality images through Google Earth & open-source repositories.",
      ] as string[]
    }
  ];

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-0">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 sm:mb-16 text-glow">
          Experience 🎯
        </h2>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[25px] top-6 bottom-6 w-px bg-white/10" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-[14px] top-9 w-[22px] h-[22px] rounded-full border-2 z-10 transition-colors duration-300
                  ${expandedCard === index
                    ? 'bg-blue-400 border-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.6)]'
                    : 'bg-slate-800 border-white/30 group-hover:border-blue-400'
                  }`}
                />

                {/* Card */}
                <div
                  className={`glass-strong rounded-3xl p-8 transition-all duration-500 hover:bg-white/10
                    ${expandedCard === index ? 'scale-[1.02]' : 'hover:scale-[1.02]'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        width="80"
                        height="80"
                        loading="lazy"
                        className="w-20 h-20 object-contain filter brightness-100"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-2xl font-semibold text-white">{exp.title}</h3>
                        <span className="text-blue-300 text-lg">{exp.period}</span>
                      </div>
                      <div className="space-y-1 mb-4">
                        <p className="text-white/70 text-xl">{exp.company}</p>
                        <p className="text-white/40 text-sm">{exp.location}</p>
                      </div>

                      {/* Promotion ladder */}
                      {exp.promotions && (
                        <div className="flex flex-col mb-4 w-fit">
                          {exp.promotions.map((p, i) => (
                            <div key={i} className="flex flex-col items-start">
                              <div className="flex items-center gap-2">
                                <span className="text-white/70 text-sm font-medium">{p.title}</span>
                                <span className="text-white/30 text-xs">{p.period}</span>
                              </div>
                              {i < exp.promotions!.length - 1 && (
                                <span className="text-green-400/60 text-xs my-1 w-full text-center">↑</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {exp.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="glass rounded-xl px-4 py-2 text-white/80 text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Description - shows when expanded */}
                      <div className={`overflow-hidden transition-all duration-700 ${
                        expandedCard === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <ul className="space-y-4 py-2">
                          {exp.description.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CircleDot className="w-5 h-5 mt-1 text-blue-300/70 flex-shrink-0" />
                              <span className="text-white/70 text-lg leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleCard(index)}
                      className="self-end md:self-center flex-shrink-0 text-white/50 hover:text-white/90 transition-colors flex flex-col items-center"
                    >
                      {expandedCard === index ? (
                        <>
                          <ChevronUp className="w-6 h-6" />
                          <span className="text-sm mt-1">Collapse</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-6 h-6" />
                          <span className="text-sm mt-1">Expand</span>
                        </>
                      )}
                    </button>
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

export default ExperienceSection;
