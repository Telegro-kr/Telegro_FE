import { router } from '@routes/router';
import { useEffect, useSyncExternalStore } from 'react';

const ScrollToTop = () => {
  const pathname = useSyncExternalStore(
    router.subscribe,
    () => router.state.location.pathname,
    () => router.state.location.pathname,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
