import { useEffect, useRef } from 'react';

type UseInfiniteScrollTriggerParams = {
  enabled: boolean;
  onLoadMore: () => Promise<unknown> | unknown;
  rootMargin?: string;
};

export function useInfiniteScrollTrigger({
  enabled,
  onLoadMore,
  rootMargin = '320px',
}: UseInfiniteScrollTriggerParams) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) {
      return;
    }

    let locked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || locked) {
          return;
        }

        locked = true;
        void Promise.resolve(onLoadMore()).finally(() => {
          locked = false;
        });
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onLoadMore, rootMargin]);

  return targetRef;
}
