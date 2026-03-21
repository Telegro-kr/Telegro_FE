type NotFoundViewProps = {
  onGoHome: () => void;
};

const NotFoundView = ({ onGoHome }: NotFoundViewProps) => {
  return (
    <section className="relative max-h-screen overflow-hidden bg-[#FAFAFA] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[90rem] items-center justify-center">
        <div className="flex-col-center gap-20">
          <div className="flex-col-center -gap-2">
            <img
              src="/404.svg"
              alt="404 페이지를 찾을 수 없습니다"
              className="h-[33rem] w-[50rem] max-w-full object-contain"
            />
            <div className="flex-col-center -mt-[5rem] gap-1 text-center">
              <p className="title1">찾으시는 페이지가 없습니다.</p>
              <p className="text-2xl font-medium text-[#6D6D6D]">
                잘못된 접근이거나 요청하신 페이지를 찾을 수 없습니다. <br />
                입력하신 페이지의 주소가 정확한지 다시 한 번 확인해 주시기
                바랍니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoHome}
            className="flex-row-center cursor-pointer rounded-[10px] bg-[#FFC633] px-[5rem] py-[1.2rem] font-['Pretendard',sans-serif] text-[1.5625rem] font-bold tracking-[0.013rem] text-white transition hover:brightness-95"
          >
            홈으로
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundView;
