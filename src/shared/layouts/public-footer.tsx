import logoImage from '@/assets/images/Landing/logo.svg';

export default function PublicFooter() {
  return (
    <footer className="relative z-10 bg-[rgba(9,9,9,0.8)] px-6 py-12 text-white md:px-12 lg:px-16">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div className="flex items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-[4.2rem] w-[4.2rem] items-center justify-center rounded-full bg-[#c1c7cd]">
              <img src={logoImage} alt="Telegro logo" className="h-[3.4rem] w-[3.4rem]" />
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
          <p className="font-['Noto_Sans_KR',sans-serif] text-[1.6rem] font-bold">
            텔레그로(서연전자)
          </p>
          <div className="space-y-2 font-['Noto_Sans_KR',sans-serif] text-[1.5rem] font-medium text-[#e8e8e8]">
            <p>주소: 서울특별시 광진구 광나루로56길 85 테크노마트 21 8층 A30, 31호</p>
            <p>고객센터: 070-4111-5733</p>
            <p>
              A/S 물류배송지: 경기도 남양주시 오남읍 양지로281번길 101로젠택배 평내영업소(서연전자)
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
