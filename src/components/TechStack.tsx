import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface Technology {
  name: string;
  iconPath: string;
}

// Ordered by prominence. Index 0 takes the most central slot, where the dome
// falloff renders it largest, and each subsequent entry fills outward.
const technologies: Technology[] = [
  // Core day-to-day
  { name: "Java", iconPath: "/tech_icons/java.webp" },
  { name: "Spring Boot", iconPath: "/tech_icons/springboot.svg" },
  { name: "Kubernetes", iconPath: "/tech_icons/k8s.svg" },
  { name: "PostgreSQL", iconPath: "/tech_icons/postgresql.svg" },
  { name: "Kafka", iconPath: "/tech_icons/kafka.webp" },
  { name: "Docker", iconPath: "/tech_icons/docker.svg" },
  { name: "AWS", iconPath: "/tech_icons/aws.svg" },
  { name: "IntelliJ", iconPath: "/tech_icons/intellij.webp" },
  { name: "MongoDB", iconPath: "/tech_icons/MongoDB.svg" },
  { name: "Grafana", iconPath: "/tech_icons/grafana.svg" },
  // Regular
  { name: "Python", iconPath: "/tech_icons/python.webp" },
  { name: "Git", iconPath: "/tech_icons/git.svg" },
  { name: "Prometheus", iconPath: "/tech_icons/prometheus.svg" },
  { name: "SQL Server", iconPath: "/tech_icons/mssql.svg" },
  { name: "DynamoDB", iconPath: "/tech_icons/dynamodb.svg" },
  { name: "Elasticsearch", iconPath: "/tech_icons/elasticsearch.svg" },
  { name: "k6", iconPath: "/tech_icons/k6-logo.webp" },
  { name: "JMeter", iconPath: "/tech_icons/jmeter.svg" },
  { name: "Jenkins", iconPath: "/tech_icons/jenkins.svg" },
  { name: "GitHub Actions", iconPath: "/tech_icons/githubactions.svg" },
  { name: "Gradle", iconPath: "/tech_icons/gradle.svg" },
  { name: "REST API", iconPath: "/tech_icons/rest.svg" },
  // Peripheral
  { name: "JavaScript", iconPath: "/tech_icons/javascript.webp" },
  { name: "React", iconPath: "/tech_icons/react.svg" },
  { name: "Amazon S3", iconPath: "/tech_icons/s3.svg" },
  { name: "ActiveMQ", iconPath: "/tech_icons/activemq.svg" },
  { name: "RabbitMQ", iconPath: "/tech_icons/rabbit.webp" },
  { name: "Nginx", iconPath: "/tech_icons/nginx.svg" },
  { name: "Tomcat", iconPath: "/tech_icons/tomcat.webp" },
  { name: "Tailwind CSS", iconPath: "/tech_icons/tailwindcss.svg" },
  { name: "AngularJS", iconPath: "/tech_icons/angular.svg" },
  { name: "Graphite", iconPath: "/tech_icons/graphite.webp" },
];

const SPACING = 112; // centre-to-centre distance between neighbouring bubbles
const BUBBLE = 92; // rendered bubble diameter
const DOME_FALLOFF = 0.26; // how much smaller the furthest bubbles sit
const CURSOR_RADIUS = 190; // magnifier reach in px
const CURSOR_GAIN = 0.32; // peak extra scale under the cursor

// Explicit honeycomb rows, chosen so the counts sum to exactly the number of
// icons — no partial ring, so no orphan bubble dangling off the cluster.
const WIDE_ROWS = [6, 7, 6, 7, 6]; // 32, landscape
const NARROW_ROWS = [5, 4, 5, 4, 5, 4, 5]; // 32, portrait (small screens)

interface Point {
  x: number;
  y: number;
  base: number;
}

function buildLayout(rows: number[]) {
  const pts: Array<{ x: number; y: number }> = [];
  rows.forEach((count, rowIdx) => {
    // Rows sit √3/2 apart and alternate offset, which is what makes the
    // circles nest rather than stack in a square grid.
    const y = (rowIdx - (rows.length - 1) / 2) * SPACING * (Math.sqrt(3) / 2);
    for (let i = 0; i < count; i++) {
      pts.push({ x: (i - (count - 1) / 2) * SPACING, y });
    }
  });

  const maxX = Math.max(...pts.map((p) => Math.abs(p.x))) || 1;
  const maxY = Math.max(...pts.map((p) => Math.abs(p.y))) || 1;
  const topY = Math.min(...pts.map((p) => p.y));
  const spanY = maxY * 2 || 1;

  // The dome is anchored at the TOP centre rather than the middle, so the
  // headline tools read both highest and largest instead of fighting each other.
  const points: Point[] = pts.map((p) => {
    const d = Math.min(1, Math.hypot(p.x / maxX, (p.y - topY) / spanY));
    return { ...p, base: 1 - DOME_FALLOFF * Math.pow(d, 1.25) };
  });

  // Strict reading order: fill the top row first (centre outward), then the
  // next row down. technologies[0] lands top-centre, where the dome is largest.
  const order = points
    .map((_, i) => i)
    .sort((a, b) => points[a].y - points[b].y || Math.abs(points[a].x) - Math.abs(points[b].x));

  return {
    width: maxX * 2 + BUBBLE,
    height: maxY * 2 + BUBBLE,
    points,
    order,
  };
}

const TechStack = () => {
  const clusterRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [scale, setScale] = useState(1);
  const [narrow, setNarrow] = useState(false);

  // Layout is pure maths — it never reads the DOM.
  const layout = useMemo(() => buildLayout(narrow ? NARROW_ROWS : WIDE_ROWS), [narrow]);

  // Pick the row pattern that suits the available width, then shrink the whole
  // cluster to fit rather than reflowing it.
  useLayoutEffect(() => {
    const el = clusterRef.current?.parentElement;
    if (!el) return;
    const fit = () => {
      const avail = el.clientWidth;
      setNarrow(avail < 560);
      setScale(Math.min(1, avail / layout.width));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout.width]);

  // Bubbles in tech order: index 0 lands in the most central slot.
  const slots = useMemo(() => layout.order.map((idx) => layout.points[idx]), [layout]);

  const applyBase = useCallback(() => {
    slots.forEach((p, i) => {
      const node = nodeRefs.current[i];
      if (node) node.style.transform = `translate3d(-50%, -50%, 0) scale(${p.base})`;
    });
  }, [slots]);

  // Cursor magnifier. Every position is precomputed, so each frame is pure maths
  // plus one compositor-only transform write per bubble — no layout reads.
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) {
      applyBase();
      return;
    }

    let rafId = 0;
    let visible = true;
    let pointer: { x: number; y: number } | null = null;
    let rect = cluster.getBoundingClientRect();

    const measure = () => {
      rect = cluster.getBoundingClientRect();
    };

    const render = () => {
      rafId = 0;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < slots.length; i++) {
        const node = nodeRefs.current[i];
        if (!node) continue;
        const p = slots[i];
        let s = p.base;
        if (pointer) {
          // Bubble centre in viewport space, derived from cached numbers only.
          const bx = cx + p.x * scale;
          const by = cy + p.y * scale;
          const d = Math.hypot(pointer.x - bx, pointer.y - by);
          if (d < CURSOR_RADIUS) {
            const t = 1 - d / CURSOR_RADIUS;
            s += CURSOR_GAIN * t * t;
          }
        }
        node.style.transform = `translate3d(-50%, -50%, 0) scale(${s})`;
      }
    };

    const schedule = () => {
      if (!rafId && visible) rafId = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };

    // Only listen while the cluster is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          window.addEventListener("mousemove", onMove, { passive: true });
        } else {
          window.removeEventListener("mousemove", onMove);
          pointer = null;
          applyBase();
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(cluster);

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    cluster.addEventListener("mouseleave", onLeave);
    applyBase();

    return () => {
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      cluster.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [slots, scale, applyBase]);

  return (
    <section className="px-4 sm:px-6 py-24 relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">Tech Stack</h2>
        <p className="text-center text-slate-600 dark:text-white/60 mb-14 text-lg">
          Technologies I work with
        </p>

        <div className="flex justify-center">
          <div
            ref={clusterRef}
            className="relative"
            style={{
              width: layout.width * scale,
              height: layout.height * scale,
            }}
          >
            <ul className="contents">
              {technologies.map((tech, i) => {
                const p = slots[i];
                return (
                  <li
                    key={tech.name}
                    ref={(el) => (nodeRefs.current[i] = el)}
                    className="tech-bubble absolute group"
                    style={{
                      left: `calc(50% + ${p.x * scale}px)`,
                      top: `calc(50% + ${p.y * scale}px)`,
                      width: BUBBLE * scale,
                      height: BUBBLE * scale,
                      transform: `translate3d(-50%, -50%, 0) scale(${p.base})`,
                    }}
                  >
                    <button
                      type="button"
                      aria-label={tech.name}
                      className="w-full h-full rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <img
                        src={tech.iconPath}
                        alt=""
                        width="44"
                        height="44"
                        loading="lazy"
                        decoding="async"
                        className="w-[62%] h-[62%] object-contain pointer-events-none"
                      />
                    </button>
                    <span
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded-lg text-xs whitespace-nowrap text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20"
                      style={{ background: "var(--tooltip-bg)" }}
                    >
                      {tech.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
