import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";
import { readdirSync, statSync, readFileSync } from "fs";

const getGitCommits = (): number => {
  try { return parseInt(execSync("git rev-list --count HEAD", { encoding: "utf8" }).trim()); }
  catch { return 0; }
};

const countLines = (dir: string, exts: string[]): number => {
  let total = 0;
  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const full = `${d}/${entry}`;
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (exts.some(e => full.endsWith(e))) {
        total += readFileSync(full, "utf8").split("\n").length;
      }
    }
  };
  walk(dir);
  return total;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
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
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
}));
