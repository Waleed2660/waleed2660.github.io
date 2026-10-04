import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { execSync } from "child_process";
import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";

const getGitCommits = (): number => {
  if (process.env.GIT_COMMIT_COUNT) return parseInt(process.env.GIT_COMMIT_COUNT, 10);
  try {
    return parseInt(execSync("git rev-list --count HEAD", { encoding: "utf8" }).trim());
  } catch {
    return 0;
  }
};

const countLines = (dir: string, exts: string[]): number => {
  let total = 0;
  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const full = `${d}/${entry}`;
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (exts.some((e) => full.endsWith(e))) {
        total += readFileSync(full, "utf8").split("\n").length;
      }
    }
  };
  walk(dir);
  return total;
};

// Keep in sync with CAREER_START in src/components/HomeSection.tsx
const getYOE = (): number =>
  Math.floor((Date.now() - new Date(2022, 6, 1).getTime()) / (1000 * 60 * 60 * 24 * 365.25));

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: "inject-yoe",
      transformIndexHtml: (html: string) => html.replaceAll("%YOE%", String(getYOE())),
    },
    {
      // GitHub Pages has no SPA fallback, so emit dissertation.html to serve /dissertation with a 200.
      name: "dissertation-page",
      apply: "build" as const,
      closeBundle() {
        const title = "Detecting Landfill Sites through YOLOv3 | Waleed Tariq";
        const desc =
          "Waleed Tariq's dissertation on detecting landfill sites from drone imagery using the YOLOv3 object detection model.";
        const url = "https://waleedtariq.com/dissertation";
        const html = readFileSync("dist/index.html", "utf8")
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
          .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
          .replace(
            /(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g,
            `$1${title}`
          )
          .replace(
            /(<meta\s+(?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*/g,
            `$1${desc}`
          )
          .replace(
            /<noscript>[\s\S]*?<\/noscript>/,
            `<noscript><h1>${title}</h1><p>${desc}</p></noscript>`
          );
        writeFileSync("dist/dissertation.html", html);
      },
    },
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __GIT_COMMITS__: getGitCommits(),
    __LINES_OF_CODE__: countLines("src", [".tsx", ".ts", ".css"]),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
}));
