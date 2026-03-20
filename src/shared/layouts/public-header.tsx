import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@components/common/icon';

type NavItem = {
  name: string;
  path: string;
  match: (pathname: string) => boolean;
};

const productPath = '/products';
const noticePath = '/notices';

const navItems: NavItem[] = [
  {
    name: 'Headset',
    path: productPath,
    match: (pathname) => pathname.startsWith('/products'),
  },
  {
    name: 'Linecode',
    path: productPath,
    match: (pathname) => pathname.startsWith('/products'),
  },
  {
    name: 'Recorder',
    path: productPath,
    match: (pathname) => pathname.startsWith('/products'),
  },
  {
    name: 'Accessory',
    path: productPath,
    match: (pathname) => pathname.startsWith('/products'),
  },
];

export default function PublicHeader() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsExploreOpen(false);
  }, [location.pathname]);

  const isNoticeActive = useMemo(
    () => location.pathname.startsWith(noticePath),
    [location.pathname],
  );

  return (
    <header className="relative z-20 px-6 py-4 md:px-12 lg:px-16">
      <div className="mx-auto flex min-h-[8rem] max-w-[1440px] items-start justify-between py-2 md:min-h-[9.6rem]">
        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setIsExploreOpen((prev) => !prev)}
            className="flex items-center gap-4 text-[#121212]"
            aria-expanded={isExploreOpen}
            aria-controls="public-nav-menu"
          >
            <span className="font-['Pretendard',sans-serif] text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.4rem] lg:text-[2.8rem]">
              Explore
            </span>

            <span
              className={`inline-flex rounded-full transition-all duration-300 ${
                isExploreOpen ? 'bg-[#FEFFD5]' : ''
              }`}
            >
              <Icon name="explore" size={3} />
            </span>
          </button>

          <div
            id="public-nav-menu"
            className={`absolute top-4 left-full ml-20 transition-all duration-200 ${
              isExploreOpen
                ? 'pointer-events-auto translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-2 opacity-0'
            }`}
          >
            <nav className="flex min-w-max flex-col gap-6 bg-transparent">
              {navItems.map((item) => {
                const isActive = item.match(location.pathname);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-['Pretendard',sans-serif] text-[2rem] leading-none font-normal whitespace-nowrap text-[#4A4A4A] transition-all duration-200 md:text-[3.6rem] lg:text-[2rem] ${
                      isActive
                        ? 'underline decoration-[0.15rem] underline-offset-[0.8rem]'
                        : 'hover:underline hover:decoration-[0.15rem] hover:underline-offset-[0.8rem]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <Link to="/" className="absolute top-1 left-1/2 -translate-x-1/2">
          <h1 className="font-['Readex_Pro',sans-serif] text-[2rem] font-medium tracking-[-0.03em] text-[#474747] md:text-[3rem] lg:text-[4rem]">
            - telegro -
          </h1>
        </Link>

        <div className="relative z-10 flex shrink-0 flex-col items-end gap-7 md:gap-8">
          <button
            type="button"
            aria-label="Search"
            className="cursor-pointer place-items-center rounded-full p-2 transition-colors hover:bg-black/5"
          >
            <Icon
              name="search"
              size={3}
              className="text-[#121212]"
              ariaHidden={false}
              ariaLabel="Search"
            />
          </button>

          <Link
            to={productPath}
            aria-label="Products"
            className="place-items-center rounded-full p-2 transition-colors hover:bg-black/5"
          >
            <Icon
              name="notice"
              size={3}
              className="text-[#121212]"
              ariaHidden={false}
              ariaLabel="Notice"
            />
          </Link>

          <Link
            to={noticePath}
            aria-label="Notices"
            className="place-items-center rounded-full px-2 py-1 transition-colors hover:bg-black/5"
          >
            <span className="relative inline-flex">
              <Icon
                name="alarm"
                size={3}
                ariaHidden={false}
                ariaLabel="Notification"
              />
              <span
                className={`absolute top-1 right-1 h-2.5 w-2.5 rounded-full ${
                  isNoticeActive ? 'bg-transparent' : 'bg-[#FF4B4E]'
                }`}
              />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
