interface Technology {
  name: string;
  iconPath: string;
}

const technologies: Technology[] = [
  { name: "Java", iconPath: "/tech_icons/java.webp" },
  { name: "Spring Boot", iconPath: "/tech_icons/springboot.svg" },
  { name: "Python", iconPath: "/tech_icons/python.webp" },
  { name: "JavaScript", iconPath: "/tech_icons/javascript.webp" },
  { name: "React", iconPath: "/tech_icons/react.svg" },
  { name: "Docker", iconPath: "/tech_icons/docker.svg" },
  { name: "Kubernetes", iconPath: "/tech_icons/k8s.svg" },
  { name: "AWS", iconPath: "/tech_icons/aws.svg" },
  { name: "PostgreSQL", iconPath: "/tech_icons/postgresql.svg" },
  { name: "MongoDB", iconPath: "/tech_icons/MongoDB.svg" },
  { name: "Kafka", iconPath: "/tech_icons/kafka.webp" },
  { name: "REST API", iconPath: "/tech_icons/rest.svg" },
  { name: "Git", iconPath: "/tech_icons/git.svg" },
  { name: "Tailwind CSS", iconPath: "/tech_icons/tailwindcss.svg" },
  { name: "AngularJS", iconPath: "/tech_icons/angular.svg" },
  { name: "Gradle", iconPath: "/tech_icons/gradle.svg" },
  { name: "Amazon S3", iconPath: "/tech_icons/s3.svg" },
  { name: "Nginx", iconPath: "/tech_icons/nginx.svg" },
  { name: "Tomcat", iconPath: "/tech_icons/tomcat.webp" },
  { name: "ActiveMQ", iconPath: "/tech_icons/activemq.svg" },
  { name: "RabbitMQ", iconPath: "/tech_icons/rabbit.webp" },
  { name: "GitHub Actions", iconPath: "/tech_icons/githubactions.svg" },
  { name: "Jenkins", iconPath: "/tech_icons/jenkins.svg" },
  { name: "IntelliJ", iconPath: "/tech_icons/intellij.webp" },
  { name: "JMeter", iconPath: "/tech_icons/jmeter.svg" },
  { name: "k6", iconPath: "/tech_icons/k6-logo.webp" },
  { name: "SQL Server", iconPath: "/tech_icons/mssql.svg" },
  { name: "DynamoDB", iconPath: "/tech_icons/dynamodb.svg" },
  { name: "Elasticsearch", iconPath: "/tech_icons/elasticsearch.svg" },
  { name: "Prometheus", iconPath: "/tech_icons/prometheus.svg" },
  { name: "Grafana", iconPath: "/tech_icons/grafana.svg" },
  { name: "Graphite", iconPath: "/tech_icons/graphite.webp" },
];

const TechStack = () => {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 relative">
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-glow">
        Tech Stack
      </h2>
      <p className="text-center text-white/50 mb-16 text-lg">
        Technologies I work with
      </p>

      <div className="w-full max-w-6xl relative">
        {/* Floating Tech Icons */}
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center group cursor-pointer
                transition-transform duration-200
                hover:scale-110 hover:-translate-y-2"
            >
              {/* Tooltip */}
              <span
                className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
              >
                {tech.name}
              </span>
              <img 
                src={tech.iconPath} 
                alt={tech.name}
                width="48"
                height="48"
                loading="lazy"
                className="w-12 h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;