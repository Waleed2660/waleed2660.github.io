import { useState, useEffect } from 'react';

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? 'home');
  const key = ids.join(',');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -40% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}
