// Remembers where the visitor was on the homepage when they opened a sub-page, so going
// back lands on the same view. The position is stored relative to a section, not as a raw
// pixel offset, because lazy images and fetched content shift the layout after mount.
const KEY = "home-return-position";

export const saveReturnPosition = (sectionId: string) => {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const offset = window.scrollY - (el.getBoundingClientRect().top + window.scrollY);
  sessionStorage.setItem(KEY, JSON.stringify({ sectionId, offset }));
};

// Re-applies the saved position every frame until the layout stops moving (or the
// visitor scrolls themselves), then gives up after a few seconds.
export const restoreReturnPosition = () => {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return () => {};
  const { sectionId, offset } = JSON.parse(raw) as { sectionId: string; offset: number };

  let frame = 0;
  let stableFrames = 0;
  const started = performance.now();

  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };

  const tick = () => {
    const el = document.getElementById(sectionId);
    if (el) {
      const target = el.getBoundingClientRect().top + window.scrollY + offset;
      if (Math.abs(window.scrollY - target) > 1) {
        window.scrollTo({ top: target, behavior: "instant" });
        stableFrames = 0;
      } else {
        stableFrames += 1;
      }
    }
    if (stableFrames < 30 && performance.now() - started < 4000) {
      frame = requestAnimationFrame(tick);
    } else {
      stop();
    }
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  frame = requestAnimationFrame(tick);
  return stop;
};
