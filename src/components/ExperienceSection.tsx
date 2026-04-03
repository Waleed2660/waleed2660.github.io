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
  brandColor: string;
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
      brandColor: "bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30 hover:border-orange-500/50",
      description: [
        "Part of Digital Fulfilment team, developing critical backend services that calculate accurate delivery timelines for customer orders — contributing to Sainsbury's online platform serving millions of weekly shoppers across the UK",
        "Currently developing a new order reservation proposition, enabling advanced inventory management and improved customer experience through real-time stock availability",
        "Building event-driven microservices using Spring Boot and Apache Kafka, processing high-throughput event streams across multiple topics powering real-time order processing and inventory updates",
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
      brandColor: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40 hover:border-cyan-400/60",
      promotions: [
        { title: "Software Engineer", period: "2024 - 2025" },
        { title: "Graduate Software Engineer", period: "2022 - 2024" },
      ],
      description: [
        "Part of Order Processing Team responsible for microservices that process orders and allocate & generate shipments for warehouses, serving THG's global brand portfolio including Myprotein and LOOKFANTASTIC — leveraging Java, Spring Boot, Apache ActiveMQ, Tomcat, Docker, and MSSQL",
        "Day-to-day work involves developing & deploying new features, bug fixing, code reviews, delivering knowledge share sessions, supporting operations team, providing technical details to senior management.",
        "Led my team for Black Friday 2024, targeting application optimization by improving SQL queries, decoupling unnecessary dependencies and load testing our applications — delivering zero critical incidents during the highest-traffic trading window of the year",
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
      brandColor: "bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/30 hover:border-red-500/50",
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
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 sm:mb-16 text-glow">
          Experience
        </h2>

        {/* Cards Grid */}
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="group">
              {/* Card */}
              <div
                className={`glass-strong rounded-2xl p-8 transition-all duration-300 border
                  ${exp.brandColor}
                  ${expandedCard === index ? 'scale-[1.01]' : 'hover:scale-[1.01] hover:-translate-y-1'}`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <img
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      width="96"
                      height="96"
                      loading="lazy"
                      className="w-24 h-24 object-contain filter brightness-100 hover:scale-110 transition-transform"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">{exp.title}</h3>
                        <p className="text-xl text-white/80">{exp.company}</p>
                        <p className="text-white/50 text-sm mt-1">{exp.location}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="glass px-4 py-2 rounded-lg text-blue-300 text-sm font-semibold whitespace-nowrap inline-block">
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {/* Promotion ladder */}
                    {exp.promotions && (
                      <div className="glass rounded-xl p-3 mb-4 w-fit bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                        <div className="flex items-center gap-3">
                          {exp.promotions.map((p, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="text-white/90 text-xs font-semibold">{p.title}</span>
                                <span className="text-white/40 text-[10px]">{p.period}</span>
                              </div>
                              {i < exp.promotions!.length - 1 && (
                                <span className="text-green-400 text-lg">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="glass rounded-lg px-3 py-1 text-white/70 text-xs hover:text-white hover:bg-white/10 transition-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Description - shows when expanded */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      expandedCard === index ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="border-t border-white/10 pt-4">
                        <ul className="space-y-3">
                          {exp.description.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CircleDot className="w-4 h-4 mt-1 text-blue-400/70 flex-shrink-0" />
                              <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleCard(index)}
                  className="mt-3 mx-auto flex items-center gap-2 text-white/50 hover:text-white/90 transition-all hover:bg-white/5 px-4 py-1.5 rounded-lg text-sm group"
                >
                  {expandedCard === index ? (
                    <>
                      <span className="font-medium">Hide Details</span>
                      <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span className="font-medium">View Details</span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
