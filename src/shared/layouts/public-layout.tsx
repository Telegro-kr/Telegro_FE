import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logoImage from '../../assets/images/Landing/logo.svg';
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

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-[#fafafa] text-[#121212]">
      <PublicHeader />
      <main className="w-full">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

function PublicHeader() {
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
            className="flex cursor-pointer items-center gap-2 text-[#121212] transition-opacity hover:opacity-80"
            aria-expanded={isExploreOpen}
            aria-controls="public-nav-menu"
          >
            <span className="font-['Pretendard',sans-serif] text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.4rem] lg:text-[2.8rem]">
              Explore
            </span>
            <button
              className={`cursor-pointer rounded-full transition-transform duration-300 ${isExploreOpen ? 'bg-[#FEFFD5]' : ''}`}
            >
              <Icon name="explore" size={3} />
            </button>
          </button>

          <div
            id="public-nav-menu"
            className={`absolute top-full left-0 mt-4 min-w-[18rem] rounded-[2rem] border border-black/10 bg-white p-2 shadow-[0_24px_48px_rgba(0,0,0,0.12)] transition-all duration-200 ${
              isExploreOpen
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
          >
            {navItems.map((item) => {
              const isActive = item.match(location.pathname);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block rounded-[1.4rem] px-6 py-4 font-['Pretendard',sans-serif] text-[1.8rem] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#f5f2ec] text-[#121212]'
                      : 'text-[#474747] hover:bg-[#f8f4ee]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
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
            className="place-items-center rounded-full p-2 transition-colors hover:bg-black/5"
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

function PublicFooter() {
  return (
    <footer className="relative z-10 bg-[rgba(9,9,9,0.8)] px-6 py-12 text-white md:px-12 lg:px-16">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div className="flex items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-[4.2rem] w-[4.2rem] items-center justify-center rounded-full bg-[#c1c7cd]">
              <img
                src={logoImage}
                alt="Telegro logo"
                className="h-[3.4rem] w-[3.4rem]"
              />
            </div>
            <span className="font-['Roboto',sans-serif] text-[2.4rem] font-bold text-[#c1c7cd]">
              Telegro
            </span>
          </div>

          <div className="flex w-full gap-4 sm:flex-row lg:ml-12 lg:w-auto lg:max-w-[60rem] lg:flex-1">
            <div className="flex flex-1 items-center gap-2 border-b border-[#c1c7cd] bg-[#f2f4f8] px-4 py-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                  stroke="rgba(9,9,9,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6L12 13L2 6"
                  stroke="rgba(9,9,9,0.8)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="email"
                placeholder="Enter your email to get the latest news..."
                className="flex-1 bg-transparent font-['Roboto',sans-serif] text-[1.5rem] text-[rgba(9,9,9,0.8)] outline-none placeholder:text-[rgba(9,9,9,0.45)]"
              />
            </div>
            <button
              type="button"
              className="border-2 border-[#ffc633] bg-[#ffc633] px-6 py-3 font-['Roboto',sans-serif] text-[1.6rem] font-medium whitespace-nowrap text-[#121212] transition-colors hover:bg-[#ffb700]"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="h-px bg-[#c1c7cd]" />

        <div className="space-y-4">
          <p className="font-['Noto_Sans_KR',sans-serif] text-[1.8rem] font-bold">
            텔레그로(서연전자)
          </p>
          <div className="space-y-2 font-['Noto_Sans_KR',sans-serif] text-[1.5rem] font-medium text-[#e8e8e8]">
            <p>
              주소: 서울특별시 광진구 광나루로56길 85 테크노마트 21 8층 A30,
              31호
            </p>
            <p>고객센터: 070-4111-5733</p>
            <p>
              A/S 물료배송지: 경기도 남양주시 오남읍 양지로281번길 101로젠택배
              평내영업소(서연전자)
            </p>
            <p>사업자 등록번호: 215-18-12286</p>
          </div>
        </div>

        <div className="h-px bg-[#c1c7cd]" />

        <p className="font-['Roboto',sans-serif] text-[1.3rem] text-[#e8e8e8]">
          Telegro @ 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
