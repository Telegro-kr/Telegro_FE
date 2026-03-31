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
  const onLoadMoreRef = useRef(onLoadMore);
  const triggeredWhileVisibleRef = useRef(false);

  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) {
      triggeredWhileVisibleRef.current = false;
      return;
    }

    let locked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        if (!entry.isIntersecting) {
          triggeredWhileVisibleRef.current = false;
          return;
        }

        if (locked || triggeredWhileVisibleRef.current) {
          return;
        }

        locked = true;
        triggeredWhileVisibleRef.current = true;
        void Promise.resolve(onLoadMoreRef.current()).finally(() => {
          locked = false;
        });
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin]);

  return targetRef;
}
