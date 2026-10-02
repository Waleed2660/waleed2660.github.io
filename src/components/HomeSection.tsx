import { ArrowRight, ChevronDown, FileText, MapPin } from "lucide-react";
import HarborScene from "@/components/harbor/HarborScene";

const CAREER_START = new Date(2022, 6, 1); // July 2022 — THG start
const NAME = "Waleed Tariq";

function getYOE(): string {
  const now = new Date();
  const years = (now.getTime() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const floored = Math.floor(years);
  return `${floored}+ YEARS`;
}

interface HomeSectionProps {
  onNavigate?: (id: string) => void;
}

const HomeSection = ({ onNavigate }: HomeSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-28 md:pt-28 md:pb-10 overflow-hidden">
      <HarborScene name={NAME} yoe={getYOE()} />

      <p className="sr-only">
        Skills: Java, Spring Boot, Kubernetes, Docker, Kafka, PostgreSQL, MongoDB, Redis, RabbitMQ,
        AWS, Nginx, Jenkins, Grafana, k6, Prometheus, JMeter, Elasticsearch, Git.
      </p>

      <div className="mt-3 md:mt-5 w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center">
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate?.("experience")}
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-brand text-brand-contrast font-semibold tracking-tight transition-colors duration-200 hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            See my work
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full glass border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white/85 font-medium transition-colors duration-200 hover:border-brand/60 hover:text-slate-950 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            Résumé
          </a>
        </div>
        <p className="mt-5 inline-flex items-center gap-2 text-slate-500 dark:text-white/45">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          Manchester, UK
        </p>
        <ChevronDown
          className="mt-6 w-6 h-6 text-slate-400 dark:text-white/25 animate-nudge"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default HomeSection;
