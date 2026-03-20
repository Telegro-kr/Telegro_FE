import { Link } from 'react-router-dom';
import headsetImage from '../../assets/images/Landing/headset.svg';
import productImage1 from '../../assets/images/Landing/image1.png';
import productImage2 from '../../assets/images/Landing/image2.png';
import productImage3 from '../../assets/images/Landing/image3.png';

const productPath = '/products';
const noticePath = '/notices';

const floatingLinks = [
  {
    label: 'Accessory',
    path: productPath,
    className:
      'left-[3.4rem] top-[2.1rem] rotate-[-13.56deg] border-2 border-black bg-white text-[#474747]',
    delay: '0ms',
  },
  {
    label: 'Notice',
    path: noticePath,
    className: 'left-[33.2rem] top-0 rotate-[22.72deg] bg-black text-white',
    delay: '90ms',
  },
  {
    label: 'Headset',
    path: productPath,
    className:
      'left-0 top-[11.2rem] rotate-[13.74deg] border-2 border-black bg-white text-[#474747]',
    delay: '180ms',
  },
  {
    label: 'Recorder',
    path: productPath,
    className:
      'left-[17.5rem] top-[6.3rem] rotate-[-10.15deg] border-2 border-black bg-white text-[#474747]',
    delay: '270ms',
  },
  {
    label: 'Linecode',
    path: productPath,
    className:
      'left-[27.2rem] top-[13.5rem] rotate-0 border-2 border-black bg-white text-[#474747]',
    delay: '360ms',
  },
];

const mobileLinks = [
  { label: 'Accessory', path: productPath, dark: false, delay: '0ms' },
  { label: 'Notice', path: noticePath, dark: true, delay: '90ms' },
  { label: 'Headset', path: productPath, dark: false, delay: '180ms' },
  { label: 'Recorder', path: productPath, dark: false, delay: '270ms' },
  { label: 'Linecode', path: productPath, dark: false, delay: '360ms' },
];

const productCards = [
  { title: 'headset', image: productImage1, path: productPath },
  { title: 'recording', image: productImage2, path: productPath },
  { title: 'accessory', image: productImage3, path: productPath },
];

export default function PublicHome() {
  return (
    <>
      <section className="relative flex min-h-[60rem] items-center justify-center overflow-hidden px-6 pb-20 pt-32 md:min-h-[70rem] md:px-12 lg:px-16">
        <div className="relative mx-auto w-full max-w-[1440px]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <h2 className="whitespace-nowrap bg-gradient-to-r from-[#666666] via-[#363636] to-[#000000] bg-clip-text font-['Pretendard',sans-serif] text-[8rem] font-extrabold uppercase tracking-[0.01em] text-transparent sm:text-[12rem] md:text-[18rem] lg:text-[22rem] xl:text-[25rem]">
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

          <div className="absolute right-0 top-1/2 hidden translate-y-[20rem] lg:block">
            <div className="relative h-[30rem] w-[50rem]">
              {floatingLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`absolute rounded-[2rem] px-8 py-3 font-['Pretendard',sans-serif] text-[2.4rem] font-medium whitespace-nowrap shadow-[0_18px_36px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 motion-safe:animate-[landing-fade-up_700ms_ease-out_both] ${item.className}`}
                  style={{ animationDelay: item.delay }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:px-12 lg:hidden">
        <div className="mx-auto flex max-w-[60rem] flex-wrap justify-center gap-4">
          {mobileLinks.map((item) => (
            <Link key={item.label} to={item.path}>
              <div
                className={`rounded-[1.4rem] px-6 py-2 font-['Pretendard',sans-serif] text-[1.8rem] font-medium shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 motion-safe:animate-[landing-fade-up_700ms_ease-out_both] ${
                  item.dark
                    ? 'bg-black text-white'
                    : 'border-2 border-black bg-white text-[#474747]'
                }`}
                style={{ animationDelay: item.delay }}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-4">
              <h3 className="font-['Pretendard',sans-serif] text-[2.6rem] font-medium tracking-[-0.03em] text-[#474747] md:text-[3.2rem]">
                about us
              </h3>
              <p className="font-['Pretendard',sans-serif] text-[1.9rem] font-normal leading-[1.7] text-[#21272a] md:text-[2.2rem] lg:text-[2.6rem]">
                기술과 품질로 고객 여러분의 만족을 최우선 합니다.
              </p>
              <p className="font-['Pretendard',sans-serif] text-[2.1rem] font-bold text-[#21272a] md:text-[2.6rem]">
                프리미엄 헤드셋과 녹음 장비 브랜드
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end">
              <div className="relative">
                <div className="flex items-center gap-4 rounded-full bg-[#f5f2ec] px-8 py-6">
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

      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {productCards.map((card) => (
              <Link key={card.title} to={card.path} className="group block">
                <article className="relative h-[50rem] overflow-hidden rounded-[5rem] bg-gradient-to-b from-[#f5f2ec] to-[#fff3d5] md:h-[55rem] lg:h-[59.1rem]">
                  <div className="absolute left-8 top-8 z-10">
                    <h4 className="font-['Prata',serif] text-[2.6rem] tracking-[-0.03em] text-[#474747] md:text-[3rem]">
                      {card.title}
                    </h4>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-12">
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
}
