import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logoImage from '../../assets/images/Landing/logo.svg';

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
      <main className="w-full pt-24 md:pt-28">
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#fafafa]/95 px-6 py-4 backdrop-blur-md md:px-12 lg:px-16">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsExploreOpen((prev) => !prev)}
            className="flex items-center gap-2 text-[#121212] transition-opacity hover:opacity-80"
            aria-expanded={isExploreOpen}
            aria-controls="public-nav-menu"
          >
            <span className="font-['Pretendard',sans-serif] text-[2rem] font-semibold tracking-[-0.03em] md:text-[2.4rem] lg:text-[2.8rem]">
              Explore
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`transition-transform duration-300 ${isExploreOpen ? 'rotate-90' : ''}`}
            >
              <path
                d="M7 4L13 10L7 16"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            id="public-nav-menu"
            className={`absolute left-0 top-full mt-4 min-w-[18rem] rounded-[2rem] border border-black/10 bg-white p-2 shadow-[0_24px_48px_rgba(0,0,0,0.12)] transition-all duration-200 ${
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

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <h1 className="font-['Readex_Pro',sans-serif] text-[2rem] font-medium tracking-[-0.03em] text-[#474747] md:text-[3rem] lg:text-[4rem]">
            - telegro -
          </h1>
        </Link>

        <div className="flex items-center gap-5 md:gap-8">
          <button
            type="button"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-black/5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="7" stroke="#121212" strokeWidth="2" />
              <path
                d="M15 15L21 21"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <Link
            to={productPath}
            aria-label="Products"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-black/5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            to={noticePath}
            aria-label="Notices"
            className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-black/5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                fill="#FFC633"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full ${
                isNoticeActive ? 'bg-[#121212]' : 'bg-[#FF4B4E]'
              }`}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[rgba(9,9,9,0.8)] px-6 py-12 text-white md:px-12 lg:px-16">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-[4.2rem] w-[4.2rem] items-center justify-center rounded-full bg-[#c1c7cd]">
              <img src={logoImage} alt="Telegro logo" className="h-[3.4rem] w-[3.4rem]" />
            </div>
            <span className="font-['Roboto',sans-serif] text-[2.4rem] font-bold text-[#c1c7cd]">
              Telegro
            </span>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row lg:ml-12 lg:w-auto lg:max-w-[60rem] lg:flex-1">
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
              className="whitespace-nowrap border-2 border-[#ffc633] bg-[#ffc633] px-6 py-3 font-['Roboto',sans-serif] text-[1.6rem] font-medium text-[#121212] transition-colors hover:bg-[#ffb700]"
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
            <p>주소: 서울특별시 광진구 광나루로56길 85 테크노마트 21 8층 A30, 31호</p>
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
