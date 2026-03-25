import NoticePopup from '@components/notice/notice-popup';
import {
  getPopNotice,
  useRecordHits,
  type NoticeDetailDTO,
} from '@apis/telegro';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import headsetImage from '../../assets/images/Landing/headset.svg';
import productImage1 from '../../assets/images/Landing/image1.png';
import productImage2 from '../../assets/images/Landing/image2.png';
import productImage3 from '../../assets/images/Landing/image3.png';
import productImage4 from '../../assets/images/Landing/image4.png';

const productPath = '/products';
const noticePath = '/notices';
const HOME_HIT_GUARD_KEY = 'public-home-hit-recorded-at';
const HOME_HIT_GUARD_MS = 1500;
const NOTICE_POPUP_DISMISS_KEY = 'public-home-notice-popup-dismiss-until';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const readNoticePopupDismissMap = (): Record<string, number> => {
  const rawValue = localStorage.getItem(NOTICE_POPUP_DISMISS_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
  } catch {
    localStorage.removeItem(NOTICE_POPUP_DISMISS_KEY);
    return {};
  }
};

const writeNoticePopupDismissMap = (value: Record<string, number>) => {
  localStorage.setItem(NOTICE_POPUP_DISMISS_KEY, JSON.stringify(value));
};

const isNoticePopupDismissed = (noticeId: number) => {
  const dismissMap = readNoticePopupDismissMap();
  const dismissUntil = dismissMap[String(noticeId)];

  if (!Number.isFinite(dismissUntil)) {
    return false;
  }

  if (dismissUntil <= Date.now()) {
    delete dismissMap[String(noticeId)];
    writeNoticePopupDismissMap(dismissMap);
    return false;
  }

  return true;
};

const floatingLinks = [
  {
    label: 'Accessory',
    path: productPath,
    className: 'border-2 border-black bg-white text-[#474747]',
    delay: '0ms',
    left: '3.4rem',
    top: '2.1rem',
    rotate: '-13.56deg',
  },
  {
    label: 'Notice',
    path: noticePath,
    className: 'bg-black text-white',
    delay: '90ms',
    left: '33.2rem',
    top: '0rem',
    rotate: '22.72deg',
  },
  {
    label: 'Headset',
    path: productPath,
    className: 'border-2 border-black bg-white text-[#474747]',
    delay: '180ms',
    left: '0rem',
    top: '11.2rem',
    rotate: '13.74deg',
  },
  {
    label: 'Recorder',
    path: productPath,
    className: 'border-2 border-black bg-white text-[#474747]',
    delay: '270ms',
    left: '17.5rem',
    top: '6.3rem',
    rotate: '-10.15deg',
  },
  {
    label: 'Linecord',
    path: productPath,
    className: 'border-2 border-black bg-white text-[#474747]',
    delay: '360ms',
    left: '27.2rem',
    top: '13.5rem',
    rotate: '0deg',
  },
];

const mobileLinks = [
  {
    label: 'Accessory',
    path: productPath,
    dark: false,
    delay: '0ms',
    rotate: '-10deg',
  },
  {
    label: 'Notice',
    path: noticePath,
    dark: true,
    delay: '90ms',
    rotate: '14deg',
  },
  {
    label: 'Headset',
    path: productPath,
    dark: false,
    delay: '180ms',
    rotate: '8deg',
  },
  {
    label: 'Recorder',
    path: productPath,
    dark: false,
    delay: '270ms',
    rotate: '-8deg',
  },
  {
    label: 'Linecord',
    path: productPath,
    dark: false,
    delay: '360ms',
    rotate: '0deg',
  },
];

const productCards = [
  { title: 'headset', image: productImage1, path: productPath },
  { title: 'recording', image: productImage2, path: productPath },
  { title: 'accessory', image: productImage3, path: productPath },
  { title: 'linecord', image: productImage4, path: productPath },
];

const marqueeCards = [...productCards, ...productCards];

const PublicHome = () => {
  const { mutate: recordHits } = useRecordHits();
  const navigate = useNavigate();
  const [popupNotice, setPopupNotice] = useState<NoticeDetailDTO | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const lastRecordedAt = Number(sessionStorage.getItem(HOME_HIT_GUARD_KEY));

    if (
      Number.isFinite(lastRecordedAt) &&
      now - lastRecordedAt < HOME_HIT_GUARD_MS
    ) {
      return;
    }

    sessionStorage.setItem(HOME_HIT_GUARD_KEY, String(now));
    recordHits();
  }, [recordHits]);

  useEffect(() => {
    let isMounted = true;

    const loadPopupNotice = async () => {
      try {
        const popupResponse = await getPopNotice({ withCredentials: false });
        const notice = popupResponse.data;
        const noticeId = notice?.id;

        if (!isMounted || !noticeId || isNoticePopupDismissed(noticeId)) {
          return;
        }

        setPopupNotice(notice);
        setIsPopupOpen(true);
      } catch {
        setPopupNotice(null);
        setIsPopupOpen(false);
      }
    };

    void loadPopupNotice();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDismissPopupToday = () => {
    if (!popupNotice?.id) {
      setIsPopupOpen(false);
      return;
    }

    const dismissMap = readNoticePopupDismissMap();
    dismissMap[String(popupNotice.id)] = Date.now() + ONE_DAY_MS;
    writeNoticePopupDismissMap(dismissMap);
    setIsPopupOpen(false);
  };

  const handleOpenPopupNotice = () => {
    if (!popupNotice?.id) {
      return;
    }

    setIsPopupOpen(false);
    navigate(`/notices/${popupNotice.id}`);
  };

  return (
    <>
      {popupNotice && isPopupOpen ? (
        <NoticePopup
          notice={popupNotice}
          onClose={handleClosePopup}
          onDismissToday={handleDismissPopupToday}
          onOpenNotice={handleOpenPopupNotice}
        />
      ) : null}

      <section className="relative flex items-center justify-center overflow-x-clip overflow-y-visible px-6 pt-6 pb-28 md:min-h-[60rem] md:px-12 md:pt-8 lg:px-16 lg:pt-4">
        <div className="relative mx-auto w-full">
          <div className="flex-row-center pointer-events-none absolute inset-0">
            <h2 className="bg-gradient-to-r from-[#666666] via-[#363636] to-[#000000] bg-clip-text font-['Pretendard',sans-serif] text-[8rem] font-extrabold tracking-[0.01em] whitespace-nowrap text-transparent uppercase sm:text-[12rem] md:text-[18rem] lg:text-[22rem] xl:text-[25rem]">
              premium telegro
            </h2>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div className="relative h-[25rem] w-[25rem] sm:h-[30rem] sm:w-[30rem] md:h-[40rem] md:w-[40rem] lg:h-[50rem] lg:w-[50rem]">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(244,227,194,0.45)_42%,_rgba(250,250,250,0)_70%)] blur-3xl" />
              <img
                src={headsetImage}
                alt="Telegro premium headset"
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>

          <div className="absolute top-1/2 right-0 hidden translate-y-[20rem] lg:block">
            <div className="relative h-[34rem] w-[50rem] overflow-visible pb-8">
              {floatingLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="absolute motion-safe:animate-[desktop-link-drop_980ms_cubic-bezier(0.2,0.9,0.2,1)_both]"
                  style={{
                    left: item.left,
                    top: item.top,
                    animationDelay: item.delay,
                  }}
                >
                  <div
                    className={`rounded-[2rem] px-8 py-3 font-['Pretendard',sans-serif] text-[2.4rem] font-medium whitespace-nowrap shadow-[0_18px_36px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 ${item.className}`}
                    style={{ transform: `rotate(${item.rotate})` }}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-visible px-6 pt-8 pb-14 md:px-12 lg:hidden">
        <div className="mx-auto flex max-w-[60rem] flex-wrap justify-center gap-x-4 gap-y-6 overflow-visible pb-6">
          {mobileLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block motion-safe:animate-[mobile-link-drop_900ms_cubic-bezier(0.2,0.9,0.2,1)_both]"
              style={{
                animationDelay: item.delay,
              }}
            >
              <div
                className={`rounded-[1.4rem] px-6 py-2 font-['Pretendard',sans-serif] text-[1.8rem] font-medium shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 ${
                  item.dark
                    ? 'bg-black text-white'
                    : 'border-2 border-black bg-white text-[#474747]'
                }`}
                style={{ transform: `rotate(${item.rotate})` }}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-18 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-4">
              <h3 className="font-['Pretendard',sans-serif] text-[2.6rem] font-medium tracking-[-0.03em] text-[#474747] md:text-[3.2rem]">
                about us
              </h3>
              <p className="font-['Pretendard',sans-serif] text-[1.9rem] leading-[1.7] font-normal text-[#21272a] md:text-[2.2rem] lg:text-[2.6rem]">
                기술과 품질로 고객 여러분의 만족을 최우선 합니다.
              </p>
              <p className="font-['Pretendard',sans-serif] text-[2.1rem] font-bold text-[#21272a] md:text-[2.6rem]">
                프리미엄 헤드셋과 녹음 장비 브랜드
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end">
              <div className="relative flex gap-8">
                <div className="flex items-center gap-4 rounded-full bg-[#f5f2ec] px-[3rem] py-[1rem]">
                  <span className="font-['Pretendard',sans-serif] text-[3.2rem] font-bold text-[#4a4a4a] md:text-[4rem] lg:text-[4.2rem]">
                    Telegro
                  </span>
                </div>
                <div className="mt-2 text-right">
                  <p className="font-['Inter',sans-serif] text-[1.4rem] font-bold text-black md:text-[1.6rem] lg:text-[1.8rem]">
                    기술개발 전문제조 공급 유통
                  </p>
                  <p className="font-['Pretendard',sans-serif] text-[1.9rem] font-bold text-[#4a4a4a] md:text-[2.2rem] lg:text-[2.6rem]">
                    헤드셋 녹취 장비 전문
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-16 md:py-24">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#fafafa] to-transparent md:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#fafafa] to-transparent md:w-20" />
          <div className="flex w-max gap-8 px-6 motion-safe:animate-[product-marquee_28s_linear_infinite] md:gap-10 md:px-12 lg:gap-12 lg:px-16">
            {marqueeCards.map((card, index) => (
              <Link
                key={`${card.title}-${index}`}
                to={card.path}
                className="group block shrink-0"
              >
                <article className="relative h-[42rem] w-[28rem] overflow-hidden rounded-[4rem] bg-gradient-to-b from-[#f5f2ec] to-[#fff3d5] md:h-[50rem] md:w-[34rem] lg:h-[59.1rem] lg:w-[40rem]">
                  <div className="absolute top-8 left-8 z-10">
                    <h4 className="font-['Prata',serif] text-[2.6rem] tracking-[-0.03em] text-[#474747] md:text-[3rem]">
                      {card.title}
                    </h4>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-10 md:p-12">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicHome;
