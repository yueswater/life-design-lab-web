import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top whenever the route changes. Skips when only the state
// object changes (e.g. the scrollTo hand-off used by the nav tabs), since
// that navigation handles its own scroll position.
export const ScrollToTop = () => {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if ((state as { scrollTo?: string } | null)?.scrollTo) return;
    window.scrollTo(0, 0);
  }, [pathname, state]);

  return null;
};
