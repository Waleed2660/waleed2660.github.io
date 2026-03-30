import { ExternalLink, FlaskConical, BookOpen } from "lucide-react";

type Resource = {
  label: string;
  url: string;
};

type Experiment = {
  icon: string;
  status: "Experimenting" | "Learning" | "Building";
  statusColor: string;
  title: string;
  description: string;
  tags: string[];
  resources: Resource[];
  motivation: string;
};

const experiments: Experiment[] = [
  {
    icon: "⚡",
    status: "Experimenting",
    statusColor: "text-orange-300 bg-orange-400/10 border border-orange-400/20",
    title: "High-RPS Stock Allocation Engine",
    description:
      "Exploring a hybrid Redis + PostgreSQL architecture for a stock allocation engine capable of handling extreme request-per-second throughput. The idea is to use Redis as an atomic counter & lock layer for hot inventory slots, with PostgreSQL as the source of truth, allowing sub-millisecond allocation decisions",
    motivation:
      "Inspired by real-world problems in order fulfilment: how do you allocate finite stock across thousands of simultaneous checkout requests without overselling or deadlocking?",
    tags: ["Redis", "PostgreSQL", "High Throughput", "Distributed Systems", "Inventory Management"],
    resources: [
      { label: "Redis Atomic Counters", url: "https://redis.io/docs/latest/commands/incr/" },
      { label: "Redis Lua Scripting", url: "https://redis.io/docs/latest/develop/interact/programmability/lua-api/" },
      { label: "PG Advisory Locks", url: "https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS" },
      { label: "Optimistic Locking in PG", url: "https://www.postgresql.org/docs/current/mvcc-intro.html" },
    ],
  },
  {
    icon: "🧠",
    status: "Learning",
    statusColor: "text-purple-300 bg-purple-400/10 border border-purple-400/20",
    title: "Vectorless PageIndex for RAG",
    description:
      "Digging into retrieval strategies for RAG pipelines that don't rely on dense vector embeddings. PageIndex (as implemented in LlamaIndex) chunks documents at the page level and uses keyword / BM25-style retrieval — cheaper to run, no embedding model needed, surprisingly effective for structured documents like PDFs and reports.",
    motivation:
      "Vector DBs are powerful but come with cost & latency tradeoffs. Curious about when simpler, keyword-based page-level indexing can replace or complement them in production RAG systems.",
    tags: ["RAG", "LlamaIndex", "BM25", "LLM", "Information Retrieval", "NLP"],
    resources: [
      { label: "PageIndex by VectifyAI", url: "https://github.com/VectifyAI/PageIndex" },
      { label: "LlamaIndex Docs", url: "https://docs.llamaindex.ai/en/stable/" },
      { label: "BM25 Retrieval", url: "https://docs.llamaindex.ai/en/stable/examples/retrievers/bm25_retriever/" },
      { label: "RAG Survey Paper", url: "https://arxiv.org/abs/2312.10997" },
    ],
  },
];

const statusIcon = (status: Experiment["status"]) => {
  if (status === "Learning") return <BookOpen className="w-3.5 h-3.5" />;
  return <FlaskConical className="w-3.5 h-3.5" />;
};

const CurrentlySection = () => {
  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-glow relative">
          Currently Exploring
        </h2>
        <p className="text-center text-white/50 mb-16 text-lg">
          Things I'm actively experimenting with or learning outside of work
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {experiments.map((exp, index) => (
            <div
              key={index}
              className="glass-strong rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] group flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{exp.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${exp.statusColor}`}
                    >
                      {statusIcon(exp.status)}
                      {exp.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/70 leading-relaxed mb-4 text-sm">
                {exp.description}
              </p>

              {/* Motivation callout */}
              <div className="glass rounded-2xl px-4 py-3 mb-5 border-l-2 border-blue-400/40">
                <p className="text-white/50 text-xs leading-relaxed italic">
                  💡 {exp.motivation}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {exp.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="glass rounded-xl px-3 py-1 text-white/80 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Resources */}
              <div className="mt-auto">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">
                  Resources
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {exp.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 glass rounded-xl px-3 py-2 text-white/60 text-xs hover:text-blue-300 hover:bg-white/10 transition-all group/link"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                      <span className="truncate">{res.label}</span>
                    </a>
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

export default CurrentlySection;
