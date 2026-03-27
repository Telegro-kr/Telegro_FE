import logoImage from '@/assets/images/Landing/logo.svg';

const sectionTitleClass =
  "font-['Pretendard',sans-serif] text-[1.3rem] font-semibold tracking-[0.08em] text-[#6b7280] uppercase";

const sectionBodyClass =
  "font-['Pretendard',sans-serif] text-[1.45rem] leading-[1.8] text-[#374151]";

const PublicFooter = () => {
  return (
    <footer className="border-t border-[#e5e7eb] bg-[#f7f8fa] px-6 py-10 text-[#121212] md:px-12 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex gap-8 border-b border-[#e5e7eb] pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="Telegro logo"
                className="h-[3.5rem] w-[3.5rem] rounded-full border border-[#e5e7eb]"
              />
              <div>
                <p className="font-['Pretendard',sans-serif] text-[2rem] font-semibold tracking-[-0.02em]">
                  Telegro
                </p>
                <p className="font-['Pretendard',sans-serif] text-[1.35rem] text-[#6b7280]">
                  텔레그로 공식 스토어
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[44rem]">
            <div className="flex gap-3 sm:flex-row">
              <a
                href="mailto:ykjroom@naver.com"
                className="flex min-h-[5.2rem] flex-1 items-center gap-3 rounded-[10px] border border-[#d1d5db] bg-white px-4"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-[#6b7280]"
                  aria-hidden="true"
                >
                  <path
                    d="M4 5H20C20.5523 5 21 5.44772 21 6V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V6C3 5.44772 3.44772 5 4 5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 7L12.5657 13.1195C12.215 13.3741 11.785 13.3741 11.4343 13.1195L3 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="min-w-0">
                  <p className="font-['Pretendard',sans-serif] text-[1.2rem] text-[#9ca3af]">
                    메일 문의
                  </p>
                  <p className="truncate font-['Pretendard',sans-serif] text-[1.45rem] text-[#111827]">
                    ykjroom@naver.com
                  </p>
                </div>
              </a>
              <a
                href="mailto:ykjroom@naver.com"
                className="inline-flex min-h-[5.2rem] items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white px-5 font-['Pretendard',sans-serif] text-[1.45rem] font-medium text-[#111827] transition-colors hover:bg-[#f3f4f6]"
              >
                메일 보내기
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-8 py-8 md:grid-cols-2 xl:grid-cols-[1fr_1.5fr_1fr]">
          <section className="space-y-3">
            <p className={sectionTitleClass}>Company</p>
            <div className={sectionBodyClass}>
              <p>텔레그로(서연전자)</p>
              <p>대표자명: 연경진</p>
              <p>사업자 등록번호: 215-18-12286</p>
              <p>통신판매업: 제 2024-서울광진-1511호</p>
              <p>고객센터: 070-4111-5733</p>
            </div>
          </section>

          <section className="space-y-3">
            <p className={sectionTitleClass}>Address</p>
            <div className={sectionBodyClass}>
              <p>
                주소: 서울특별시 광진구 광나루로56길 85 테크노마트 21 8층 A30,
                31호
              </p>
              <p>
                A/S 물류배송지: 경기도 남양주시 오남읍 양지로281번길 101
                로젠택배 평내영업소(서연전자)
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <p className={sectionTitleClass}>Notice</p>
            <div className={sectionBodyClass}>
              <p>문의 및 고객 응대는 운영 시간 내 순차적으로 안내드립니다.</p>
              <p>A/S 및 물류 관련 발송은 상기 배송지 정보를 확인해 주세요.</p>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e5e7eb] pt-5 font-['Pretendard',sans-serif] text-[1.3rem] text-[#9ca3af] md:flex-row md:items-center md:justify-between">
          <p>Telegro © 2024. All rights reserved.</p>
          <p>Telegro 공식 스토어</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
