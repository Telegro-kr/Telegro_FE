import Icon from '@components/common/icon';

type ErrorViewProps = {
  onGoHome: () => void;
};

const ErrorView = ({ onGoHome }: ErrorViewProps) => {
  return (
    <section className="relative max-h-screen overflow-hidden bg-[#FAFAFA] px-6 py-8">
      <header className="flex justify-center">
        <h1 className="font-['Readex_Pro',sans-serif] text-[1.7rem] font-medium tracking-[-0.03em] text-[#474747] md:text-[3rem] lg:text-[4rem]">
          - telegro -
        </h1>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[90rem] items-center justify-center">
        <div className="flex flex-col items-center gap-20">
          <div className="flex flex-col items-center gap-6">
            <Icon
              name="alert-error"
              size={18}
              className="text-[#2B2B2B]"
              ariaHidden={false}
              ariaLabel="오류"
            />
            <div className="text-center font-['Pretendard',sans-serif] text-[2rem] leading-[1.5] font-semibold text-[#2B2B2B]">
              <p>일시적인 오류입니다.</p>
              <p>잠시 후에 다시 시도해 주세요.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoHome}
            className="flex-row-center cursor-pointer rounded-[10px] bg-[#FFC633] px-[5rem] py-[1.2rem] text-[1.5625rem] font-bold tracking-[0.013rem] text-white transition hover:brightness-95"
          >
            홈으로
          </button>
        </div>
      </div>
    </section>
  );
};

export default ErrorView;
