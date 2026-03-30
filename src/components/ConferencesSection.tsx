import { useState } from "react";
import { ExternalLink, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";

type Talk = {
  title: string;
  speaker?: string;
  takeaway: string;
};

type PhotoSlot = {
  src: string;
  alt: string;
  span?: "col" | "row" | "both" | "full";
  gridCol?: string;
  gridRow?: string;
};

type Conference = {
  name: string;
  shortName: string;
  edition: string;
  date: string;
  location: string;
  emoji: string;
  accentColor: string;
  tagline: string;
  summary: string | React.ReactNode;
  talks: Talk[];
  tags: string[];
  links: { label: string; url: string; icon?: string }[];
  photos: PhotoSlot[];
  gridHeight?: string;
};

const conferences: Conference[] = [
  {
    name: "Capital Connections",
    shortName: "CAP CON",
    edition: "2025",
    date: "March 2025",
    location: "Manchester, UK",
    emoji: "https://www.lancaster.ac.uk/media/wdp/style-assets/images/foundation/lu-shield.svg",
    accentColor: "from-red-500/20 to-orange-500/10",
    tagline: "Lancaster University alumni networking",
    summary:
      "Was invited by the Grow Your Future team as a Lancaster alumnus to come and share my experiences with current students. Spent the evening going around chatting with students about the realities of the job hunt — what the process actually looks like, how to manage the pressure, and what to genuinely expect from your first role. Lots of great questions and good conversations; it was rewarding to help in the same way others helped me when I was starting out.",
    talks: [
      {
        title: "Alumni Speaker",
        takeaway:
          "Shared my journey from graduating at Lancaster to landing a full-time engineering role — the highs, the rejections, and the practical things that actually made a difference.",
      },
      {
        title: "Student Q&A",
        takeaway:
          "Walked through questions on job hunting strategy, what work pressure looks like in practice, salary expectations, and how to build confidence going into interviews and early in your career.",
      },
    ],
    tags: ["Networking", "Alumni", "Lancaster University", "Grow Your Future", "Career Development"],
    links: [
      { label: "Grow Your Future", url: "https://portal.lancaster.ac.uk/ask/grow-your-future/", icon: "https://www.lancaster.ac.uk/media/wdp/style-assets/images/foundation/lu-shield.svg" },
    ],
    photos: [
      { src: "/conferences/gyf/gyf_talk_2025.webp", alt: "Talk at Capital Connections 2025" },
      { src: "/conferences/gyf/students_2025.webp", alt: "Students at Capital Connections 2025" },
    ],
  },
  {
    name: "Devoxx UK",
    shortName: "DEVOXX",
    edition: "2025",
    date: "May 2025",
    location: "London, UK",
    emoji: "🎤",
    accentColor: "from-violet-500/20 to-blue-500/10",
    tagline: "Europe's largest Java & JVM developer conference",
    summary:
      "Spent two days at Business Design Centre surrounded by hundreds of engineers deep-diving into the Java ecosystem, distributed systems, AI integration, and the broader craft of software engineering. A mix of deep technical talks, lightning sessions, and hallway conversations that reinforced just how fast the industry is moving.",
    talks: [
      {
        title: "Virtual Threads & Structured Concurrency",
        speaker: "JDK Core Team",
        takeaway:
          "Project Loom's virtual threads finally make thread-per-request viable at scale — the mental model shift from reactive to sequential code with the same throughput is genuinely exciting.",
      },
      {
        title: "Kafka at the Edge",
        takeaway:
          "Explored patterns for running Kafka consumers close to data sources, reducing latency and improving fault isolation in distributed event-driven architectures.",
      },
      {
        title: "AI-Augmented Development",
        takeaway:
          "Real talk on where LLMs actually help in a professional engineering workflow and where they don't — code generation, test writing, and documentation are useful; architecture decisions still need humans.",
      },
      {
        title: "Kubernetes Cost Optimisation",
        takeaway:
          "Practical techniques for right-sizing pods, using spot nodes for non-critical workloads, and reading resource metrics you're probably ignoring today.",
      },
    ],
    tags: ["Java", "JVM", "Spring Boot", "Kafka", "Kubernetes", "Virtual Threads", "AI", "Architecture"],
    links: [
      { label: "Devoxx UK Website", url: "https://www.devoxx.co.uk/" },
      { label: "Talks on YouTube", url: "https://www.youtube.com/@DevoxxUK" },
    ],
    photos: [
      { src: "/conferences/devoxx2025/group_photo.webp", alt: "Group photo", span: "col" },
      { src: "/conferences/devoxx2025/conference_hall.webp", alt: "Conference hall" },
      { src: "/conferences/devoxx2025/redbull_racing_sim.webp", alt: "Red Bull Racing F1 sim experience" },
      { src: "/conferences/devoxx2025/virtual_threads_talk.webp", alt: "Virtual Threads talk" },
      { src: "/conferences/devoxx2025/snack_break.webp", alt: "Snack break" }
    ],
  },
  {
    name: "Sainsbury's Tech Con",
    shortName: "TECH CON",
    edition: "2025",
    date: "June 2025",
    location: "London, UK",
    emoji: "🏆",
    accentColor: "from-orange-500/20 to-yellow-500/10",
    tagline: "Sainsbury's Digital, Tech and Data Conference",
    summary: (
      <>
        My first ever internal tech conference and what a way to experience it. My team walked away with the{" "}
        <span className="text-yellow-300 font-semibold">Strategic Team of the Year</span>{" "}
        award. Heard from a brilliant lineup of speakers including Bruce Daisley and Kimberly Wilson across a range of topics, and spent time exploring stands from various companies showcasing their latest work.
      </>
    ),
    talks: [
      {
        title: "Bruce Daisley & Kimberly Wilson",
        takeaway:
          "Compelling talks on culture, performance, and what it actually takes to build teams that do great work — the kind of perspective that sticks with you well after the conference ends.",
      },
      {
        title: "Industry Stands & Showcases",
        takeaway:
          "Explored stands from a wide range of companies showing off their latest tech and achievements — a good reminder of just how fast things are moving across the industry.",
      },
    ],
    tags: ["Sainsbury's", "Tech Conference", "Internal Event", "Award", "Digital", "Data"],
    links: [
      { label: "Sainsbury's Tech", url: "https://www.sainsburys.jobs/teams/technology" },
    ],
    photos: [
      { src: "/conferences/tech_con/team.webp", alt: "Team at Sainsbury's Tech Con", span: "col" },
      { src: "/conferences/tech_con/award.webp", alt: "Strategic Team of the Year award" }
    ],
  },
  {
    name: "Capital Connections",
    shortName: "CAP CON",
    edition: "2026",
    date: "March 2026",
    location: "Manchester, UK",
    emoji: "https://www.lancaster.ac.uk/media/wdp/style-assets/images/foundation/lu-shield.svg",
    accentColor: "from-emerald-500/20 to-teal-500/10",
    tagline: "Lancaster University alumni networking",
    summary:
      "Invited again by the Grow Your Future team as a Lancaster alumnus to share my experiences with current students. Spent the evening chatting with students one-on-one, fielding questions about the job hunt, what work is actually like day-to-day, managing expectations around salary and culture, and dealing with the pressure of breaking into industry. Always a great event to be part of.",
    talks: [
      {
        title: "Alumni Speaker",
        takeaway:
          "Shared my own journey from Lancaster to full-time software engineering — the job search grind, what I wish I'd known, and how to stand out without burning out.",
      },
      {
        title: "Student Q&A",
        takeaway:
          "Answered a lot of honest questions: how to handle rejection in the job hunt, what work pressure really feels like, what to actually expect from a first role, and how to make the most of the time left at university.",
      },
    ],
    tags: ["Networking", "Alumni", "Lancaster University", "Grow Your Future", "Career Development"],
    links: [
      { label: "Grow Your Future", url: "https://portal.lancaster.ac.uk/ask/grow-your-future/", icon: "https://www.lancaster.ac.uk/media/wdp/style-assets/images/foundation/lu-shield.svg" },
    ],
    photos: [
      { src: "/conferences/gyf/students_2026.webp", alt: "Students at Capital Connections 2026" },
      { src: "/conferences/gyf/gyf_2026.webp", alt: "Capital Connections 2026" },
    ],
  },
];

const PhotoGrid = ({ photos, accent, gridHeight = "h-64" }: { photos: PhotoSlot[]; accent: string; gridHeight?: string }) => {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [errored, setErrored] = useState<Record<number, boolean>>({});

  const placeholderEmojis = ["📸", "🎙️", "💡", "🧑‍💻", "🎯", "☕"];

  return (
    <div className={photos.length <= 2 ? `flex gap-2 ${gridHeight}` : `grid grid-cols-3 grid-rows-2 gap-2 ${gridHeight} overflow-hidden`}>
      {photos.map((photo, i) => {
        const isLoaded = loaded[i];
        const isErrored = errored[i];
        const colSpan = photo.span === "full" ? "col-span-3" : photo.span === "col" || photo.span === "both" ? "col-span-2" : "col-span-1";
        const rowSpan = photo.span === "row" || photo.span === "both" ? "row-span-2" : "row-span-1";
        const flexClass = photos.length <= 2 ? "flex-1 min-w-0" : `${colSpan} ${rowSpan}`;

        return (
          <div
            key={i}
            className={`${flexClass} relative rounded-2xl overflow-hidden glass group/photo`}
            style={photos.length > 2 && (photo.gridCol || photo.gridRow) ? { gridColumn: photo.gridCol, gridRow: photo.gridRow } : undefined}
          >
            {!isErrored && (
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-500 group-hover/photo:scale-105 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                onError={() => setErrored((p) => ({ ...p, [i]: true }))}
              />
            )}
            {/* Placeholder shown when not yet loaded or errored */}
            {(!isLoaded || isErrored) && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${accent} border border-white/5`}
              >
                <span className="text-2xl mb-1 opacity-40">{placeholderEmojis[i % placeholderEmojis.length]}</span>
                <span className="text-white/20 text-xs text-center px-2">{photo.alt}</span>
              </div>
            )}
            {/* Hover label overlay on loaded photos */}
            {isLoaded && !isErrored && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-white/80 text-xs">{photo.alt}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ConferencesSection = () => {
  const [expandedTalks, setExpandedTalks] = useState<Record<number, boolean>>({});

  return (
    <section className="flex items-center justify-center px-6 py-24 relative z-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-glow relative">
          On The Ground 🎟️
        </h2>
        <p className="text-center text-white/50 mb-16 text-lg">
          Conferences, meetups & events — things I attended and what I took away
        </p>

        <div className="flex flex-col gap-10">
          {conferences.map((conf, index) => (
            <div
              key={index}
              className="glass-strong rounded-3xl overflow-hidden hover:bg-white/10 hover:scale-[1.02] transition-all duration-500 group"
            >
              {/* Header band */}
              <div className={`bg-gradient-to-r ${conf.accentColor} px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/5`}>
                <div className="flex items-center gap-4">
                  {conf.emoji.startsWith("http") ? (
                    <img src={conf.emoji} alt="" loading="lazy" className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-4xl">{conf.emoji}</span>
                  )}
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {conf.name}
                      </h3>
                      <span className="glass rounded-xl px-3 py-1 text-xs font-bold text-white/70 tracking-widest uppercase">
                        {conf.edition}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm mt-0.5 italic">{conf.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {conf.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {conf.location}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 grid lg:grid-cols-2 gap-8">
                {/* Left: Text content */}
                <div className="flex flex-col gap-6">
                  {/* Summary */}
                  <p className="text-white/70 leading-relaxed text-sm">{conf.summary}</p>

                  {/* Key talks / sessions */}
                  <div>
                    <button
                      onClick={() =>
                        setExpandedTalks((p) => ({ ...p, [index]: !p[index] }))
                      }
                      className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-semibold mb-3 hover:text-white/70 transition-colors"
                    >
                      {expandedTalks[index] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                      Key Sessions & Takeaways ({conf.talks.length})
                    </button>

                    <div className={`overflow-hidden transition-all duration-500 ${expandedTalks[index] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="flex flex-col gap-3">
                        {conf.talks.map((talk, ti) => (
                          <div
                            key={ti}
                            className="glass rounded-2xl px-4 py-3 border-l-2 border-blue-400/30"
                          >
                            <p className="text-white/90 text-sm font-medium mb-1">{talk.title}</p>
                            {talk.speaker && (
                              <p className="text-white/40 text-xs mb-1.5">{talk.speaker}</p>
                            )}
                            <p className="text-white/55 text-xs leading-relaxed">{talk.takeaway}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {conf.tags.map((tag, ti) => (
                      <span key={ti} className="glass rounded-xl px-3 py-1 text-white/80 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 flex-wrap mt-auto">
                    {conf.links.map((link, li) => (
                      <a
                        key={li}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 glass rounded-xl px-4 py-2 text-white/60 text-xs hover:text-blue-300 hover:bg-white/10 transition-all group/link"
                      >
                        {link.icon ? (
                          <img src={link.icon} alt="" loading="lazy" className="w-4 h-4 object-contain brightness-0 invert opacity-60 group-hover/link:opacity-100" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right: Photo grid */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">
                    Photos
                  </p>
                  <PhotoGrid photos={conf.photos} accent={conf.accentColor} gridHeight={conf.gridHeight} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConferencesSection;
