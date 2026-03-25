import { useEffect, useState, type RefObject } from 'react';
import { IoArrowUp } from 'react-icons/io5';
import { cn } from '@utils/cn';

type ExploreScrollToTopProps = {
  targetRef: RefObject<HTMLElement | null>;
  threshold?: number;
  className?: string;
};

const isScrollableElement = (element: HTMLElement | null) => {
  if (!element) return false;
  return element.scrollHeight > element.clientHeight;
};

export default function ExploreScrollToTop({
  targetRef,
  threshold = 480,
  className,
}: ExploreScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    const useWindow = !isScrollableElement(target);

    const toggleVisibility = () => {
      const nextScrollTop = useWindow ? window.scrollY : target?.scrollTop ?? 0;
      setIsVisible(nextScrollTop > threshold);
    };

    toggleVisibility();

    if (useWindow) {
      window.addEventListener('scroll', toggleVisibility, { passive: true });

      return () => window.removeEventListener('scroll', toggleVisibility);
    }

    target?.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => target?.removeEventListener('scroll', toggleVisibility);
  }, [targetRef, threshold]);

  const scrollToTop = () => {
    const target = targetRef.current;

    if (isScrollableElement(target)) {
      target?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로 가기"
      className={cn(
        'fixed bottom-[2rem] left-1/2 z-20 -translate-x-1/2 cursor-pointer transition-all duration-200',
        isVisible
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-[1.8rem] scale-[0.94] opacity-0',
        className,
      )}
    >
      <div className="flex items-center gap-[0.8rem] rounded-full bg-[linear-gradient(135deg,#1F2937_0%,#111827_100%)] px-[1.4rem] py-[1rem] text-white shadow-[0_16px_32px_rgba(17,24,39,0.26)] ring-1 ring-white/10 backdrop-blur">
        <div className="flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full bg-white/12">
          <IoArrowUp className="h-[1.6rem] w-[1.6rem]" />
        </div>
        <span className="button4 whitespace-nowrap text-white">맨 위로 가기</span>
      </div>
    </button>
  );
}
