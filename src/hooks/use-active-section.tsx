import { useState, useEffect } from 'react';

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? 'home');
  const key = ids.join(',');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3; // Check at top third of viewport
      
      // Find which section we're currently in
      for (let i = ids.length - 1; i >= 0; i--) {
        const section = document.getElementById(ids[i]);
        if (section) {
          const { top } = section.getBoundingClientRect();
          const sectionTop = top + window.scrollY;
          
          if (scrollPosition >= sectionTop) {
            setActive(ids[i]);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();
    
    // Listen to scroll events with throttling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}
