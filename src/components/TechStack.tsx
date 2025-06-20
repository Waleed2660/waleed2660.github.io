interface Technology {
  name: string;
  iconPath: string;
}

const techCategories = [
  {
    title: "Languages & Core Technologies",
    technologies: [
      { name: "Java", iconPath: "/tech_icons/java.png" },
      { name: "Python", iconPath: "/tech_icons/python.png" },
      { name: "JavaScript", iconPath: "/tech_icons/javascript.png" },
      { name: "React", iconPath: "/tech_icons/react.svg" },
      { name: "Tailwind CSS", iconPath: "/tech_icons/tailwindcss.svg" },
      { name: "AngularJS", iconPath: "/tech_icons/angular.svg" },
      { name: "Spring Boot", iconPath: "/tech_icons/springboot.svg" },
      { name: "REST API", iconPath: "/tech_icons/rest.svg" },
      { name: "Gradle", iconPath: "/tech_icons/gradle.svg" },
    ]
  },
  {
    title: "Cloud & Infrastructure",
    technologies: [
      { name: "Docker", iconPath: "/tech_icons/docker.svg" },
      { name: "Kubernetes", iconPath: "/tech_icons/k8s.svg" },
      { name: "AWS", iconPath: "/tech_icons/aws.svg" },
      { name: "Amazon S3", iconPath: "/tech_icons/s3.svg" },
      { name: "Nginx", iconPath: "/tech_icons/nginx.svg" },
      { name: "Apache Tomcat", iconPath: "/tech_icons/tomcat.png" },
      { name: "Apache ActiveMQ", iconPath: "/tech_icons/activemq.svg" },
      { name: "Apache Kafka", iconPath: "/tech_icons/kafka.png" },
      { name: "RabbitMQ", iconPath: "/tech_icons/rabbit.png" }
    ]
  },
  {
    title: "DevOps & Tools",
    technologies: [
      { name: "Git", iconPath: "/tech_icons/git.svg" },
      { name: "GitHub Actions", iconPath: "/tech_icons/githubactions.svg" },
      { name: "Jenkins", iconPath: "/tech_icons/jenkins.svg" },
      { name: "IntelliJ Idea", iconPath: "/tech_icons/intellij.png" },
      { name: "JMeter", iconPath: "/tech_icons/jmeter.svg" },
    ]
  },
  {
    title: "Databases & Observability",
    technologies: [
      { name: "PostgreSQL", iconPath: "/tech_icons/postgresql.svg" },
      { name: "SQL Server", iconPath: "/tech_icons/mssql.svg" },
      { name: "MongoDB", iconPath: "/tech_icons/MongoDB.svg" },
      { name: "DynamoDB", iconPath: "/tech_icons/dynamodb.svg" },
      { name: "Elasticsearch", iconPath: "/tech_icons/elasticsearch.svg" },
      { name: "Prometheus", iconPath: "/tech_icons/prometheus.svg" },
      { name: "Grafana", iconPath: "/tech_icons/grafana.svg" },
      { name: "Graphite", iconPath: "/tech_icons/graphite.png" },
    ]
  }
];

const TechStack = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-glow">
        Tech Stack 🛠️
      </h2>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {techCategories.map((category, categoryIndex) => (
          <div 
            key={categoryIndex}
            className="rounded-3xl p-8 animate-float"
            style={{ animationDelay: `${categoryIndex * 0.2}s` }}
          >
            <h3 className="glass-strong rounded-3xl text-xl font-bold text-white mb-6 text-center p-2">
              {category.title}
            </h3>
            
            <div className="grid grid-cols-3 gap-1">
              {category.technologies.map(({ name, iconPath }, techIndex) => (
                <div
                  key={techIndex}
                  className="p-3 flex flex-col items-center justify-center group transition-all duration-300 hover:scale-150 cursor-pointer"
                  title={name}
                >
                  <img 
                    src={iconPath} 
                    alt={name}
                    className="w-10 h-10 mb-2 object-contain filter brightness-100 group-hover:brightness-110 transition-all"
                  />
                  <span className="text-white/80 text-xs font-medium text-center group-hover:text-white transition-colors">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;